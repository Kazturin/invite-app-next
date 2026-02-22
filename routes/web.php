<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\SiteController;
use App\Models\GuestInvite;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\Template;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->group(function () {
// Route::get('/debug-php-config', function () {
//     return response()->json([
//         'upload_max_filesize' => ini_get('upload_max_filesize'),
//         'post_max_size' => ini_get('post_max_size'),
//         'memory_limit' => ini_get('memory_limit'),
//     ]);
// });
Route::prefix('blog')->group(function () {

    Route::get('/', [PostController::class, 'home'])->name('home');
    Route::get('/search', [PostController::class, 'search'])->name('search');
    Route::get('/about-us', [SiteController::class, 'about'])->name('about-us');
    Route::get('/category/{category:slug}', [PostController::class, 'byCategory'])->name('by-category');
    Route::get('/{post:slug}', [PostController::class, 'show'])->name('view');
});
//});
Route::get('/toi/{event:slug}/{guest?}/{lang?}', function (\App\Models\Event $event, ?string $lang = 'kk') {
  //dd(GuestInvite::where('invite_code', '5ea86ddb-8407-459b-8fd5-20de430bf3d5')->first());
    return view('app', [
        'lang' => $lang, 
        'title' => $event->title, 
        'image' => $event->invitation->invitation_img
    ]);
});

Route::get('{any}', function () {
    $path = request()->path();
    $validPrefixes = ['app', 'auth', 'toi', 'feedback', 'forbidden'];

    if (!in_array(explode('/', $path)[0], $validPrefixes) && $path !== '/') {
        return response()->view('welcome', [], 404);
    }
    return view('welcome');
})->where('any', '.*');

Route::get('/404', function () {
    return response()->view('app', [], 404);
})->name('not-found');

//require __DIR__.'/auth.php';
//Route::get('/test',[\App\Http\Api\EventController::class,'store']);
