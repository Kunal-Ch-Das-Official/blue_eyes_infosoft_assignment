export function obfuscateEmail(
  email,
  {
    keepLocalFirstN = 0,
    keepLocalLastN = 4,
    maskChar = "x",
    minMaskLength = 1,
  } = {},
) {
  if (!email) return email;
  const s = email.trim();
  const at = s.indexOf("@");
  if (at === -1) {
    // not an email: fallback to show last N
    if (s.length <= keepLocalLastN) return s;
    return (
      maskChar.repeat(Math.max(0, s.length - keepLocalLastN)) +
      s.slice(-keepLocalLastN)
    );
  }

  const local = s.slice(0, at);
  const domain = s.slice(at + 1);

  const visibleEnd = Math.max(0, Math.min(local.length, keepLocalLastN));
  const visibleStart = Math.max(0, Math.min(local.length, keepLocalFirstN));

  // If local too short to mask, return original
  if (local.length <= visibleStart + visibleEnd) {
    return `${local}@${domain}`;
  }

  const maskedLen = Math.max(
    minMaskLength,
    local.length - (visibleStart + visibleEnd),
  );
  const start = local.slice(0, visibleStart);
  const end = local.slice(local.length - visibleEnd);
  const mask = maskChar.repeat(maskedLen);

  return `${start}${mask}${end}@${domain}`;
}
