import clsx from 'clsx';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner = ({ text, fullScreen = false, className }: LoadingSpinnerProps) => {
  return (
    <div className={clsx(styles.container, fullScreen && styles.fullScreen, className)} role="status" aria-label="Loading">
      <div className={styles.spinner} aria-hidden="true" />
      {text && <span className={styles.text}>{text}</span>}
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;

