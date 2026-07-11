import { Variants } from 'framer-motion';

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: 'easeIn' } }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const listItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const scaleUp: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }
};

export const slideInRight: Variants = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const slideInLeft: Variants = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const toastAnimation: Variants = {
  initial: { y: 50, opacity: 0, scale: 0.9 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 25 } },
  exit: { y: 20, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export const hoverScale = {
  whileHover: { y: -3, scale: 1.01, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

