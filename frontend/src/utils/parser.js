/**
 * Parse structured CV text into resume sections.
 * Expects section headers like "Professional Summary", "Core Competencies", etc.
 */

const SECTION_PATTERNS = [
  { key: 'summary', patterns: ['professional summary', 'summary', 'profile', 'objective'] },
  { key: 'competencies', patterns: ['core competencies', 'competencies', 'skills', 'key skills', 'technical skills'] },
  { key: 'experience', patterns: ['professional experience', 'work experience', 'experience', 'employment history'] },
  { key: 'education', patterns: ['education', 'academic background', 'qualifications'] },
  { key: 'certifications', patterns: ['certifications & training', 'certifications', 'certification & training', 'certificates', 'training & certifications'] },
  { key: 'languages', patterns: ['language proficiency', 'languages', 'language skills'] },
];

function findSectionKey(line) {
  const lower = line.toLowerCase().trim();
  for (const sec of SECTION_PATTERNS) {
    for (const p of sec.patterns) {
      if (lower === p || lower === p + ':') {
        return sec.key;
      }
    }
  }
  return null;
}

export function parseCV(text) {
  const lines = text.split('\n');
  const result = {
    name: '',
    title: '',
    contact: { email: '', phone: '', linkedin: '', location: '' },
    summary: '',
    competencies: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
  };

  // Phase 1: Extract header (first few lines before any section)
  let headerLines = [];
  let startIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (findSectionKey(trimmed)) {
      startIdx = i;
      break;
    }
    headerLines.push(trimmed);
    startIdx = i + 1;
  }

  // Parse header lines
  for (let i = 0; i < headerLines.length; i++) {
    const hl = headerLines[i];
    if (!result.name && i === 0) {
      result.name = hl;
    } else if (!result.title && i === 1 && !hl.includes('@') && !/^\+?\d/.test(hl) && !hl.includes('linkedin')) {
      result.title = hl;
    } else if (hl.includes('@')) {
      result.contact.email = hl;
    } else if (/^\+?\d[\d\s-]{7,}/.test(hl)) {
      result.contact.phone = hl;
    } else if (hl.includes('linkedin.com')) {
      result.contact.linkedin = hl;
    } else if (!result.contact.location) {
      result.contact.location = hl;
    }
  }

  // Phase 2: Parse sections
  let currentSection = null;
  let sectionContent = [];

  function flushSection() {
    if (!currentSection) return;
    const content = sectionContent.join('\n').trim();
    switch (currentSection) {
      case 'summary':
        result.summary = content;
        break;
      case 'competencies':
        result.competencies = parseCompetencies(content);
        break;
      case 'experience':
        result.experience = parseExperience(content);
        break;
      case 'education':
        result.education = parseEducation(content);
        break;
      case 'certifications':
        result.certifications = parseCertifications(content);
        break;
      case 'languages':
        result.languages = parseLanguages(content);
        break;
      default:
        break;
    }
    sectionContent = [];
  }

  for (let i = startIdx; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const sectionKey = findSectionKey(trimmed);
    if (sectionKey) {
      flushSection();
      currentSection = sectionKey;
    } else {
      sectionContent.push(lines[i]);
    }
  }
  flushSection();

  return result;
}

function parseCompetencies(text) {
  // Split by bullet character or newlines
  const items = text
    .split(/[•\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  return items;
}

/**
 * Detect if a line looks like a date range.
 */
function isDateLine(line) {
  return /^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{4}|(?:\d{4}))\s*[–\-—]\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{4}|Present|\d{4})/i.test(line.trim());
}

/**
 * Detect if a line is an action bullet (starts with a past-tense action verb).
 */
function isActionBullet(line) {
  const trimmed = line.trim().replace(/^[-•]\s*/, '');
  return /^(Delivered|Performed|Used|Maintained|Prepared|Built|Reviewed|Evaluated|Supported|Developed|Achieved|Gained|Managed|Led|Created|Implemented|Designed|Coordinated|Conducted|Analyzed|Improved|Resolved|Handled|Assisted|Collaborated|Facilitated|Organized|Trained|Monitored|Executed|Provided|Contributed|Established|Initiated|Reduced|Increased|Enhanced|Streamlined|Automated|Migrated|Deployed|Architected|Wrote|Tested|Fixed|Published|Launched|Mentored|Drove)/i.test(trimmed);
}

