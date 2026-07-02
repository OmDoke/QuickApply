document.addEventListener('DOMContentLoaded', async () => {
  // Tabs logic
  const tabs = document.querySelectorAll('.nav li');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Load data
  const { profile, applications } = await chrome.storage.local.get(['profile', 'applications']);
  
  if (profile) {
    for (const key in profile) {
      const input = document.getElementById(key);
      if (input) {
        input.value = profile[key];
      }
    }
  }

  // Save data
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newProfile = {};
    const inputs = document.querySelectorAll('#profileForm input');
    
    inputs.forEach(input => {
      newProfile[input.id] = input.value;
    });
    
    chrome.storage.local.set({ profile: newProfile }, () => {
      const status = document.getElementById('saveStatus');
      status.textContent = 'Saved successfully!';
      setTimeout(() => { status.textContent = ''; }, 3000);
    });
  });

  // Render tracker
  const tbody = document.querySelector('#trackerTable tbody');
  const emptyState = document.getElementById('emptyTracker');
  
  if (applications && applications.length > 0) {
    emptyState.style.display = 'none';
    applications.reverse().forEach(app => {
      const tr = document.createElement('tr');
      const date = new Date(app.date).toLocaleString();
      tr.innerHTML = `
        <td>${date}</td>
        <td>${app.site}</td>
        <td>${app.fieldsFilled}</td>
        <td><a href="${app.url}" target="_blank" style="color: #4f46e5;">View</a></td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    emptyState.style.display = 'block';
    document.getElementById('trackerTable').style.display = 'none';
  }
});
