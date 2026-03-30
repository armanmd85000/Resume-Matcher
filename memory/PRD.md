# Resume Matcher - PRD

## Original Problem Statement
Build a Resume Customization Web Tool where users paste a Job Description on the left and CV text on the right. The app performs keyword-based matching (no AI), shows a match score, renders a clean A4 resume preview (210mm × 297mm, 20mm margins), and provides a downloadable A4 PDF. No authentication needed.

## Architecture
- **Frontend**: React (CRA) with html2pdf.js for client-side PDF generation
- **Backend**: FastAPI (Python) with keyword matching endpoint
- **Fonts**: Outfit (headings), IBM Plex Sans (body), JetBrains Mono (labels)
- **PDF**: html2pdf.js with A4 format, section-aware page breaks

## User Personas
- Job seekers who tailor resumes for specific job postings
- Career coaches helping clients match resumes to JDs

## Core Requirements (Static)
1. Two-panel split-screen: JD input (left), CV input (right)
2. Keyword extraction and matching (no AI)
3. Match score display (percentage)
4. Clean A4 resume preview with proper formatting
5. Downloadable A4 PDF with correct margins and page breaks
6. No authentication required
7. Section-aware page breaking (break-inside: avoid)

## What's Been Implemented (Jan 2026)
- [x] Split-screen input UI (JD + CV panels)
- [x] Local keyword matching engine with stop-word filtering
- [x] Match score percentage display with color coding (green/yellow/red)
- [x] Matched/Missing keyword chips
- [x] CV text parser (extracts name, title, contact, summary, competencies, experience, education, certifications, languages)
- [x] A4 resume preview (210mm × 297mm, 20mm padding)
- [x] Professional resume format (header, sections with borders, proper typography)
- [x] PDF download via html2pdf.js with section page-break avoidance
- [x] Edit/Back flow to return to input mode
- [x] Backend /api/health and /api/match endpoints
- [x] Responsive split-screen layout

## Testing Status
- Backend: 100% (3/3 tests passed)
- Frontend: 100% (13/13 features tested)

## Prioritized Backlog
### P0 (Critical) - None remaining
### P1 (High)
- PDF page break fine-tuning for very long resumes
- Support for different resume formats/templates
### P2 (Medium)
- Save/load previous JD+CV combinations
- Multiple resume templates (modern, classic, creative)
- Export to DOCX format
### P3 (Low)
- Dark mode support
- Keyboard shortcuts
- Resume history/versioning

## Next Tasks
1. Test PDF download with various resume lengths
2. Add template switcher for different resume styles
3. Consider adding resume scoring tips/suggestions
