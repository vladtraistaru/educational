import { ICONS, type IconId } from './icons';

interface PixelIconProps {
  id: IconId;
  className?: string;
}

export default function PixelIcon({ id, className }: PixelIconProps) {
  const { palette, rows } = ICONS[id];
  return (
    <svg viewBox="0 0 8 8" className={className} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((char, x) =>
          palette[char] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[char]} />
          ) : null,
        ),
      )}
    </svg>
  );
}
