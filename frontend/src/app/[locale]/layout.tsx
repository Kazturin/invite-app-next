import { Metadata } from 'next';
import "@/app/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { roboto } from "@/app/fonts";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import Script from 'next/script';
import { Toaster } from 'sonner';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' }); // Using Navigation namespace for common site-wide titles if possible or a general site namespace

  return {
    metadataBase: new URL('https://toi-invite.kz'),
    title: {
      template: "%s | toi-invite.kz",
      default: "toi-invite.kz",
    },
    alternates: {
      canonical: locale === 'kk' ? '/' : `/${locale}`,
      languages: {
        'kk': '/',
        'ru': '/ru',
        'x-default': '/',
      },
    },
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const children = props.children;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${roboto.variable}`}>
      <body className={`antialiased font-roboto`}>
        <NextIntlClientProvider messages={messages}>
          <Toaster position="top-right" richColors />
          <Script id="yandex-metrika" strategy="lazyOnload">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(96119899, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
              });
            `}
          </Script>
          <noscript>
            <div>
              <img src="https://mc.yandex.ru/watch/96119899" style={{ position: 'absolute', left: '-9999px' }} alt="" />
            </div>
          </noscript>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
