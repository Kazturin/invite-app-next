import React from 'react';
import { Metadata } from 'next';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import '../post.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Блог | toi-invite.kz',
    description: 'Тойға шақыруға арналған қызықты мақалалар мен жаңалықтар',
    openGraph: {
        title: 'Блог | toi-invite.kz',
        description: 'Тойға шақыруға арналған қызықты мақалалар мен жаңалықтар',
        url: 'https://toi-invite.kz/blog',
        type: 'website',
    }
};

async function getBlogHomeData() {
    try {
        const res = await apiClient.get('/blog');
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.error('Error fetching blog home:', err);
        return null;
    }
}

const getImageUrl = (path?: string | null) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'https://toi-invite.kz';
    return `${baseUrl}/storage/${path}`;
};

export default async function BlogPage() {
    const data = await getBlogHomeData();

    if (!data) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <h1 className="text-2xl text-gray-700">Ақпарат табылмады</h1>
            </main>
        );
    }

    const { latestPost, popularPosts, categories } = data;

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="container mx-auto px-5 pt-10">
                <h1 className="text-4xl font-bold mb-10 text-gray-900 border-b pb-4">Блог</h1>

                {/* Latest Post */}
                {latestPost && (
                    <div className="mb-16">
                        <Link href={`/blog/${latestPost.slug}`} className="group block">
                            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col md:flex-row">
                                {latestPost.thumbnail && (
                                    <div className="md:w-1/2 h-64 md:h-96 relative overflow-hidden bg-gray-200">
                                        <img
                                            src={getImageUrl(latestPost.thumbnail)}
                                            alt={latestPost.title}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-amber-500 transition-colors">
                                        {latestPost.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {latestPost.meta_description || (latestPost.body ? latestPost.body.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : '')}
                                    </p>
                                    <span className="text-amber-600 font-medium flex items-center">
                                        Толығырақ оқу <span className="ml-2">→</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Popular Posts */}
                {popularPosts && popularPosts.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 inline-block border-amber-500">Ең көп оқылған</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {popularPosts.map((post: any) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition duration-300 hover:shadow-xl hover:-translate-y-1">
                                    {post.thumbnail && (
                                        <div className="h-48 overflow-hidden bg-gray-200">
                                            <img
                                                src={getImageUrl(post.thumbnail)}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-amber-500 transition-colors line-clamp-2">
                                            {post.title}
                                        </h4>
                                        <p className="text-gray-500 text-sm mt-auto pt-4">
                                            {new Date(post.published_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories */}
                {categories && categories.length > 0 && categories.map((cat: any) => {
                    if (!cat.posts || cat.posts.length === 0) return null;
                    return (
                        <div key={cat.id} className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">{cat.title || cat.name}</h3>
                                <Link href={`/blog/category/${cat.slug}`} className="text-amber-600 hover:text-amber-700 font-medium">
                                    Барлығын көру →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {cat.posts.slice(0, 4).map((post: any) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition duration-300 hover:shadow-md hover:-translate-y-1">
                                        {post.thumbnail && (
                                            <div className="h-40 overflow-hidden bg-gray-100">
                                                <img
                                                    src={getImageUrl(post.thumbnail)}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h4 className="text-lg font-medium mb-2 text-gray-800 group-hover:text-amber-500 transition-colors line-clamp-3">
                                                {post.title}
                                            </h4>
                                            <p className="text-gray-400 text-xs mt-auto pt-4">
                                                {new Date(post.published_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
