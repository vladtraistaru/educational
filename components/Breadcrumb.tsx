import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav aria-label="breadcrumb">
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
  );
}
