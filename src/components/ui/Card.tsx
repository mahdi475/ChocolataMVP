import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

const Card = ({ className, children, variant = 'default', ...props }: CardProps) => {
  return (
    <div className={clsx(styles.card, styles[variant], className)} {...props}>
      {children}
    </div>
  );
};

export default Card;

