import React from 'react';

export const NoticeStrip: React.FC = () => {
  return (
    <aside
      className="notice-strip hairline-b"
      style={{
        backgroundColor: 'var(--paper)',
        color: 'var(--mute)',
        fontSize: '0.78rem',
        padding: '0.45rem 1rem',
        textAlign: 'center',
        letterSpacing: '0.02em',
      }}
      aria-label="Clinical disclaimer notice"
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--brass)',
          }}
          aria-hidden="true"
        />
        <span>
          <strong>Educational prototype.</strong> Not a clinical tool. Do not use it to make health decisions.
        </span>
      </div>
    </aside>
  );
};

