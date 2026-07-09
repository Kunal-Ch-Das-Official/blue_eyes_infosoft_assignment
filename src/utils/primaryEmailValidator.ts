const primaryEmailValidator = (emailId: string): boolean => {
  if (!emailId.includes("@")) return false;

  const domain = emailId.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  // Domain regex: allow letters, digits, hyphens, dots; no spaces; must have at least one dot
  const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/;

  return domainRegex.test(domain);
};

export default primaryEmailValidator;