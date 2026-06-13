import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface FadeInProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  delay?: number;
}

const FadeIn = ({ children, delay = 0, ...props }: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;

