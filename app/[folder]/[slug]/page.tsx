import { getAllContent } from '@/lib/utils';
import PortfolioClient from '@/components/PortfolioClient';
import { Metadata } from 'next';

// This is required for static export on GitHub Pages to generate all possible paths at build time
export async function generateStaticParams() {
    const content = await getAllContent();
    return content.map((item) => ({
        folder: item.folder,
        slug: item.id.split('/').pop(), // Extract slug from id e.g 'writing/on-time' -> 'on-time'
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ folder: string, slug: string }> }): Promise<Metadata> {
    const { folder, slug } = await params;
    const content = await getAllContent();
    const item = content.find(i => i.id === slug && i.folder === folder);

    if (!item) {
        return {
            title: 'Not Found | Tarunika',
        };
    }

    const title = item.title || 'Untitled';
    const ogImageUrl = `/og/${slug}.png`;

    return {
        title: `${title} | Tarunika`,
        description: item.abstract || `${title} by Tarunika`,
        openGraph: {
            title: title,
            description: item.abstract || `${title} by Tarunika`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: item.abstract || `${title} by Tarunika`,
            images: [ogImageUrl],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ folder: string, slug: string }> }) {
    const { folder, slug } = await params;
    const content = await getAllContent();
    const item = content.find(i => i.id === slug && i.folder === folder);
    
    // Pass the actual item ID matched, or just the slug
    const initialFileId = item ? item.id : slug;
    
    return <PortfolioClient initialContent={content} initialActiveFileId={initialFileId} />;
}
