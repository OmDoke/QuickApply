// Background Service Worker

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize default profile and tracker
    chrome.storage.local.set({
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },
      applications: []
    });
  }
});
