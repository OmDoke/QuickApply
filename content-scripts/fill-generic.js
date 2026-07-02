window.runGenericFill = function(profile) {
  let filledCount = 0;
  let skippedFiles = 0;
  
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
  
  inputs.forEach(input => {
    if (input.type === 'file') {
      skippedFiles++;
      return;
    }
    
    // gather signals
    let labelText = '';
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) labelText = label.innerText;
    }
    if (!labelText && input.closest('label')) {
      labelText = input.closest('label').innerText;
    }
    
    const signals = [
      input.name,
      input.id,
      input.placeholder,
      input.getAttribute('aria-label'),
      labelText
    ].filter(Boolean).join(' ');
    
    // matchField comes from utils/fieldMatchers.js
    const matchedKey = window.matchField ? window.matchField(signals) : null;
    
    if (matchedKey && profile[matchedKey]) {
      input.value = profile[matchedKey];
      // Dispatch events so React/Vue/Angular picks up the change
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
    }
  });
  
  return { filled: filledCount, skippedFiles: skippedFiles };
};
