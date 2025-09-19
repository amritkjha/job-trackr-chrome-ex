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
          <div><strong>Title:</strong> ${response.title}</div>
          <div><strong>Company:</strong> ${response.company}</div>
          <div><strong>Location:</strong> ${response.location}</div>
          <div><strong>URL:</strong> <a href="${response.url}" target="_blank">${response.url}</a></div>
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
          console.log('Job saved successfully!');
          window.close();
        });
      });
    }
  });

  // My jobs button click listener
  myJobsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://jobtrackr.com' });
  });
});