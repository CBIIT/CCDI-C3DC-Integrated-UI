export const CONSENT_GLOSSARY_URL =
  'https://www.ncbi.nlm.nih.gov/gap/docs/submissionguide/#consentgloss';

/** Display value only (no brackets): "[c1]" / "[c1,c2]" / arrays / legacy strings. */
const bareConsentSegment = (segment) => {
  const t = String(segment).trim();
  if (!t) return null;
  const m = t.match(/^\[(.*)\]$/);
  const inner = m ? m[1] : t;
  const v = inner.trim();
  return v || null;
};

/** Normalize consent codes: "[c1]" or "[c1,c2]" (comma-separated inside one pair of brackets), or an array. */
export const parseConsentCodes = (raw) => {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((c) => c != null && String(c).trim() !== '')
      .flatMap((c) => parseConsentCodes(c));
  }
  const s = String(raw).trim();
  if (!s) return [];
  const oneBracketPair = /^\[([^\]]*)\]$/;
  const wrapped = s.match(oneBracketPair);
  if (wrapped) {
    return wrapped[1]
      .split(',')
      .map((part) => bareConsentSegment(part))
      .filter(Boolean);
  }
  const bracketMatches = [...s.matchAll(/\[([^\]]+)\]/g)];
  if (bracketMatches.length > 0) {
    return bracketMatches.flatMap((m) => m[1]
      .split(',')
      .map((part) => bareConsentSegment(part))
      .filter(Boolean));
  }
  return s.split(',').map((part) => bareConsentSegment(part)).filter(Boolean);
};

export const getConsentCodesMaxLength = () => {
  if (window.innerWidth <= 600) {
    return 35;
  }
  if (window.innerWidth <= 900) {
    return 55;
  }
  if (window.innerWidth <= 1200) {
    return 75;
  }
  return 95;
};
