// utils/email-validator.ts

const EMAIL_SYNTAX_REGEX =
  // reasonably strict but not impossibly strict; accepts unicode local-part (RFC 6531 not fully)
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A better alternative is to use the "addr-spec" RFC regex, but that's huge and fragile.
// This regex balances correctness and practicality.

export function primaryEmailSyntaxCheck(email) {
  if (!email || typeof email !== "string") {
    return { ok: false, reason: "empty" };
  }
  const trimmed = email.trim();

  if (trimmed.length > 254) {
    return { ok: false, reason: "too_long" };
  }

  if (!EMAIL_SYNTAX_REGEX.test(trimmed)) {
    return { ok: false, reason: "syntax" };
  }

  const [local, domain] = trimmed.split("@");
  if (!local || !domain) return { ok: false, reason: "syntax" };

  // local-part length limit check
  if (local.length > 64) return { ok: false, reason: "local_too_long" };

  // basic domain label checks
  const labels = domain.split(".");
  if (labels.some((l) => l.length === 0 || l.length > 63)) {
    return { ok: false, reason: "invalid_domain_label" };
  }

  return { ok: true, local, domain };
}
