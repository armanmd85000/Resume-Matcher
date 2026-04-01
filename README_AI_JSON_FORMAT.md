# Resume Matcher Frontend - AI Instructions

If you just want to use ChatGPT to convert your plain text resume into the JSON format expected by the frontend without using the app's backend, simply paste this instruction to ChatGPT:

---

**Prompt for ChatGPT:**

"Convert the following resume text into a strictly formatted JSON object matching the schema below. Respond ONLY with the raw JSON, no markdown formatting or extra text.

```json
{
  "personalInfo": {
    "name": "YOUR NAME",
    "title": "PROFESSIONAL TITLE",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/username"
  },
  "summary": "Professional summary paragraph...",
  "workExperience": [
    {
      "id": 1,
      "title": "Job Title",
      "company": "Company Name",
      "years": "Jan 2020 – Present",
      "description": [
        "Bullet point 1",
        "Bullet point 2"
      ]
    }
  ],
  "education": [
    {
      "id": 1,
      "degree": "Degree Name",
      "institution": "University Name",
      "years": "2018 – 2022",
      "description": "Any honors or GPA"
    }
  ],
  "additional": {
    "technicalSkills": ["Skill 1", "Skill 2"],
    "languages": ["English - Native", "Spanish - B2"],
    "certificationsTraining": ["Cert 1", "Cert 2"]
  }
}
```

**Resume Text:**
[PASTE YOUR RESUME TEXT HERE]"

---

**How to use it:**
1. Copy the output JSON from ChatGPT.
2. Go to the Web App.
3. Click "Import JSON" in the top right.
4. Paste the JSON and click OK.
5. Download your beautiful A4 PDF!
