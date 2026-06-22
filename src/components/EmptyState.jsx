// src/components/EmptyState.jsx
import React from 'react';

export default function EmptyState({ message = 'No meals logged yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-graytext">
      <svg className="w-16 h-16 mb-4 text-lightgray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>
      <p className="text-lg">{message}</p>
    </div>
  );
}
