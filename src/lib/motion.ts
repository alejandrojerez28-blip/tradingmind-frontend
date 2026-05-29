import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(0,229,255,0.2)",
      "0 0 30px rgba(0,229,255,0.5)",
      "0 0 10px rgba(0,229,255,0.2)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const numberChange: Variants = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.1, 1], transition: { duration: 0.3 } },
};

export const blockBlink: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.3, 1, 0.3, 1],
    transition: { duration: 0.6 },
  },
};
