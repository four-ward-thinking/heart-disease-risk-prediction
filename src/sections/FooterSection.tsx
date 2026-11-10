import React, { useState } from 'react';
import { HeartMark } from '../components/HeartMark';

export const FooterSection: React.FC = () => {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <footer
      style={{
        backgroundColor: 'var(--ink)',
        color: 'var(--bone)',
        paddingTop: 'clamp(3.5rem, 5vw, 5rem)',
        paddingBottom: '3rem',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="container">
        {/* Top Footer Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(216, 209, 194, 0.2)',
          }}
        >
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <HeartMark size={26} />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--bone)',
                }}
              >
                Four-Ward
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#B6C4C1', lineHeight: 1.6, maxWidth: '38ch' }}>
              Educational cardiology risk assessment designed and trained by Team 2, Four-Ward Thinking. Combining classic clinical biostatistics with modern responsive web standards.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--brass)',
                marginBottom: '1rem',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
              <li><a href="#assess" style={{ color: '#D2DDD9', transition: 'color 0.15s' }}>Assess Tool</a></li>
              <li><a href="#model" style={{ color: '#D2DDD9', transition: 'color 0.15s' }}>Model Benchmark</a></li>
              <li><a href="#data" style={{ color: '#D2DDD9', transition: 'color 0.15s' }}>Cleveland Data Explorer</a></li>
              <li><a href="#fairness" style={{ color: '#D2DDD9', transition: 'color 0.15s' }}>Fairness & Governance</a></li>
              <li><a href="#pulse" style={{ color: '#D2DDD9', transition: 'color 0.15s' }}>Research Pulse (NLP)</a></li>
              <li><a href="#team" style={{ color: '#D2DDD9', transition: 'color 0.15s' }}>Team Members</a></li>
            </ul>
          </div>

          {/* Educational Disclaimer */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--brass)',
                marginBottom: '1rem',
              }}
            >
              Clinical Disclaimer
            </h4>
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(244, 240, 231, 0.05)',
                border: '1px solid rgba(181, 139, 76, 0.4)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                color: '#D2DDD9',
                lineHeight: 1.5,
              }}
            >
              <strong>Educational prototype.</strong> Not a clinical tool. Do not use it to make health decisions. Always consult a board-certified physician for medical diagnosis and treatment planning.
            </div>
          </div>
        </div>

        {/* Sources Accordion (APA 7 References) */}
        <div style={{ paddingTop: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(216, 209, 194, 0.2)' }}>
          <button
            type="button"
            onClick={() => setSourcesOpen(!sourcesOpen)}
            aria-expanded={sourcesOpen}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--bone)',
              textAlign: 'left',
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--brass)' }}>
              Sources & Bibliography (APA 7)
            </span>
            <span style={{ color: 'var(--brass)', fontSize: '0.85rem' }}>
              {sourcesOpen ? '▲ Collapse' : '▼ Expand references'}
            </span>
          </button>

          {sourcesOpen && (
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem', color: '#BACEC7', lineHeight: 1.6 }}>
              <p>
                American Heart Association. (2026). <em>News releases</em> [Press releases]. EurekAlert! https://www.eurekalert.org/newsroom/AHA/home
              </p>
              <p>
                Janosi, A., Steinbrunn, W., Pfisterer, M., & Detrano, R. (1989). <em>Heart disease</em> [Data set]. UCI Machine Learning Repository. https://doi.org/10.24432/C52P4X
              </p>
              <p>
                Orange Data Mining. (n.d.). <em>Orange</em> [Computer software]. University of Ljubljana. https://orangedatamining.com
              </p>
              <p>
                OpenAI. (2026). <em>ChatGPT (GPT-6, Nov 6 version)</em> [Large language model]. https://chat.openai.com/chat
              </p>
            </div>
          )}
        </div>

        {/* Bottom Disclosure Line */}
        <div
          style={{
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.74rem',
            color: '#8A9995',
          }}
        >
          <div>
            Team 2, Four-Ward Thinking · SRM Institute of Science and Technology, Ramapuram.
          </div>
          <div>
            This site was built with AI assistance; all model results were computed from the dataset by the included scripts.
          </div>
        </div>
      </div>
    </footer>
  );
};

