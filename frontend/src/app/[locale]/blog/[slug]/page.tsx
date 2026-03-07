import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import '../../post.css';


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
    const description = post.meta_description || 'fghjkl';
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

                {/* Share Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between py-6 border-t border-b border-gray-100">
                    <span className="text-gray-600 font-medium mb-4 sm:mb-0">Бұл мақаламен бөлісіңіз:</span>
                    <div className="flex items-center space-x-4">
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}%20https://toi-invite.kz/blog/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-[#E8F8F5] text-[#25D366] rounded-full hover:bg-[#D1F1E8] hover:scale-110 transition-transform shadow-sm"
                            aria-label="Share on WhatsApp"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.127.554 4.195 1.608 6.014L.16 23.367l5.485-1.438a11.972 11.972 0 006.386 1.831h.005c6.643 0 12.03-5.385 12.03-12.032 0-3.218-1.253-6.246-3.528-8.523A11.964 11.964 0 0012.031 0zm0 21.758a9.982 9.982 0 01-5.092-1.38l-.365-.216-3.784.992.999-3.69-.237-.378A10.005 10.005 0 011.996 12.03c0-5.545 4.512-10.055 10.038-10.055 2.686 0 5.21 1.047 7.11 2.946a10.05 10.05 0 012.94 7.123c-.001 5.543-4.512 10.053-10.037 10.053l-.016-.001v.001zm5.503-7.525c-.302-.151-1.786-.882-2.062-.983-.277-.101-.478-.151-.68.151-.202.302-.782.983-.956 1.185-.175.202-.349.227-.651.076-.302-.151-1.275-.471-2.428-1.503-.897-.803-1.503-1.796-1.678-2.098-.175-.302-.019-.465.132-.616.136-.136.302-.352.453-.528.151-.176.202-.302.302-.503.1-.202.05-.378-.025-.528-.076-.151-.68-1.638-.93-2.242-.244-.59-.492-.51-.68-.52-.175-.01-.376-.01-.577-.01-.202 0-.528.076-.803.378-.277.302-1.056 1.033-1.056 2.52 0 1.488 1.081 2.924 1.232 3.126.151.202 2.13 3.252 5.161 4.56.721.31 1.282.496 1.723.635.726.231 1.387.198 1.905.12.584-.088 1.786-.731 2.038-1.436.252-.705.252-1.309.176-1.436-.076-.126-.277-.202-.579-.353z" /></svg>
                        </a>
                        <a
                            href={`https://t.me/share/url?url=https://toi-invite.kz/blog/${slug}&text=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-[#E3F2FD] text-[#0088CC] rounded-full hover:bg-[#BBDEFB] hover:scale-110 transition-transform shadow-sm"
                            aria-label="Share on Telegram"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=https://toi-invite.kz/blog/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-[#E8EAF6] text-[#1877F2] rounded-full hover:bg-[#C5CAE9] hover:scale-110 transition-transform shadow-sm"
                            aria-label="Share on Facebook"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Next and Prev navigation */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-6">
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
