'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getModuleBySlug, getModuleMetadata } from '@/modules/registry';
import { useLanguage } from '@/lib/language';
import { SUBJECT_LABELS, UI_LABELS } from '@/lib/types';
import LanguageSelector from './LanguageSelector';
import styles from './Header.module.css';

export default function Header() {
  const { language } = useLanguage();
  const ui = UI_LABELS[language];
  const slug = usePathname().match(/^\/activity\/([^/]+)/)?.[1];
  const mod = slug ? getModuleBySlug(slug) : undefined;
  const crumbs = mod
    ? [
        { label: ui.home, href: '/' },
        { label: SUBJECT_LABELS[language][mod.subject] },
        { label: getModuleMetadata(mod.slug, language)?.title ?? mod.title },
      ]
    : [];

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          {crumbs.length > 0 ? (
            <nav aria-label="breadcrumb" className={styles.breadcrumb}>
              <ul>
                {crumbs.map((crumb, i) => {
                  const isLast = i === crumbs.length - 1;
                  return (
                    <li key={i}>
                      {crumb.href && !isLast ? (
                        <Link href={crumb.href}>{crumb.label}</Link>
                      ) : (
                        crumb.label
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : (
            <Link href="/" className={styles.wordmark}>
              <span className={styles.mark} aria-hidden="true" />
              {ui.platformTitle}
            </Link>
          )}
          <div className={styles.spacer} />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
