import React, { useState } from 'react';

interface HeadlineRecord {
  headline: string;
  source: string;
  date: string;
  url: string;
  compound: number;
  label: 'positive' | 'negative' | 'neutral';
  lexicon_hits: Array<{ word: string; valence: number }>;
}

interface ResearchPulseSectionProps {
  headlinesData: {
    summary: {
      positive: number;
      negative: number;
      neutral: number;
      mean_compound: number;
    };
    orange_reference: {
      source: string;
      counts: { negative: number; neutral: number; positive: number };
      mean_compound: number;
      sample_headline: string;
      sample_score: number;
      divergence_explanation: string;
    };
    headlines: HeadlineRecord[];
  };
}

export const ResearchPulseSection: React.FC<ResearchPulseSectionProps> = ({ headlinesData }) => {
  const [selectedHeadline, setSelectedHeadline] = useState<HeadlineRecord | null>(headlinesData.headlines[0]);

  const { summary, orange_reference, headlines } = headlinesData;

  // Sorting: order by date descending
  const sortedHeadlines = [...headlines].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section id="pulse" className="section-spacing hairline-b" style={{ backgroundColor: 'var(--bone)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: '2.5rem' }}>
          <span className="eyebrow eyebrow-brass">Section 06 · Text Component</span>
          <h2 style={{ marginBottom: '0.75rem' }}>Research Pulse: Clinical Sentiment Analysis</h2>
          <p className="lead-text">
            Natural language processing on 20 American Heart Association press releases (Oct–Nov 2026, via EurekAlert!). An investigation into why general sentiment tools misjudge medical vocabulary.
          </p>
        </div>

        {/* Pull-Quote: Lexical Finding & Discrepancy Note (Point 4) */}
        <div
          className="hairline-box"
          style={{
            padding: '1.5rem clamp(1.25rem, 2.5vw, 2rem)',
            backgroundColor: 'var(--paper)',
            borderLeft: '4px solid var(--crimson)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="eyebrow" style={{ color: 'var(--crimson)', marginBottom: 0 }}>
              Key Lexical Finding · Domain Vulnerability
            </span>
          </div>
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: 1.5,
              color: 'var(--ink)',
              marginBottom: '1rem',
            }}
          >
            &ldquo;Off-the-shelf sentiment models misinterpret medical news because common anatomical words carry colloquial sentiment: in VADER&rsquo;s social-media lexicon, the word <em>&lsquo;heart&rsquo;</em> carries a high positive valence of <strong>+3.20</strong>, causing alarming clinical headlines like <em>&lsquo;Deaths from heart valve disease rising&rsquo;</em> to falsely score +0.6369.&rdquo;
          </blockquote>

          {/* Side-by-Side Comparison Note (Point 4) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--line)',
              fontSize: '0.78rem',
            }}
          >
            <div>
              <strong>Raw VADER (This site&rsquo;s run):</strong> {summary.positive} positive, {summary.negative} negative, {summary.neutral} neutral (mean compound: <strong>+{summary.mean_compound.toFixed(2)}</strong>).
            </div>
            <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.25rem' }} className="orange-stat-col">
              <strong>Team 2 Orange Deck Benchmark:</strong> {orange_reference.counts.negative} negative, {orange_reference.counts.neutral} neutral, {orange_reference.counts.positive} positive (mean compound: <strong>{orange_reference.mean_compound.toFixed(2)}</strong>).
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.74rem', color: 'var(--mute)', lineHeight: 1.5 }}>
            <em>Why they differ:</em> {orange_reference.divergence_explanation}
          </div>
        </div>

        {/* Two-Column Layout: Left Headline List, Right Diverging Dot-Plot */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            alignItems: 'start',
          }}
        >
          {/* LEFT: EDITORIAL HEADLINE LIST (7 cols) */}
          <div style={{ gridColumn: 'span 12' }} className="pulse-left">
            <div className="hairline-box" style={{ padding: '1.5rem', backgroundColor: 'var(--paper)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>20 AHA Press Releases</span>
                <span className="chip chip-neutral">Oct–Nov 2026</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '580px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {sortedHeadlines.map((item, idx) => {
                  const isSelected = selectedHeadline?.headline === item.headline;
                  const chipClass =
                    item.label === 'positive'
                      ? 'chip-low'
                      : item.label === 'negative'
                      ? 'chip-high'
                      : 'chip-neutral';

                  return (
                    <article
                      key={idx}
                      onClick={() => setSelectedHeadline(item)}
                      style={{
                        padding: '0.75rem 0.85rem',
                        backgroundColor: isSelected ? 'var(--bone)' : 'transparent',
                        border: isSelected ? '1px solid var(--brass)' : '1px solid var(--line)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--mute)' }}>{item.date}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className={`chip ${chipClass}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                            {item.label === 'positive' ? '▲' : item.label === 'negative' ? '▼' : '■'} {item.label}
                          </span>
                          <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                            {item.compound > 0 ? '+' : ''}{item.compound.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.84rem',
                          fontWeight: 500,
                          lineHeight: 1.45,
                          color: 'var(--ink)',
                          marginBottom: '0.35rem',
                        }}
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-link"
                          style={{ borderBottom: 'none', color: 'var(--ink)' }}
                        >
                          {item.headline} ↗
                        </a>
                      </h3>
                      <div style={{ fontSize: '0.68rem', color: 'var(--mute)' }}>{item.source}</div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: DIVERGING DOT-PLOT & LEXICON INSPECTOR (5 cols) */}
          <div style={{ gridColumn: 'span 12' }} className="pulse-right">
            {/* Diverging Dot Plot */}
            <div className="hairline-box" style={{ padding: '1.5rem', backgroundColor: 'var(--paper)', marginBottom: '1.5rem' }}>
              <span className="eyebrow" style={{ marginBottom: '0.25rem' }}>Distribution</span>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Compound Score Divergence</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--mute)', marginBottom: '1.25rem' }}>
                All 20 headlines plotted along the -1.0 to +1.0 polarity spectrum.
              </p>

              {/* Hand-built Diverging Dot-Plot SVG */}
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <svg viewBox="0 0 380 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Central Zero Axis */}
                  <line x1="190" y1="15" x2="190" y2="170" stroke="var(--ink)" strokeWidth="1.25" strokeDasharray="3 3" />
                  <text x="190" y="185" textAnchor="middle" fontSize="9" fill="var(--mute)" fontFamily="var(--font-sans)">
                    Neutral (0.0)
                  </text>

                  {/* Left Axis (-1.0) */}
                  <line x1="30" y1="15" x2="30" y2="170" stroke="var(--line)" strokeWidth="0.75" />
                  <text x="30" y="185" textAnchor="middle" fontSize="9" fill="var(--crimson)" fontFamily="var(--font-sans)">
                    -1.0 (Neg)
                  </text>

                  {/* Right Axis (+1.0) */}
                  <line x1="350" y1="15" x2="350" y2="170" stroke="var(--line)" strokeWidth="0.75" />
                  <text x="350" y="185" textAnchor="middle" fontSize="9" fill="var(--sage)" fontFamily="var(--font-sans)">
                    +1.0 (Pos)
                  </text>

                  {/* Horizontal Guideline */}
                  <line x1="30" y1="90" x2="350" y2="90" stroke="var(--line)" strokeWidth="0.75" opacity="0.6" />

                  {/* Plotted Dots (with slight vertical jitter to prevent overlap) */}
                  {headlines.map((h, i) => {
                    // Map compound [-1.0..+1.0] to x in [30..350]
                    const x = 190 + h.compound * 160;
                    // Jitter y slightly
                    const jitterY = 90 + ((i % 5) - 2) * 22;
                    const isSelected = selectedHeadline?.headline === h.headline;

                    return (
                      <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedHeadline(h)}>
                        <circle
                          cx={x}
                          cy={jitterY}
                          r={isSelected ? 6 : 4}
                          fill={h.compound > 0 ? 'var(--sage)' : h.compound < 0 ? 'var(--crimson)' : 'var(--brass)'}
                          stroke={isSelected ? 'var(--ink)' : 'var(--paper)'}
                          strokeWidth={isSelected ? 2 : 1}
                          opacity={0.85}
                        >
                          <title>{`${h.headline} (${h.compound.toFixed(2)})`}</title>
                        </circle>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Headline Lexicon Inspector */}
            {selectedHeadline && (
              <div className="hairline-box" style={{ padding: '1.25rem', backgroundColor: 'var(--paper)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="eyebrow" style={{ marginBottom: 0 }}>Lexicon Breakdown</span>
                  <span className="tabular-nums" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Compound: {selectedHeadline.compound.toFixed(4)}
                  </span>
                </div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                  {selectedHeadline.headline}
                </h4>

                <div style={{ fontSize: '0.74rem', color: 'var(--mute)', marginBottom: '0.5rem' }}>
                  Words recognized in VADER dictionary:
                </div>

                {selectedHeadline.lexicon_hits && selectedHeadline.lexicon_hits.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedHeadline.lexicon_hits.map((hit, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: hit.valence > 0 ? 'var(--sage-faint)' : 'var(--crimson-faint)',
                          color: hit.valence > 0 ? 'var(--pine)' : 'var(--crimson)',
                          border: `1px solid ${hit.valence > 0 ? 'var(--sage)' : 'var(--crimson)'}`,
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        <strong>{hit.word}</strong>: {hit.valence > 0 ? '+' : ''}{hit.valence.toFixed(2)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: 'var(--mute)', fontStyle: 'italic' }}>
                    No emotional words matched (assigned neutral compound 0.00).
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .pulse-left {
            grid-column: span 7 !important;
          }
          .pulse-right {
            grid-column: span 5 !important;
          }
        }
        @media (max-width: 600px) {
          .orange-stat-col {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--line);
            padding-top: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
};
