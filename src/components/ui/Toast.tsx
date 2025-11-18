import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeNotification } from '../../store/slices/notificationSlice';
import type { RootState } from '../../store';
import styles from './Toast.module.css';

const Toast = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${styles.toast} ${styles[notification.type]}`}
            role="alert"
          >
            <span className={styles.message}>{notification.message}</span>
            <button
              className={styles.closeButton}
              onClick={() => dispatch(removeNotification(notification.id))}
              aria-label="Close notification"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;

