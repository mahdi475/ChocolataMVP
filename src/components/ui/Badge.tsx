import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'dark';
  className?: string;
}

const Badge = ({ children, variant = 'gold', className }: BadgeProps) => {
  return (
    <span className={clsx(styles.badge, styles[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;

