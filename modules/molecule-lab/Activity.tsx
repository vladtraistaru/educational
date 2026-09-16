'use client';

import { useEffect, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import LabMode from './LabMode';
import MissionMode from './MissionMode';
import { MOLECULES } from './molecules';
import translations from './translations';
import styles from './Activity.module.css';

type Mode = 'lab' | 'missions';

const STORAGE_KEY = 'molecule-lab:discovered';

function loadDiscovered(): Set<string> {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    const known = new Set(MOLECULES.map((m) => m.id));
    return new Set(Array.isArray(ids) ? ids.filter((id) => known.has(id)) : []);
  } catch {
    return new Set();
  }
}

function saveDiscovered(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // storage unavailable — discoveries last for this visit only
  }
}

export default function Activity({}: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [mode, setMode] = useState<Mode>('lab');
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDiscovered(loadDiscovered());
  }, []);

  const discover = (id: string) => {
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      saveDiscovered(next);
      return next;
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs} role="tablist">
        {(['lab', 'missions'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? styles.tabActive : styles.tab}
            onClick={() => setMode(m)}
          >
            {m === 'lab' ? t.tabLab : t.tabMissions}
          </button>
        ))}
      </div>

      {mode === 'lab' ? (
        <LabMode discovered={discovered} onDiscover={discover} />
      ) : (
        <MissionMode onDiscover={discover} />
      )}
    </div>
  );
}
