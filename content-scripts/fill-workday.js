window.runWorkdayFill = function(profile) {
  let filledCount = 0;
  
  const getWorkdayInput = (automationIdPartial) => {
    return document.querySelector(`input[data-automation-id*="${automationIdPartial}"]`) || 
           document.querySelector(`textarea[data-automation-id*="${automationIdPartial}"]`);
  };

  const mapping = {
    'firstName': profile.firstName,
    'lastName': profile.lastName,
    'emailAddress': profile.email,
    'phone-number': profile.phone, // might need adjusting based on specific Workday tenant
    'addressSection_addressLine1': profile.address,
    'addressSection_city': profile.city,
    'addressSection_postalCode': profile.zip
  };
  
  for (const [idPartial, value] of Object.entries(mapping)) {
    if (!value) continue;
    const input = getWorkdayInput(idPartial);
    if (input && !input.value) {
      // Workday inputs often use React, setting value directly sometimes needs this hack
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(input, value);
      
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
