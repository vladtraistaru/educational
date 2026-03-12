'use client';

import Link from 'next/link';
import { useBreadcrumbs } from '@/lib/breadcrumb';
import LanguageSelector from './LanguageSelector';
import styles from './Header.module.css';

export default function Header() {
  const { crumbs } = useBreadcrumbs();

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          {crumbs.length > 0 && (
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
          )}
          <div className={styles.spacer} />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
