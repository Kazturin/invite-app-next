import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import FeatureSection from '@/components/sections/FeatureSection';
import DownloadSection from '@/components/sections/DownloadSection';
import StepsSection from '@/components/sections/StepsSection';
import { Metadata } from 'next';
import apiClient from '@/lib/api-client';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('og_title'),
      description: t('description'),
      type: 'website',
      url: 'https://toi-invite.kz',
      images: [
        {
          url: '/logo-without-text.png',
          width: 800,
          height: 600,
          alt: 'Toi-Invite Logo',
        },
      ],
    }
  };
}


async function getTemplateCategories() {
  try {
    const res = await apiClient.get('/template-categories');
    return res.data.data;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export default async function Home() {
  const categories = await getTemplateCategories();

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <HeroSection />

      <div className="bg-gradient-to-b from-transparent to-gray-50">
        <FeatureSection initialCategories={categories} />
      </div>

      <DownloadSection />

      <div className="bg-gray-50/50">
        <StepsSection />
      </div>
    </main>
  );
}
