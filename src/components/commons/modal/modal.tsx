import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 320, damping: 28, duration: 0.22 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-2xl font-bold"
              onClick={onClose}
              aria-label="Fermer"
              type="button"
            >
              ×
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 