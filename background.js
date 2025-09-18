
// background.js

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received from content script:', request);
  if (request.type === 'JOB_DETAILS' && request.payload && request.payload.title) {
    console.log('Processing JOB_DETAILS message with payload:', request.payload);
    // Get existing jobs from storage
    chrome.storage.local.get({ jobs: [] }, (result) => {
      console.log('Existing jobs from storage:', result.jobs);
      const jobs = result.jobs;
      // Add the new job
      jobs.push(request.payload);
      // Save the updated jobs array
      chrome.storage.local.set({ jobs: jobs }, () => {
        console.log('Job saved successfully!', request.payload);
      });
    });
  } else {
    console.log('Invalid or empty job details received. Not saving.');
  }
});
