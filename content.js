// content.js

function scrapeJobDetails() {
  const jobDetails = {
    title: '',
    company: '',
    location: '',
    url: window.location.href
  };

  try {
    // Naukri
    if (window.location.href.includes('naukri.com')) {
      const titleElement = document.querySelector('h1.styles_jd-header-title__rZwM1');
      if (titleElement) {
        jobDetails.title = titleElement.innerText.trim();
      }

      const companyElement = document.querySelector('div.styles_jd-header-comp-name__MvqAI > a');
      if (companyElement) {
        jobDetails.company = companyElement.innerText.trim();
      }

      const locationElement = document.querySelector('div.styles_jhc__loc___Du2H > span > a');
      if (locationElement) {
        jobDetails.location = locationElement.innerText.trim();
      }
    }
    // LinkedIn
    else if (window.location.href.includes('linkedin.com/jobs/view')) {
      jobDetails.title = document.querySelector('h1.jobs-top-card__job-title, h1.top-card-layout__title')?.innerText.trim();
      jobDetails.company = document.querySelector('a.jobs-top-card__company-name, a.topcard__org-name-link')?.innerText.trim();
      jobDetails.location = document.querySelector('span.jobs-top-card__bullet, span.topcard__flavor--bullet')?.innerText.trim();
    }
    // Indeed
    else if (window.location.href.includes('indeed.com/viewjob')) {
      jobDetails.title = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.innerText.trim();
      jobDetails.company = document.querySelector('div[data-testid="inlineHeader-companyName"]')?.innerText.trim();
      jobDetails.location = document.querySelector('div[data-testid="inlineHeader-companyLocation"]')?.innerText.trim();
    }
    // AngelList
    else if (window.location.href.includes('angel.co/company')) {
      jobDetails.title = document.querySelector('h1')?.innerText.trim();
      jobDetails.company = document.querySelector('a[href^="/company/"]')?.innerText.trim();
      jobDetails.location = document.querySelector('div.text-gray-500')?.innerText.trim();
    }

    return jobDetails;

  } catch (error) {
    console.error("Job Trackr: Error scraping job details:", error);
    return jobDetails; // Return empty details on error
  }
}

// Send scraped data to the background script
const jobData = scrapeJobDetails();
if (jobData && jobData.title) {
  chrome.runtime.sendMessage({
    type: 'JOB_DETAILS',
    payload: jobData
  });
}
