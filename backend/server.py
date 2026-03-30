"""Resume Matcher Backend – keyword-based job matching API."""

import re
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Resume Matcher API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "shall", "should", "may", "might", "can", "could", "must", "that",
    "this", "these", "those", "it", "its", "we", "you", "they", "he",
    "she", "him", "her", "his", "our", "your", "their", "not", "no",
    "as", "if", "so", "up", "out", "about", "into", "over", "after",
    "all", "also", "than", "then", "each", "every", "any", "such",
    "more", "most", "other", "some", "very", "just", "which", "who",
    "whom", "what", "when", "where", "how", "why", "am", "i", "me",
    "my", "myself", "us", "ourselves", "yours", "yourself", "yourselves",
    "himself", "herself", "itself", "themselves", "both", "few", "many",
    "much", "own", "same", "too", "only", "between", "through", "during",
    "before", "while", "once", "here", "there", "again", "further",
    "able", "work", "working", "experience", "role", "job", "position",
    "team", "company", "required", "requirements", "responsibilities",
    "including", "etc", "using", "used", "based", "well", "new",
    "need", "needs", "looking", "join", "part", "time", "full",
    "years", "year", "day", "days", "strong", "good", "best",
    "make", "making", "ensure", "ensuring", "across", "within",
}


def extract_keywords(text: str) -> list[str]:
    """Extract meaningful keywords from text, removing stop words."""
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{1,}", text.lower())
    seen = set()
    keywords = []
    for w in words:
        if w not in STOP_WORDS and w not in seen:
            seen.add(w)
            keywords.append(w)
    return keywords


def extract_phrases(text: str) -> list[str]:
    """Extract multi-word phrases (2-3 words) that might be skill names."""
    text_lower = text.lower()
    phrases = []
    common_skills = [
        "machine learning", "deep learning", "data science", "project management",
        "data analysis", "data annotation", "quality assurance", "quality control",
        "public speaking", "problem solving", "analytical thinking",
        "cross functional", "microsoft excel", "amazon sagemaker",
        "natural language", "computer vision", "content review",
        "relationship management", "stakeholder communication",
        "issue resolution", "content classification",
        "process compliance", "spanish language", "english language",
    ]
    for phrase in common_skills:
        if phrase in text_lower:
            phrases.append(phrase)
    return phrases


class MatchRequest(BaseModel):
    job_description: str
    cv_text: str


class MatchResponse(BaseModel):
    score: float
    matched_keywords: list[str]
    missing_keywords: list[str]
    matched_phrases: list[str]
    jd_keyword_count: int
    match_count: int


@app.post("/api/match", response_model=MatchResponse)
async def match_keywords(req: MatchRequest):
    """Extract keywords from JD and match against CV text."""
    jd_keywords = extract_keywords(req.job_description)
    cv_text_lower = req.cv_text.lower()

    matched = []
    missing = []
    for kw in jd_keywords:
        if kw in cv_text_lower:
            matched.append(kw)
        else:
            missing.append(kw)

    jd_phrases = extract_phrases(req.job_description)
    cv_phrases = extract_phrases(req.cv_text)
    matched_phrases = [p for p in jd_phrases if p in cv_phrases]

    total = len(jd_keywords)
    match_count = len(matched)
    score = round((match_count / total) * 100, 1) if total > 0 else 0

    return MatchResponse(
        score=score,
        matched_keywords=matched,
        missing_keywords=missing,
        matched_phrases=matched_phrases,
        jd_keyword_count=total,
        match_count=match_count,
    )


@app.get("/api/health")
async def health():
    return {"status": "ok"}
