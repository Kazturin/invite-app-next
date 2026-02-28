import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

type Props = {
    params: Promise<{ slug: string }>;
};

const getImageUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'https://toi-invite.kz';
    return `${baseUrl}/storage/${path}`;
};

async function getPostData(slug: string, reqHeaders?: Record<string, string>) {
    try {
        const res = await apiClient.get(`/blog/${slug}`, {
            headers: reqHeaders || {}
        });
        return res.data;
    } catch (err) {
        return null;
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const data = await getPostData(slug);
    if (!data || !data.post) {
        return { title: 'Not Found' };
    }
    const post = data.post;
    const title = post.meta_title || post.title || 'Мақала';
    const description = post.meta_description || '';
    const imageUrl = getImageUrl(post.thumbnail);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `https://toi-invite.kz/blog/${slug}`,
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const headersList = await headers();

    // Forward real IP and User-Agent to the backend for accurate view counting
    const forwardedHeaders: Record<string, string> = {};
    const forwardedFor = headersList.get('x-forwarded-for') || headersList.get('x-real-ip');
    const userAgentHeader = headersList.get('user-agent');
    if (forwardedFor) forwardedHeaders['x-forwarded-for'] = forwardedFor;
    if (userAgentHeader) forwardedHeaders['user-agent'] = userAgentHeader;

    const data = await getPostData(slug, forwardedHeaders);

    if (!data || !data.post) {
        notFound();
    }

    const { post, next, prev } = data;

    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-5 py-8">
                    <Link href="/blog" className="text-gray-500 hover:text-amber-500 inline-flex items-center text-sm font-medium transition">
                        ← Блогқа қайту
                    </Link>
                </div>
            </div>
            <article className="container mx-auto px-5 max-w-4xl pt-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center justify-between text-gray-500 border-b pb-6 mb-8 text-sm">
                    <div className="flex items-center space-x-4">
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        {post.categories && post.categories.length > 0 && (
                            <>
                                <span>•</span>
                                <div className="flex space-x-2">
                                    {post.categories.map((c: any) => (
                                        <Link key={c.id} href={`/blog/category/${c.slug}`} className="hover:text-amber-500 transition">
                                            {c.title || c.name}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="hidden sm:block text-gray-400">
                        {/* Dummy views for design purposes if not mapped, removed real mapping overhead */}
                    </div>
                </div>

                {post.thumbnail && (
                    <div className="mb-10 rounded-2xl overflow-hidden shadow-lg h-64 md:h-[500px] w-full relative bg-gray-100">
                        <img
                            src={getImageUrl(post.thumbnail)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg md:prose-xl max-w-none text-gray-800 prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-headings:font-bold prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.body }}
                />

                {/* Next and Prev navigation */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-6">
                    {prev && prev.slug ? (
                        <Link href={`/blog/${prev.slug}`} className="flex-1 group p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition bg-gray-50 hover:bg-white text-left">
                            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block group-hover:text-amber-600 transition">Алдыңғы мақала</span>
                            <h4 className="text-lg font-medium text-gray-900 line-clamp-2">{prev.title}</h4>
                        </Link>
                    ) : <div className="flex-1" />}

                    {next && next.slug ? (
                        <Link href={`/blog/${next.slug}`} className="flex-1 group p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition bg-gray-50 hover:bg-white text-left sm:text-right">
                            <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block group-hover:text-amber-600 transition">Келесі мақала</span>
                            <h4 className="text-lg font-medium text-gray-900 line-clamp-2">{next.title}</h4>
                        </Link>
                    ) : <div className="flex-1" />}
                </div>
            </article>
        </main>
    );
}
