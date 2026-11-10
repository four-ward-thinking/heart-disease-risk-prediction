import React from 'react';
import { config } from '../config';

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="section-spacing hairline-b" style={{ backgroundColor: 'var(--bone)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
          <span className="eyebrow eyebrow-brass">Section 07 · Project Authors</span>
          <h2 style={{ marginBottom: '0.65rem' }}>{config.teamName}</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--mute)' }}>
            {config.course} · {config.institution}
          </p>

          {/* Optional Faculty Guide and Presentation Date */}
          {(config.facultyGuide || config.presentationDate) && (
            <div
              style={{
                marginTop: '1rem',
                display: 'inline-flex',
                gap: '1.5rem',
                fontSize: '0.78rem',
                color: 'var(--mute)',
                borderTop: '1px solid var(--line)',
                paddingTop: '0.5rem',
              }}
            >
              {config.facultyGuide && <div>Faculty Guide: <strong>{config.facultyGuide}</strong></div>}
              {config.presentationDate && <div>Presented: <strong>{config.presentationDate}</strong></div>}
            </div>
          )}
        </div>

        {/* Four Member Horizontal Cards (2x2 on mobile) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {config.teamMembers.map((member) => (
            <div
              key={member.regNo}
              className="hairline-box"
              style={{
                padding: '2rem 1.5rem',
                backgroundColor: 'var(--paper)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {/* Monogram Circle with Brass Ring in Fraunces */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bone)',
                  border: '2px solid var(--brass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 400,
                  color: 'var(--ink)',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 0 4px var(--paper), 0 0 0 5px var(--line)',
                }}
                aria-hidden="true"
              >
                {member.initials}
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--ink)' }}>
                {member.name}
              </h3>
              <div
                className="tabular-nums"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: 'var(--mute)',
                  letterSpacing: '0.04em',
                }}
              >
                {member.regNo}
              </div>
              <div
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.72rem',
                  color: 'var(--brass-text)',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                Dept.BioTechnology
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
