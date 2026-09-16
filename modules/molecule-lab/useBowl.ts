import { useEffect, useRef, useState } from 'react';
import type { ElementSymbol } from '@/lib/science/chemistry';
import { MAX_BOWL_ATOMS } from './lab';

const SHAKE_MS = 450;

export function useBowl() {
  const [atoms, setAtoms] = useState<ElementSymbol[]>([]);
  const [shake, setShake] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const add = (symbol: ElementSymbol) =>
    setAtoms((prev) => (prev.length >= MAX_BOWL_ATOMS ? prev : [...prev, symbol]));
  const remove = (index: number) => setAtoms((prev) => prev.filter((_, i) => i !== index));
  const clear = () => setAtoms([]);

  const shakeThen = (done: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    setShake(true);
    timer.current = setTimeout(() => {
      setShake(false);
      done();
    }, SHAKE_MS);
  };

  return { atoms, shake, add, remove, clear, shakeThen };
}
