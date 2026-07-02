document.getElementById('optionsLink').addEventListener('click', () => {
  // In MV3, chrome.runtime.openOptionsPage() works, but we also need to ensure options_page is in manifest.
  // We'll use chrome.tabs.create if openOptionsPage fails, or just define it in manifest.
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
  }
});

document.getElementById('fillBtn').addEventListener('click', async () => {
  const statusBox = document.getElementById('statusBox');
  statusBox.textContent = 'Filling...';
  
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Only run on http/https pages
    if (!tab.url.startsWith('http')) {
      statusBox.textContent = 'Cannot run on this page.';
      return;
    }

    const { profile, applications } = await chrome.storage.local.get(['profile', 'applications']);
    
    if (!profile || !profile.firstName) {
      statusBox.textContent = 'Profile empty! Please edit your profile first.';
      return;
    }
    
    const url = tab.url;
    
    // Inject the matcher utils
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['utils/fieldMatchers.js']
    });

    // Determine the right scripts
    let scriptToRun = 'content-scripts/fill-generic.js';
    let functionToCall = 'runGenericFill';
    
    if (url.includes('greenhouse.io')) {
      scriptToRun = 'content-scripts/fill-greenhouse.js';
      functionToCall = 'runGreenhouseFill';
    } else if (url.includes('workday.com') || url.includes('myworkdayjobs.com')) {
      scriptToRun = 'content-scripts/fill-workday.js';
      functionToCall = 'runWorkdayFill';
    } else if (url.includes('jobs.lever.co')) {
      scriptToRun = 'content-scripts/fill-lever.js';
      functionToCall = 'runLeverFill';
    }

    if (scriptToRun !== 'content-scripts/fill-generic.js') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-scripts/fill-generic.js']
      });
    }
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [scriptToRun]
    });
    
    // Execute the runner
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (funcName, profileData) => {
        if (window[funcName]) {
          return window[funcName](profileData);
        }
        return null;
      },
      args: [functionToCall, profile]
    });
    
    if (results && results[0] && results[0].result) {
      const res = results[0].result;
      let msg = `Filled ${res.filled} fields.`;
      if (res.skippedFiles > 0) {
        msg += `\n(Attach resume manually)`;
      }
      statusBox.textContent = msg;
      
      if (res.filled > 0) {
        const appList = applications || [];
        const siteName = new URL(url).hostname;
        appList.push({
          site: siteName,
          url: url,
          date: new Date().toISOString(),
          fieldsFilled: res.filled
        });
        chrome.storage.local.set({ applications: appList });
      }
    } else {
      statusBox.textContent = 'Could not fill fields. No fields detected?';
    }
  } catch (err) {
    statusBox.textContent = 'Error: ' + err.message;
  }
});
