import React, { useState, useRef, useCallback } from 'react';
import ResumePreview from './components/ResumePreview';
import MatchResults from './components/MatchResults';
import { parseCV, matchKeywords } from './utils/parser';
import html2pdf from 'html2pdf.js';

function App() {
  const [mode, setMode] = useState('input'); // 'input' | 'preview'
  const [jdText, setJdText] = useState('');
  const [cvText, setCvText] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const resumeRef = useRef(null);

  const handleAnalyze = useCallback(async () => {
    if (!jdText.trim() || !cvText.trim()) return;
    setLoading(true);

    try {
      // Parse CV locally
      const parsed = parseCV(cvText);
      setResumeData(parsed);

      // Match keywords locally (instant)
      const match = matchKeywords(jdText, cvText);
      setMatchData(match);

      setMode('preview');
    } catch (err) {
      console.error('Error analyzing:', err);
    } finally {
      setLoading(false);
    }
  }, [jdText, cvText]);

  const handleBack = useCallback(() => {
    setMode('input');
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!resumeRef.current) return;
    setPdfLoading(true);

    try {
      const element = resumeRef.current;

      const opt = {
        margin: 0,
        filename: `${resumeData?.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.resume-section, .experience-item, .education-item, .cert-item',
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setPdfLoading(false);
    }
  }, [resumeData]);

  return (
    <div className="app-shell">
      {/* Navbar */}
      <nav className="navbar" data-testid="navbar">
        <div className="navbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </svg>
          <div>
            <div className="navbar-title">Resume Matcher</div>
            <div className="navbar-subtitle">Paste &middot; Match &middot; Download</div>
          </div>
        </div>
        <div className="navbar-actions">
          {mode === 'preview' && (
            <button className="btn btn-nav" onClick={handleBack} data-testid="back-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Edit Inputs
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className={`main-grid ${mode === 'preview' ? 'preview-mode' : ''}`}>
        {/* LEFT PANEL */}
        <div className="panel">
          {mode === 'input' ? (
            <>
              <div className="panel-header">
                <div className="panel-label">
                  <span className="panel-label-dot" style={{ background: '#3B82F6' }}></span>
                  Job Description
                </div>
              </div>
              <div className="panel-content">
                <textarea
                  className="input-textarea"
                  data-testid="jd-input"
                  placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Spanish Relationship Manager to handle client communications in Spanish and English..."
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  aria-label="Job Description"
                />
              </div>
              <div className="bottom-bar">
                <span className="char-count">{jdText.length} chars</span>
                <button
                  className="btn btn-primary"
                  data-testid="analyze-btn"
                  disabled={!jdText.trim() || !cvText.trim() || loading}
                  onClick={handleAnalyze}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                      Analyze & Preview
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="panel-header">
                <div className="panel-label">
                  <span className="panel-label-dot"></span>
                  Match Analysis
                </div>
              </div>
              <div className="panel-content">
                <MatchResults matchData={matchData} />
              </div>
              <div className="action-bar">
                <button
                  className="btn btn-accent"
                  data-testid="download-pdf-btn"
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  style={{ flex: 1 }}
                >
                  {pdfLoading ? (
                    <>
                      <span className="spinner"></span>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  data-testid="back-to-edit-btn"
                  onClick={handleBack}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="panel">
          {mode === 'input' ? (
            <>
              <div className="panel-header">
                <div className="panel-label">
                  <span className="panel-label-dot" style={{ background: '#8B5CF6' }}></span>
                  CV / Resume Text
                </div>
              </div>
              <div className="panel-content">
                <textarea
                  className="input-textarea"
                  data-testid="cv-input"
                  placeholder="Paste your CV text here...&#10;&#10;Format:&#10;Name&#10;Title&#10;email@example.com&#10;+91 1234567890&#10;City, Country&#10;&#10;Professional Summary&#10;Your summary text...&#10;&#10;Core Competencies&#10;Skill 1 • Skill 2 • Skill 3&#10;&#10;Professional Experience&#10;Job Title&#10;Company Name&#10;Date Range&#10;- Achievement 1&#10;- Achievement 2"
                  value={cvText}
                  onChange={e => setCvText(e.target.value)}
                  aria-label="CV Text"
                />
              </div>
              <div className="bottom-bar">
                <span className="char-count">{cvText.length} chars</span>
              </div>
            </>
          ) : (
            <>
              <div className="panel-header">
                <div className="panel-label">
                  <span className="panel-label-dot" style={{ background: '#8B5CF6' }}></span>
                  Resume Preview (A4)
                </div>
              </div>
              <div className="panel-content">
                <div className="a4-preview-container">
                  <ResumePreview data={resumeData} innerRef={resumeRef} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
