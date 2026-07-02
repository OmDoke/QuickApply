// Dictionary mapping standard profile keys to regular expressions for field matching.
window.fieldMatchers = {
  firstName: /first.*name|given.*name/i,
  lastName: /last.*name|family.*name|surname/i,
  fullName: /full.*name|name/i, // Will only be used if first/last aren't separated
  email: /e-?mail/i,
  phone: /phone|mobile|cell|telephone/i,
  address: /address|street/i,
  city: /city/i,
  state: /state|province/i,
  zip: /zip|postal/i,
  country: /country/i,
  linkedin: /linkedin/i,
  github: /github/i,
  portfolio: /portfolio|website|personal.*site/i,
  company: /company|employer/i,
  title: /title|role|position/i,
  university: /university|college|school/i,
  degree: /degree/i
};

// Generic field matcher logic
window.matchField = function(identifier) {
  if (!identifier) return null;
  for (const [key, regex] of Object.entries(window.fieldMatchers)) {
    if (regex.test(identifier)) {
      return key;
    }
  }
  return null;
};
