import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hover?: boolean;
}

const Card = ({ className, children, variant = 'default', hover = false, ...props }: CardProps) => {
  return (
    <div className={clsx(styles.card, styles[variant], hover && styles.hover, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;

