import { Metadata } from 'next';
import "@/app/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { roboto } from "@/app/fonts";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' }); // Using Navigation namespace for common site-wide titles if possible or a general site namespace

  return {
    title: {
      template: "%s | toi-invite.kz",
      default: "toi-invite.kz",
    },
    alternates: {
      languages: {
        'kk': '/kk',
        'ru': '/ru',
      },
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${roboto.variable}`}>
      <body className={`antialiased font-roboto`}>
        <NextIntlClientProvider messages={messages}>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
