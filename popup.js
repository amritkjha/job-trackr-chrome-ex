// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const jobDetailsContainer = document.getElementById('job-details');
  const saveJobButton = document.getElementById('save-job');
  const myJobsButton = document.getElementById('my-jobs');

  let currentJobDetails = null;

  // Get the current tab and send a message to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getJobDetails' }, (response) => {
      if (response) {
        currentJobDetails = response;
        jobDetailsContainer.innerHTML = `
          <div style="display: flex;align-items: center;"><img style="width: 48px; height: 48px; margin-right: 3px;" src="${response.logo}"><h2>${response.title}</h2></div>
          <div style="display: flex;justify-content: space-between;align-items: center;"><h3 style="font-weight: 500;">${response.company}</h3><p> ${response.location}</p></div>
          <div style="margin: 0 auto;width: fit-content;"><strong><a href="${response.url}" target="_blank">Apply now</a></strong></div>
        `;
      }
    });
  });

  // Save job button click listener
  saveJobButton.addEventListener('click', () => {
    if (currentJobDetails) {
      chrome.storage.local.get({ jobs: [] }, (result) => {
        const jobs = result.jobs;
        jobs.push(currentJobDetails);
        chrome.storage.local.set({ jobs: jobs }, () => {
          saveJobButton.innerHTML = 'Saved <span class="tick-icon">✔️</span>';
          saveJobButton.style.opacity = 0.5;
          saveJobButton.disabled = true;
          setTimeout(() => {
            window.close();
          }, 2000);
        });
      });
    } else {
      alert('Could not save job details. Please try again.');
    }
  });

  // My jobs button click listener
  myJobsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://jobtrackr.com' });
  });
});