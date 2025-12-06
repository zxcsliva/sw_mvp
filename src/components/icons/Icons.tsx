import React from 'react';

export const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z" fill="currentColor" />
  </svg>
);

export const StarIcon: React.FC<{ className?: string }>= ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 17.3L5.6 20l1.1-6.4L1.9 9.6l6.5-.9L12 3l3.6 5.7 6.5.9-4.8 3.9L18.4 20 12 17.3z" fill="currentColor" />
  </svg>
);

export const CrownIcon: React.FC<{ className?: string }>= ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 8l4 6 4-5 4 5 4-6v10H4V8z" fill="currentColor" />
  </svg>
);

export const DesignIcon: React.FC<{ className?: string }>= ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
  </svg>
);

export const InstallIcon: React.FC<{ className?: string }>= ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2l3 6 6 1-4.5 4.5L19 20l-7-3-7 3 1.5-6.5L3 9l6-1 3-6z" fill="currentColor" />
  </svg>
);

export const SupportIcon: React.FC<{ className?: string }>= ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 1a10 10 0 00-10 10v3a4 4 0 004 4h12a4 4 0 004-4v-3A10 10 0 0012 1z" fill="currentColor" />
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }>= ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
