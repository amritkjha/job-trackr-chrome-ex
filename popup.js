
// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const jobList = document.getElementById('job-list');
  const clearAllButton = document.getElementById('clear-all');

  // Get saved jobs from storage
  chrome.storage.local.get({ jobs: [] }, (result) => {
    const jobs = result.jobs;
    const uniqueJobs = jobs.filter((job, index, self) =>
        index === self.findIndex((j) => (
            j.url === job.url
        ))
    );

    // Display each job in the list
    uniqueJobs.forEach(job => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div><strong>Title:</strong> ${job.title}</div>
        <div><strong>Company:</strong> ${job.company}</div>
        <div><strong>Location:</strong> ${job.location}</div>
        <a href="${job.url}" target="_blank">View Job</a>
      `;
      jobList.appendChild(listItem);
    });
  });

  // Clear all jobs
  clearAllButton.addEventListener('click', () => {
    chrome.storage.local.set({ jobs: [] }, () => {
      console.log('All jobs cleared!');
      window.location.reload();
    });
  });
});
