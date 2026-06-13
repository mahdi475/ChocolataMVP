import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../../store';
import { removeNotification } from '../../store/slices/notificationSlice';
import styles from './ToastContainer.module.css';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  useEffect(() => {
    // Auto-remove notifications after their duration
    notifications.forEach((notification) => {
      const duration = notification.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`${styles.toast} ${styles[notification.type]}`}
            data-testid={`toast-${notification.type}`}
          >
            <div className={styles.content}>
              <span className={styles.icon}>{getIcon(notification.type)}</span>
              <p className={styles.message}>{notification.message}</p>
            </div>
            <button
              onClick={() => handleClose(notification.id)}
              className={styles.closeButton}
              aria-label="Close notification"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
