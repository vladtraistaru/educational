'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import styles from './Activity.module.css';
import {
  DEFAULT_LASER_POS, DEFAULT_LASER_ANGLE,
  DEFAULT_MIRROR_POS, DEFAULT_MIRROR_ANGLE,
} from './optics';
import OpticsCanvas from './OpticsCanvas';

export default function OpticsStudy1(_props: ActivityProps) {
  const [laserOn, setLaserOn] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [laserPos, setLaserPos] = useState(DEFAULT_LASER_POS);
  const [laserAngle, setLaserAngle] = useState(DEFAULT_LASER_ANGLE);
  const [mirrorPos, setMirrorPos] = useState(DEFAULT_MIRROR_POS);
  const [mirrorAngle, setMirrorAngle] = useState(DEFAULT_MIRROR_ANGLE);
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

  return (
    <>
      <button
        className={`${laserOn ? shared.btnDanger : shared.btnPrimary} ${styles.toggleBtn}`}
        onClick={handleToggle}
      >
        {laserOn ? '⏹' : '💡'} {laserOn ? t.turnOff : t.shine}
      </button>

      <OpticsCanvas
        laserOn={laserOn}
        animating={animating}
        laserPos={laserPos}
        laserAngle={laserAngle}
        mirrorPos={mirrorPos}
        mirrorAngle={mirrorAngle}
        onLaserPosChange={setLaserPos}
        onLaserAngleChange={setLaserAngle}
        onMirrorPosChange={setMirrorPos}
        onMirrorAngleChange={setMirrorAngle}
        onInteractionStart={stopAnimation}
      />
    </>
  );
}
