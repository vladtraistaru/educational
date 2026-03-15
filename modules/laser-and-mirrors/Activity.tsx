'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import styles from './Activity.module.css';
import {
  DEFAULT_LASER_POS, DEFAULT_LASER_ANGLE, DEFAULT_MIRRORS,
  type Point, type Mirror,
} from './optics';
import OpticsCanvas from './OpticsCanvas';

export default function OpticsStudy1(_props: ActivityProps) {
  const [laserOn, setLaserOn] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [laserPos, setLaserPos] = useState(DEFAULT_LASER_POS);
  const [laserAngle, setLaserAngle] = useState(DEFAULT_LASER_ANGLE);
  const [mirrors, setMirrors] = useState<Mirror[]>(DEFAULT_MIRRORS);
  const nextId = useRef(2);
  const { language } = useLanguage();
  const t = translations[language];

  const handleToggle = () => {
    const wasOff = !laserOn;
    setLaserOn(!laserOn);
    if (wasOff) setAnimating(true);
  };

  useEffect(() => {
    if (!animating) return;
    const id = setTimeout(() => setAnimating(false), 900);
    return () => clearTimeout(id);
  }, [animating]);

  const stopAnimation = useCallback(() => setAnimating(false), []);

  const addMirror = () => {
    const id = nextId.current++;
    setMirrors((prev) => [
      ...prev,
      { id, pos: { x: 300 + id * 40, y: 200 }, angle: -Math.PI / 4 },
    ]);
  };

  const handleMirrorChange = useCallback(
    (id: number, pos: Point, angle: number) => {
      setMirrors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, pos, angle } : m)),
      );
    },
    [],
  );

  return (
    <>
      <div className={styles.buttonRow}>
        <button
          className={`${laserOn ? shared.btnDanger : shared.btnPrimary} ${styles.toggleBtn}`}
          onClick={handleToggle}
        >
          {laserOn ? '⏹' : '💡'} {laserOn ? t.turnOff : t.shine}
        </button>
        <button
          className={`${shared.btnSecondary} ${styles.toggleBtn}`}
          onClick={addMirror}
        >
          + {t.addMirror}
        </button>
      </div>

      <OpticsCanvas
        laserOn={laserOn}
        animating={animating}
        laserPos={laserPos}
        laserAngle={laserAngle}
        mirrors={mirrors}
        onLaserPosChange={setLaserPos}
        onLaserAngleChange={setLaserAngle}
        onMirrorChange={handleMirrorChange}
        onInteractionStart={stopAnimation}
      />
    </>
  );
}
