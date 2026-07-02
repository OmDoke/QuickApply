window.runGreenhouseFill = function(profile) {
  let filledCount = 0;
  
  const mapping = {
    'first_name': profile.firstName,
    'last_name': profile.lastName,
    'email': profile.email,
    'phone': profile.phone
  };
  
  for (const [id, value] of Object.entries(mapping)) {
    if (!value) continue;
    const input = document.getElementById(id);
    if (input && !input.value) { // Don't overwrite if already filled
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
    }
  }
  
  // Also run generic filler for custom questions
  if (window.runGenericFill) {
    const genericRes = window.runGenericFill(profile);
    return { filled: filledCount + genericRes.filled, skippedFiles: genericRes.skippedFiles };
  }
  
  return { filled: filledCount, skippedFiles: 1 };
};
