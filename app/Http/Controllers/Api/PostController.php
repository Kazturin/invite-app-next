<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    public function home()
    {
        $data = Cache::remember('posts.home', 3600, function () {
            $latestPost = Post::where('active', '=', 1)
                ->orderBy('published_at', 'desc')
                ->limit(1)
                ->first();

            // Show the most popular 3 posts based on upvotes
            $popularPosts = Post::query()
                ->leftJoin('post_views', 'posts.id', '=', 'post_views.post_id')
                ->select('posts.*', DB::raw('COUNT(post_views.id) as view_count'))
                ->where('active', '=', 1)
                ->orderByDesc('view_count')
                ->groupBy([
                    'posts.id',
                    'posts.title',
                    'posts.slug',
                    'posts.thumbnail',
                    'posts.body',
                    'posts.active',
                    'posts.published_at',
                    'posts.user_id',
                    'posts.created_at',
                    'posts.updated_at',
                    'posts.meta_title',
                    'posts.meta_description',
                ])
                ->limit(3)
                ->get();

            // Show recent categories with their latest posts
            $categories = Category::query()
                ->whereHas('posts', function ($query) {
                    $query
                        ->where('active', '=', 1);
                })
                ->with(['posts' => function ($query) {
                    // Limit to 5 posts per category to optimize payload
                    $query->where('active', '=', 1);
                }])
                ->select('categories.*')
                ->selectRaw('MAX(posts.published_at) as max_date')
                ->leftJoin('category_post', 'categories.id', '=', 'category_post.category_id')
                ->leftJoin('posts', 'posts.id', '=', 'category_post.post_id')
                ->orderByDesc('max_date')
                ->groupBy([
                    'categories.id',
                    'categories.title',
                    'categories.slug',
                    'categories.created_at',
                    'categories.updated_at',
                ])
                ->limit(5)
                ->get();

            return [
                'latestPost' => $latestPost,
                'popularPosts' => $popularPosts,
                'categories' => $categories
            ];
        });

        return response()->json($data);
    }

    public function show(Post $post, Request $request)
    {
        if (!$post->active || $post->published_at > Carbon::now()) {
            throw new NotFoundHttpException();
        }

        $next = Post::query()
            ->where('active', true)
            ->whereDate('published_at', '<=', Carbon::now())
            ->whereDate('published_at', '<', $post->published_at)
            ->orderBy('published_at', 'desc')
            ->limit(1)
            ->first();

        $prev = Post::query()
            ->where('active', true)
            ->whereDate('published_at', '<=', Carbon::now())
            ->whereDate('published_at', '>', $post->published_at)
            ->orderBy('published_at', 'asc')
            ->limit(1)
            ->first();

        // user('sanctum') could be null if not authenticated
        $user = $request->user('sanctum');
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        // Check if there's a recent view (e.g., within the last 24 hours) from this user or IP+UserAgent
        $recentView = PostView::where('post_id', $post->id)
            ->where(function ($query) use ($user, $ip, $userAgent) {
                if ($user) {
                    $query->where('user_id', $user->id);
                } else {
                    $query->where('ip_address', $ip)
                          ->where('user_agent', $userAgent);
                }
            })
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->exists();

        if (!$recentView) {
            PostView::create([
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'post_id' => $post->id,
                'user_id' => $user?->id
            ]);
        }

        // Load categories or any other relations for the post
        $post->load('categories');

        return response()->json([
            'post' => $post,
            'next' => $next,
            'prev' => $prev
        ]);
    }

    public function byCategory(Category $category)
    {
        $posts = Post::query()
            ->join('category_post', 'posts.id', '=', 'category_post.post_id')
            ->where('category_post.category_id', '=', $category->id)
            ->where('active', '=', true)
            ->whereDate('published_at', '<=', Carbon::now())
            ->orderBy('published_at', 'desc')
            ->select('posts.*')
            ->paginate(10);

        return response()->json([
            'category' => $category,
            'posts' => $posts
        ]);
    }

    public function search(Request $request)
    {
        $q = $request->get('q');

        $posts = Post::query()
            ->where('active', '=', true)
            ->whereDate('published_at', '<=', Carbon::now())
            ->orderBy('published_at', 'desc')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%$q%")
                    ->orWhere('body', 'like', "%$q%");
            })
            ->paginate(10);

        return response()->json([
            'posts' => $posts
        ]);
    }
}
