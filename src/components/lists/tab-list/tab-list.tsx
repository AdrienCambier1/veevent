"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./tab-list.scss";

interface TabListProps {
  title: string;
  items: string[];
  generateHref?: (item: string) => string;
}

export default function TabList({ title, items, generateHref }: TabListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="tab-list">
      <div
        className={`list-head ${!isOpen ? "closed" : ""}`}
        onClick={toggleList}
      >
        {title}{" "}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          +
        </motion.span>
      </div>

      <motion.div
        className="list-content"
        initial={{
          height: 0,
          opacity: 0,
        }}
        animate={{
          height: "auto",
          opacity: 1,
        }}
        exit={{
          height: 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{ overflow: "hidden" }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.03,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link href={generateHref ? generateHref(item) : ""}>
              {item}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
