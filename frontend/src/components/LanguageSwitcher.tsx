'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value;
        startTransition(() => {
            // NOTE: We're replacing the current route with the new locale
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <label className="w-20">
            <select
                className="mt-1 block w-full py-2 px-3 border-0 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                defaultValue={locale}
                disabled={isPending}
                onChange={onSelectChange}
                aria-label={t('language_select_label')}
            >
                <option value="kk">ҚАЗ</option>
                <option value="ru">РУС</option>
            </select>
        </label>
    );
}
