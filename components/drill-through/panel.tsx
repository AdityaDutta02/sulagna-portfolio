'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useDrill } from './drill-context';
import { reports } from '@/lib/reports';

export function DrillPanel() {
  const { isOpen, reportId, closeDrill } = useDrill();
  const report = reportId ? reports[reportId] : null;
  const ReportComponent = report?.component;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{
              background: 'rgba(44,42,38,0.3)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeDrill}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[201] flex flex-col"
            style={{
              width: 'min(720px, 90vw)',
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.1)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={reportId ?? 'Report panel'}
          >
            {/* Sticky header */}
            <div
              className="sticky top-0 z-10 flex items-center gap-3 px-6 py-4 shrink-0"
              style={{
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base cursor-pointer transition-all duration-200"
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
                onClick={closeDrill}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = 'var(--amber-glow)';
                  el.style.borderColor = 'var(--amber)';
                  el.style.color = 'var(--amber)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = 'var(--bg-subtle)';
                  el.style.borderColor = 'var(--border)';
                  el.style.color = 'var(--text-muted)';
                }}
                aria-label="Close panel"
              >
                &larr;
              </button>

              <div
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--font-mono)' }}
                data-testid="drill-title"
              >
                {report?.title ?? reportId ?? 'Report'}
              </div>

              <div
                className="text-[10px] ml-auto"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-dim)',
                }}
              >
                {report?.breadcrumb ?? `Dashboard › ${reportId}`}
              </div>
            </div>

            {/* Scrollable body */}
            <div
              className="flex-1 overflow-y-auto p-6"
              style={{ overscrollBehavior: 'contain' }}
            >
              {ReportComponent ? <ReportComponent /> : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Report not found: {reportId}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
