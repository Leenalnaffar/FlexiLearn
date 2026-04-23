import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/hooks/use-preferences";
import { ReactNode } from "react";

export function MotionDiv({ 
  children, 
  className,
  variants,
  initial,
  animate,
  exit,
  transition,
  ...props
}: any) {
  const { reducedMotion } = usePreferences();

  if (reducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}
