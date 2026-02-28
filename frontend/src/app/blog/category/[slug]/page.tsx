import React from 'react';
import { Metadata } from 'next';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
};

const getImageUrl = (path?: string | null) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'https://toi-invite.kz';
    return `${baseUrl}/storage/${path}`;
};

async function getCategoryData(slug: string, page = 1) {
    try {
        const res = await apiClient.get(`/blog/category/${slug}?page=${page}`);
        return res.data;
    } catch (err) {
        return null;
    }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const data = await getCategoryData(slug, page);

    if (!data || !data.category) {
        return { title: 'Блог санаты | toi-invite.kz' };
    }

    const categoryName = data.category.title || data.category.name || 'Санат';
    const title = `${categoryName} | Блог | toi-invite.kz`;

    return {
        title,
        openGraph: {
            title,
            type: 'website',
            url: `https://toi-invite.kz/blog/category/${slug}`,
        }
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const data = await getCategoryData(slug, page);

    if (!data || !data.category) {
        notFound();
    }

    const { category, posts } = data;

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b">
                <div className="container mx-auto px-5 py-8">
                    <Link href="/blog" className="text-gray-500 hover:text-amber-500 mb-4 inline-flex items-center text-sm font-medium transition">
                        ← Блогқа қайту
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mt-2">
                        Санат: <span className="text-amber-600">{category.title || category.name}</span>
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-5 pt-12">
                {posts && posts.data && posts.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {posts.data.map((post: any) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition duration-300 hover:shadow-md hover:-translate-y-1">
                                    {post.thumbnail && (
                                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                                            <img
                                                src={getImageUrl(post.thumbnail)}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="text-xl font-medium mb-3 text-gray-900 group-hover:text-amber-500 transition-colors line-clamp-3 leading-snug">
                                            {post.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm mt-auto border-t pt-4">
                                            {new Date(post.published_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {posts.last_page > 1 && (
                            <div className="mt-16 flex justify-center space-x-2">
                                {posts.prev_page_url && (
                                    <Link href={`/blog/category/${slug}?page=${page - 1}`} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition">
                                        ←
                                    </Link>
                                )}
                                {Array.from({ length: posts.last_page }).map((_, i) => {
                                    const p = i + 1;
                                    if (p === 1 || p === posts.last_page || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <Link key={i} href={`/blog/category/${slug}?page=${p}`} className={`px-4 py-2 border rounded-lg transition ${page === p ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-amber-600'}`}>
                                                {p}
                                            </Link>
                                        )
                                    } else if (p === page - 2 || p === page + 2) {
                                        return <span key={i} className="px-3 py-2 text-gray-400">...</span>
                                    }
                                    return null;
                                })}
                                {posts.next_page_url && (
                                    <Link href={`/blog/category/${slug}?page=${page + 1}`} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition">
                                        →
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-lg">Бұл санатта әлі мақалалар жоқ.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
