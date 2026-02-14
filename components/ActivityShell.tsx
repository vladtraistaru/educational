import styles from './ActivityShell.module.css';

interface ActivityShellProps {
  description?: string;
  children: React.ReactNode;
}

export default function ActivityShell({
  description,
  children,
}: ActivityShellProps) {
  return (
    <div className={styles.shell}>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
