import React, { useState, useEffect } from 'react';
import { ModelSpec } from './lib/predict';
import { NoticeStrip } from './components/NoticeStrip';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { AssessSection } from './sections/AssessSection';
import { HowBuiltSection } from './sections/HowBuiltSection';
import { PineBandSection } from './sections/PineBandSection';
import { ModelSection } from './sections/ModelSection';
import { DataSection } from './sections/DataSection';
import { FairnessSection } from './sections/FairnessSection';
import { ResearchPulseSection } from './sections/ResearchPulseSection';
import { TeamSection } from './sections/TeamSection';
import { FooterSection } from './sections/FooterSection';

// Initial baseline artifacts
import defaultModel from '../public/model.json';
import defaultMetrics from '../public/metrics.json';
import defaultDataset from '../public/dataset.json';
import defaultHeadlines from '../public/headlines.json';

export const App: React.FC = () => {
  const [model, setModel] = useState<ModelSpec>(defaultModel as unknown as ModelSpec);
  const [metrics, setMetrics] = useState<any>(defaultMetrics);
  const [dataset, setDataset] = useState<any[]>(defaultDataset);
  const [headlines, setHeadlines] = useState<any>(defaultHeadlines);

  useEffect(() => {
    // Runtime fetch using import.meta.env.BASE_URL for GitHub Pages sub-path compatibility
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;

    Promise.all([
      fetch(`${cleanBase}model.json`).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch model.json: status ${r.status}`);
        return r.json();
      }),
      fetch(`${cleanBase}metrics.json`).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch metrics.json: status ${r.status}`);
        return r.json();
      }),
      fetch(`${cleanBase}dataset.json`).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch dataset.json: status ${r.status}`);
        return r.json();
      }),
      fetch(`${cleanBase}headlines.json`).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch headlines.json: status ${r.status}`);
        return r.json();
      }),
    ])
      .then(([m, mt, d, h]) => {
        setModel(m);
        setMetrics(mt);
        setDataset(d);
        setHeadlines(h);
      })
      .catch((err) => {
        console.warn('Runtime fetch notice (using bundled model artifacts):', err);
      });
  }, []);

  return (
    <div className="site-wrapper">
      {/* 0. Notice Strip */}
      <NoticeStrip />

      {/* 1. Header Navigation */}
      <Navbar />

      {/* Main Content Landmarks */}
      <main id="main-content">
        {/* 2. Hero Section */}
        <HeroSection metrics={metrics} />

        {/* 3. Centerpiece Working Tool */}
        <AssessSection model={model} metrics={metrics} dataset={dataset} />

        {/* 4. How It Was Built */}
        <HowBuiltSection />

        {/* 5. Pine Band: Four Things We Checked */}
        <PineBandSection />

        {/* 6. Model Benchmark & Evaluation */}
        <ModelSection metrics={metrics} />

        {/* 7. Cleveland Data Explorer */}
        <DataSection model={model} metrics={metrics} dataset={dataset} />

        {/* 8. Fairness & Responsible AI */}
        <FairnessSection metrics={metrics} />

        {/* 9. Research Pulse: Text Analysis */}
        <ResearchPulseSection headlinesData={headlines} />

        {/* 10. Team Section */}
        <TeamSection />
      </main>

      {/* 11. Footer */}
      <FooterSection />
    </div>
  );
};
