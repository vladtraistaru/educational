import { useLanguage } from '@/lib/language';
import translations from './translations';
import { massColor } from './BeamStage';
import styles from './Activity.module.css';

interface TrayBlock {
  id: string;
  mass: number;
}

interface BlockTrayProps {
  blocks: TrayBlock[];
  selectedId: string | null;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export default function BlockTray({
  blocks,
  selectedId,
  disabled,
  onSelect,
}: BlockTrayProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.tray}>
      <span className={styles.trayLabel}>{t.tray}</span>
      <div className={styles.trayBlocks}>
        {blocks.length === 0 && (
          <span className={styles.trayEmpty}>{t.trayEmpty}</span>
        )}
        {blocks.map((block) => (
          <button
            key={block.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(block.id)}
            style={{ backgroundColor: massColor(block.mass) }}
            className={`${styles.trayBlock} ${
              selectedId === block.id ? styles.trayBlockSelected : ''
            }`}
          >
            {block.mass}
            <span className={styles.trayBlockUnit}>{t.kg}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
