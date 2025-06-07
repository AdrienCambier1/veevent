"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Filters from "./filters";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
}: FilterBottomSheetProps) {
  const DRAG_THRESHOLD = 100;
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      setDragY(0);
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "auto";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "auto";
    };
  }, [isOpen]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > DRAG_THRESHOLD || info.velocity.y > 500) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            style={{ overscrollBehavior: "none" }}
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            style={{ overscrollBehavior: "none" }}
          >
            <motion.div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={(_, info) => {
                if (info.offset.y > 0) {
                  setDragY(info.offset.y);
                }
              }}
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

            {/* Content - Pas de drag */}
            <div
              ref={contentRef}
              className="overflow-y-auto max-h-[calc(85vh-60px)] overscroll-contain"
              style={{ overscrollBehavior: "contain" }}
            >
              <Filters />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
