window.runLeverFill = function(profile) {
  let filledCount = 0;
  
  const mapping = {
    'name': (profile.firstName + ' ' + profile.lastName).trim(),
    'email': profile.email,
    'phone': profile.phone,
    'org': profile.company,
    'urls[LinkedIn]': profile.linkedin,
    'urls[GitHub]': profile.github,
    'urls[Portfolio]': profile.portfolio
  };
  
  for (const [name, value] of Object.entries(mapping)) {
    if (!value) continue;
    const input = document.querySelector(`input[name="${name}"]`);
    if (input && !input.value) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
    }
  }
  
  if (window.runGenericFill) {
    const genericRes = window.runGenericFill(profile);
    return { filled: filledCount + genericRes.filled, skippedFiles: genericRes.skippedFiles };
  }
  
  return { filled: filledCount, skippedFiles: 1 };
};
