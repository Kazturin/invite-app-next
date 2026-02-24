import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import FeatureSection from '@/components/sections/FeatureSection';
import DownloadSection from '@/components/sections/DownloadSection';
import StepsSection from '@/components/sections/StepsSection';
import { Metadata } from 'next';
import apiClient from '@/lib/api-client';

export const metadata: Metadata = {
  title: 'Тойға онлайн шақырту жасау | toi-invite.kz',
  description: 'Тойға шақыру жасауға арналған, дайын әртүрлі дизайн үлгілері бар онлайн сервис! Үйлену тойы, туған күн, қыз ұзату тойларына, біз сізге стильді және есте қаларлық шақыруды оңай және креативті түрде жасауға мүмкіндік беретін құралды ұсынамыз. Бірнеше рет басу арқылы бірегей шақырулар жасаңыз.',
  keywords: 'тойға шақыру, интуитивный интерфейс, онлайн тойға шықыру, шақыру онлайн, қыз ұзату, үйлену тойы, электрондық шақырулар, шақыруларды жылдам жасау, эксклюзивті шақырулар, онлайн пригласительный, шақыру қағаз',
  openGraph: {
    title: 'Тойға шақыру жасау | toi-invite.kz',
    description: 'Тойға шақыру жасауға арналған интуитивті интерфейсті және дайын әртүрлі дизайн үлгілері бар онлайн сервис! Үйлену тойы, туған күн, қыз ұзату тойларына, біз сізге стильді және есте қаларлық шақыруды оңай және креативті түрде жасауға мүмкіндік беретін құралды ұсынамыз. Бірнеше рет басу арқылы бірегей шақырулар жасаңыз.',
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
