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
          <div style="display: flex;align-items: center;"><div class="company-logo" style="margin-right: 12px;"><img style="width: 48px; height: 48px;" src="${response.logo}"></div><div><h2 class="job-title">${response.title}</h2><h3 style="font-weight: 500;" class="company-name">${response.company}</h3></div></div>
          <div style="display: flex;justify-content: space-between;align-items: center;width: 72%; margin: 0 auto;"><p style="font-size: larger;color: #b5b5b5"> ${response.location}</p><p class="tag">On-site</p></div>
          <div style="margin: 0 auto;display: flex;justify-content: space-between;align-items: center;"><p class="tag">Full-time</p><strong><a href="${response.url}" target="_blank">Apply now</a></strong></div>
        `;
      }
    });
  });

// Modified save job button click listener
saveJobButton.addEventListener('click', async () => {
  if (currentJobDetails) {
    try {
      // Show loading state
      saveJobButton.innerHTML = 'Saving...';
      saveJobButton.disabled = true;
      
      // Determine platform from URL
      let platform = 'Unknown';
      if (currentJobDetails.url.includes('naukri.com')) {
        platform = 'Naukri';
      } else if (currentJobDetails.url.includes('linkedin.com')) {
        platform = 'LinkedIn';
      } else if (currentJobDetails.url.includes('indeed.com')) {
        platform = 'Indeed';
      } else if (currentJobDetails.url.includes('angel.co')) {
        platform = 'AngelList';
      }

      // Prepare the request body
      const requestBody = {
        url: currentJobDetails.url,
        title: currentJobDetails.title,
        company: currentJobDetails.company,
        location: currentJobDetails.location,
        logo: currentJobDetails.logo,
        platform: platform
      };

      // Make API call to save job
      const response = await fetch('http://localhost:5050/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const savedJob = await response.json();
        console.log('Job saved successfully:', savedJob);
        
        // Show success state
        saveJobButton.innerHTML = 'Saved <span class="tick-icon">✔️</span>';
        saveJobButton.style.opacity = 0.5;
        
        // Close popup after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        // Handle API error
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to save job:', errorData);
        
        // Show error state
        saveJobButton.innerHTML = 'Failed to Save';
        saveJobButton.style.backgroundColor = '#ef4444';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          saveJobButton.innerHTML = 'Save Job';
          saveJobButton.style.backgroundColor = '';
          saveJobButton.disabled = false;
        }, 3000);
        
        alert(`Failed to save job: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Network error while saving job:', error);
      
      // Show network error state
      saveJobButton.innerHTML = 'Network Error';
      saveJobButton.style.backgroundColor = '#ef4444';
      
      // Reset button after 3 seconds
      setTimeout(() => {
        saveJobButton.innerHTML = 'Save Job';
        saveJobButton.style.backgroundColor = '';
        saveJobButton.disabled = false;
      }, 3000);
      
      alert('Network error. Please check if the server is running and try again.');
    }
  } else {
    alert('Could not save job details. Please try again.');
  }
});

// Helper function to get all saved jobs from API (if needed elsewhere)
async function getSavedJobs() {
  try {
    const response = await fetch('http://localhost:5050/api/jobs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const jobs = await response.json();
      console.log('Retrieved jobs from API:', jobs);
      return jobs;
    } else {
      console.error('Failed to retrieve jobs from API');
      return [];
    }
  } catch (error) {
    console.error('Network error while retrieving jobs:', error);
    return [];
  }
}

// Function to check if job already exists (to prevent duplicates)
async function checkJobExists(url) {
  try {
    const jobs = await getSavedJobs();
    return jobs.some(job => job.url === url);
  } catch (error) {
    console.error('Error checking if job exists:', error);
    return false;
  }
}

// Enhanced save job function with duplicate check
saveJobButton.addEventListener('click', async () => {
  if (currentJobDetails) {
    try {
      // Show loading state
      saveJobButton.innerHTML = 'Checking...';
      saveJobButton.disabled = true;
      
      // Check if job already exists
      const jobExists = await checkJobExists(currentJobDetails.url);
      if (jobExists) {
        saveJobButton.innerHTML = 'Already Saved';
        saveJobButton.style.backgroundColor = '#f59e0b';
        
        setTimeout(() => {
          window.close();
        }, 2000);
        return;
      }
      
      // Continue with saving if job doesn't exist
      saveJobButton.innerHTML = 'Saving...';
      
      // Determine platform from URL
      let platform = 'Unknown';
      if (currentJobDetails.url.includes('naukri.com')) {
        platform = 'Naukri';
      } else if (currentJobDetails.url.includes('linkedin.com')) {
        platform = 'LinkedIn';
      } else if (currentJobDetails.url.includes('indeed.com')) {
        platform = 'Indeed';
      } else if (currentJobDetails.url.includes('angel.co')) {
        platform = 'AngelList';
      }

      // Prepare the request body
      const requestBody = {
        url: currentJobDetails.url,
        title: currentJobDetails.title,
        company: currentJobDetails.company,
        location: currentJobDetails.location,
        logo: currentJobDetails.logo,
        platform: platform
      };

      // Make API call to save job
      const response = await fetch('http://localhost:5050/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const savedJob = await response.json();
        console.log('Job saved successfully:', savedJob);
        
        // Show success state
        saveJobButton.innerHTML = 'Saved <span class="tick-icon">✔️</span>';
        saveJobButton.style.opacity = 0.5;
        
        // Close popup after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        // Handle API error
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to save job:', errorData);
        
        // Show error state
        saveJobButton.innerHTML = 'Failed to Save';
        saveJobButton.style.backgroundColor = '#ef4444';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          saveJobButton.innerHTML = 'Save Job';
          saveJobButton.style.backgroundColor = '';
          saveJobButton.disabled = false;
        }, 3000);
        
        alert(`Failed to save job: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Network error while saving job:', error);
      
      // Show network error state
      saveJobButton.innerHTML = 'Network Error';
      saveJobButton.style.backgroundColor = '#ef4444';
      
      // Reset button after 3 seconds
      setTimeout(() => {
        saveJobButton.innerHTML = 'Save Job';
        saveJobButton.style.backgroundColor = '';
        saveJobButton.disabled = false;
      }, 3000);
      
      alert('Network error. Please check if the server is running and try again.');
    }
  } else {
    alert('Could not save job details. Please try again.');
  }
});

  // My jobs button click listener
  myJobsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://jobtrackr.com' });
  });
});