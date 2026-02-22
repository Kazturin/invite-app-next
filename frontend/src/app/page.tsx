import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import FeatureSection from '@/components/sections/FeatureSection';
import DownloadSection from '@/components/sections/DownloadSection';
import StepsSection from '@/components/sections/StepsSection';
import { Metadata } from 'next';
import apiClient from '@/lib/api-client';

export const metadata: Metadata = {
  title: 'Toi-Invite - Онлайн шақыру билеттерін жасау',
  description: 'Маманның көмегінсіз өз бетіңізше онлайн шақыру билеттерін, сайттарын жасаңыз. Үйлену тойы, Қыз ұзату, Мерейтой және т.б. Шақыру сайты арқылы қонақтарды шақыру, RSVP жауаптарын алу.',
  keywords: 'онлайн шақыру, тойға шақыру, қыз ұзату, пригласительные онлайн, той-инвайт, электронды шақыру',
  openGraph: {
    title: 'Toi-Invite - Онлайн шақыру билеттерін жасау',
    description: 'Маманның көмегінсіз өз бетіңізше онлайн шақыру билеттерін, сайттарын жасаңыз.',
    type: 'website',
    url: 'https://toi-invite.kz',
  }
};

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
