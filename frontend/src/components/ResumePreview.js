import React from 'react';

export default function ResumePreview({ data, innerRef }) {
  if (!data) return null;

  return (
    <div className="a4-page" ref={innerRef} data-testid="resume-preview">
      {/* Header */}
      <div className="resume-header">
        {data.name && <div className="resume-name" data-testid="resume-name">{data.name}</div>}
        {data.title && <div className="resume-title">{data.title}</div>}
        <div className="resume-contact">
          {data.contact?.email && <span>{data.contact.email}</span>}
          {data.contact?.email && data.contact?.phone && <span className="divider">|</span>}
          {data.contact?.phone && <span>{data.contact.phone}</span>}
          {data.contact?.phone && data.contact?.linkedin && <span className="divider">|</span>}
          {data.contact?.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact?.linkedin && data.contact?.location && <span className="divider">|</span>}
          {data.contact?.location && <span>{data.contact.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="resume-section">
          <div className="resume-section-title">Professional Summary</div>
          <div className="resume-summary">{data.summary}</div>
        </div>
      )}

      {/* Core Competencies */}
      {data.competencies?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Core Competencies</div>
          <div className="resume-competencies">
            {data.competencies.map((c, i) => (
              <React.Fragment key={i}>
                <span className="competency-item">{c}</span>
                {i < data.competencies.length - 1 && <span className="competency-bullet">&bull;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Professional Experience</div>
          {data.experience.map((exp, i) => (
            <div className="experience-item" key={i}>
              <div className="exp-header">
                <span className="exp-role">{exp.role}</span>
                {exp.dates && <span className="exp-dates">{exp.dates}</span>}
              </div>
              {exp.company && <div className="exp-company">{exp.company}</div>}
              {exp.bullets?.length > 0 && (
                <ul className="exp-bullets">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Education</div>
          {data.education.map((edu, i) => (
            <div className="education-item" key={i}>
              <div className="edu-header">
                <span className="edu-degree">{edu.degree}</span>
                {edu.dates && <span className="edu-dates">{edu.dates}</span>}
              </div>
              {edu.school && <div className="edu-school">{edu.school}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Certifications & Training</div>
          {data.certifications.map((cert, i) => (
            <div className="cert-item" key={i}>
              <div className="cert-name">{cert.name}</div>
              {cert.org && <div className="cert-org">{cert.org}</div>}
              {cert.date && <div className="cert-date">{cert.date}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Language Proficiency</div>
          {data.languages.map((lang, i) => (
            <div className="lang-row" key={i}>
              <span className="lang-name">{lang.name}</span>
              <span className="lang-level">{lang.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
