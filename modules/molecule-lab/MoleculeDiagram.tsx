import { ELEMENTS } from '@/lib/science/chemistry';
import type { Bond, Molecule } from './molecules';
import styles from './Activity.module.css';

const PADDING = 0.6;
const BOND_GAP = 0.13;
const UNIT_PX = 72;

function BondLines({ molecule, bond }: { molecule: Molecule; bond: Bond }) {
  const [ia, ib, order] = bond;
  const a = molecule.atoms[ia];
  const b = molecule.atoms[ib];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const lines = Math.max(order, 1);

  return (
    <>
      {Array.from({ length: lines }, (_, i) => {
        const offset = (i - (lines - 1) / 2) * BOND_GAP;
        return (
          <line
            key={i}
            x1={a.x + nx * offset}
            y1={a.y + ny * offset}
            x2={b.x + nx * offset}
            y2={b.y + ny * offset}
            className={order === 0 ? styles.bondIonic : styles.bond}
          />
        );
      })}
    </>
  );
}

export default function MoleculeDiagram({ molecule, label }: { molecule: Molecule; label: string }) {
  const xs = molecule.atoms.map((a) => a.x);
  const ys = molecule.atoms.map((a) => a.y);
  const minX = Math.min(...xs) - PADDING;
  const minY = Math.min(...ys) - PADDING;
  const width = Math.max(...xs) - Math.min(...xs) + PADDING * 2;
  const height = Math.max(...ys) - Math.min(...ys) + PADDING * 2;

  return (
    <svg
      className={styles.diagram}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      width={width * UNIT_PX}
      height={height * UNIT_PX}
      role="img"
      aria-label={label}
    >
      {molecule.bonds.map((bond, i) => (
        <BondLines key={i} molecule={molecule} bond={bond} />
      ))}
      {molecule.atoms.map((atom, i) => {
        const el = ELEMENTS[atom.el];
        return (
          <g key={i} className={styles.diagramAtom} style={{ animationDelay: `${i * 80}ms` }}>
            <circle cx={atom.x} cy={atom.y} r={el.radius} fill={el.color} className={styles.diagramCircle} />
            <text
              x={atom.x}
              y={atom.y}
              fill={el.textColor}
              fontSize={el.radius * 0.85}
              textAnchor="middle"
              dominantBaseline="central"
              className={styles.diagramText}
            >
              {atom.el}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
