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
      // Title - multiple possible selectors
      const titleSelectors = [
        'h1.styles_jd-header-title__rZwM1',
        'h1[title]',
        '.styles_jd-header-title__rZwM1'
      ];
      
      for (const selector of titleSelectors) {
        const titleElement = document.querySelector(selector);
        if (titleElement) {
          jobDetails.title = titleElement.innerText.trim();
          break;
        }
      }

      // Company - multiple possible selectors
      const companySelectors = [
        'div.styles_jd-header-comp-name__MvqAI > a',
        '.styles_jd-header-comp-name__MvqAI a',
        'a[title*="Careers"]'
      ];
      
      for (const selector of companySelectors) {
        const companyElement = document.querySelector(selector);
        if (companyElement) {
          jobDetails.company = companyElement.innerText.trim();
          break;
        }
      }

      // Location - more flexible selectors
      const locationSelectors = [
        'div.styles_jhc__loc___Du2H > span > a', // Original with link
        'div.styles_jhc__loc___Du2H > span.styles_jhc__location__W_pVs > a', // More specific with link
        'div.styles_jhc__loc___Du2H > span', // Without link
        '.styles_jhc__location__W_pVs', // Just the location span
        '.styles_jhc__loc___Du2H span' // Any span inside location div
      ];
      
      for (const selector of locationSelectors) {
        const locationElement = document.querySelector(selector);
        if (locationElement) {
          jobDetails.location = locationElement.innerText.trim();
          break;
        }
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

    // Log the results for debugging
    console.log('Job Trackr: Scraped data:', jobDetails);
    
    return jobDetails;

  } catch (error) {
    console.error("Job Trackr: Error scraping job details:", error);
    return jobDetails; // Return empty details on error
  }
}

// Wait for page to be fully loaded before scraping
function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

// Main execution
async function executeScript() {
  await waitForPageLoad();
  
  // Add a small delay to ensure dynamic content is loaded
  setTimeout(() => {
    const jobData = scrapeJobDetails();
    
    if (jobData && jobData.title) {
      chrome.runtime.sendMessage({
        type: 'JOB_DETAILS',
        payload: jobData
      });
    } else {
      console.log('Job Trackr: No job data found or title missing');
      console.log('Available elements:', {
        titleElements: document.querySelectorAll('h1'),
        companyElements: document.querySelectorAll('a[href*="careers"], a[href*="company"]'),
        locationElements: document.querySelectorAll('[class*="location"], [class*="loc"]')
      });
    }
  }, 1000); // 1 second delay
}

executeScript();