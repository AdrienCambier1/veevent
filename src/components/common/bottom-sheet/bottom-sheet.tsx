"use client";

import {
  motion,
  AnimatePresence,
  PanInfo,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useEffect, useState, ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
  title?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  maxHeight = "85vh",
  title,
}: BottomSheetProps) {
  const DRAG_THRESHOLD = 100;
  const [dragY, setDragY] = useState(0);

  // Motion values pour l'animation fluide
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 150], [1, 0]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      setDragY(0);
      y.set(0);
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "auto";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "auto";
    };
  }, [isOpen, y]);

  const handleDrag = (_: any, info: PanInfo) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y);
      y.set(info.offset.y);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > DRAG_THRESHOLD || info.velocity.y > 500) {
      onClose();
    } else {
      setDragY(0);
      y.set(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay avec opacité liée au drag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ opacity }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: dragY }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              maxHeight,
              overscrollBehavior: "none",
            }}
          >
            <motion.div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              style={{
                touchAction: "none",
                overscrollBehavior: "none",
              }}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full pointer-events-none" />
            </motion.div>

            {title && (
              <div className="text-xl text-center font-bold text-primary-950">
                {title}
              </div>
            )}

            <div
              className="overflow-y-auto flex-1 overscroll-contain"
              style={{ overscrollBehavior: "contain" }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