function parseExperience(text) {
  const lines = text.split('\n');
  const experiences = [];
  let current = null;
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) { i++; continue; }

    // Check if this looks like a new role title
    // A role title is: not a date, not an action bullet, not too long, doesn't start with a bullet
    const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');
    const isAction = isActionBullet(trimmed);
    const isDate = isDateLine(trimmed);

    if (isBullet || (isAction && current)) {
      // This is a bullet point
      if (current) {
        current.bullets.push(trimmed.replace(/^[-•]\s*/, ''));
      }
      i++;
      continue;
    }

    if (isDate) {
      // Attach date to current experience
      if (current) {
        current.dates = trimmed;
      }
      i++;
      continue;
    }

    // Check if this might be a new role entry
    // Heuristic: It's a role if it's not too long and the subsequent lines
    // contain either a company name, a date, or bullets
    if (!isBullet && !isAction && !isDate && trimmed.length < 80) {
      // Look ahead to see if next non-empty lines form a role pattern
      let nextLines = [];
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const next = lines[j].trim();
        if (next) nextLines.push(next);
      }

      // Is this a new role? Check if we have a date line or company line nearby
      const hasDateNearby = nextLines.some(l => isDateLine(l));
      const hasActionNearby = nextLines.some(l => isActionBullet(l));
      const hasCompanyLike = nextLines.length > 0 && !isDateLine(nextLines[0]) && !isActionBullet(nextLines[0]) && nextLines[0].length < 80;

      if (hasDateNearby || hasActionNearby || hasCompanyLike) {
        // Start a new experience entry
        current = { role: trimmed, company: '', dates: '', bullets: [] };
        experiences.push(current);
        i++;

        // Try to grab company and dates from next lines
        while (i < lines.length) {
          const next = lines[i].trim();
          if (!next) { i++; continue; }
          if (isDateLine(next)) {
            current.dates = next;
            i++;
            break;
          } else if (isActionBullet(next) || next.startsWith('-') || next.startsWith('•')) {
            break; // Don't advance i, let the main loop handle it
          } else if (!current.company) {
            current.company = next;
            i++;
          } else if (!current.dates) {
            // Could be dates in different format
            current.dates = next;
            i++;
            break;
          } else {
            break;
          }
        }
        continue;
      }
    }

    // Fallback: treat as a bullet if we have a current entry
    if (current) {
      current.bullets.push(trimmed.replace(/^[-•]\s*/, ''));
    }
    i++;
  }

  return experiences;
}

function parseEducation(text) {
  const lines = text.split('\n').map(s => s.trim()).filter(s => s);
  const items = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasYear = /\d{4}/.test(line);
    const isDateRange = /\d{4}\s*[–\-—]\s*(?:\d{4}|Expected\s+\d{4}|Present)/i.test(line);

    if (!current) {
      current = { degree: line, school: '', dates: '' };
      items.push(current);
    } else if (isDateRange && !current.dates) {
      current.dates = line;
    } else if (!current.school && !isDateRange) {
      current.school = line;
    } else if (isDateRange && current.school && !current.dates) {
      current.dates = line;
    } else {
      // New education item
      current = { degree: line, school: '', dates: '' };
      items.push(current);
    }
  }

  return items;
}

function parseCertifications(text) {
  const lines = text.split('\n').map(s => s.trim()).filter(s => s);
  const items = [];
  let current = null;

  for (const line of lines) {
    const isDate = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i.test(line);

    if (!current) {
      current = { name: line, org: '', date: '' };
      items.push(current);
    } else if (isDate && !current.date) {
      current.date = line;
    } else if (!current.org && !isDate) {
      current.org = line;
    } else if (isDate && current.org && !current.date) {
      current.date = line;
    } else {
      // New cert
      current = { name: line, org: '', date: '' };
      items.push(current);
    }
  }

  return items;
}

function parseLanguages(text) {
  const lines = text.split('\n').map(s => s.trim()).filter(s => s);
  const items = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if next line is a proficiency level
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (/\b(native|bilingual|professional|working|fluent|basic|elementary|B1|B2|C1|C2|A1|A2)\b/i.test(nextLine)) {
        items.push({ name: line, level: nextLine });
        i++; // skip next line
        continue;
      }
    }
    // Check if level is on same line separated by colon or dash
    const parts = line.split(/[:\-–]/);
    if (parts.length >= 2 && /\b(native|bilingual|professional|working|fluent|basic|elementary|B1|B2|C1|C2|A1|A2)\b/i.test(parts[1])) {
      items.push({ name: parts[0].trim(), level: parts.slice(1).join('-').trim() });
    } else {
      items.push({ name: line, level: '' });
    }
  }

  return items;
}

/**
 * Local keyword matching (no AI).
 */
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','being','have','has','had','do',
  'does','did','will','would','shall','should','may','might','can','could',
  'must','that','this','these','those','it','its','we','you','they','he',
  'she','him','her','his','our','your','their','not','no','as','if','so',
  'up','out','about','into','over','after','all','also','than','then','each',
  'every','any','such','more','most','other','some','very','just','which',
  'who','whom','what','when','where','how','why','am','i','me','my','myself',
  'us','ourselves','yours','yourself','yourselves','himself','herself','itself',
  'themselves','both','few','many','much','own','same','too','only','between',
  'through','during','before','while','once','here','there','again','further',
  'able','work','working','experience','role','job','position','team','company',
  'required','requirements','responsibilities','including','etc','using','used',
  'based','well','new','need','needs','looking','join','part','time','full',
  'years','year','day','days','strong','good','best','make','making','ensure',
  'ensuring','across','within',
]);

export function matchKeywords(jdText, cvText) {
  const words = jdText.toLowerCase().match(/[a-zA-Z][a-zA-Z0-9+#.-]{1,}/g) || [];
  const seen = new Set();
  const jdKeywords = [];
  for (const w of words) {
    if (!STOP_WORDS.has(w) && !seen.has(w)) {
      seen.add(w);
      jdKeywords.push(w);
    }
  }

  const cvLower = cvText.toLowerCase();
  const matched = [];
  const missing = [];
  for (const kw of jdKeywords) {
    if (cvLower.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const total = jdKeywords.length;
  const score = total > 0 ? Math.round((matched.length / total) * 1000) / 10 : 0;

  return { score, matched, missing, total };
}
