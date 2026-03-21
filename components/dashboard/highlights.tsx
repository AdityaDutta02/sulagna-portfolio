'use client';

import { motion } from 'framer-motion';
import { certifications } from '@/lib/data';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const child = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Highlights() {
  return (
    <motion.div
      className="flex flex-wrap gap-1.5 mb-3"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {certifications.map((cert) => (
        <motion.div
          key={cert.text}
          variants={child}
          className="inline-flex items-center gap-[5px] px-3 py-[5px] rounded-full text-[10px] cursor-default transition-all duration-300 hover:-translate-y-px hover:shadow-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
          whileHover={{
            borderColor: 'var(--amber)',
            color: 'var(--warm-brown)',
          }}
        >
          <span
            className="w-[5px] h-[5px] rounded-full shrink-0"
            style={{ background: cert.dotColour }}
          />
          {cert.text}
        </motion.div>
      ))}
    </motion.div>
  );
}
