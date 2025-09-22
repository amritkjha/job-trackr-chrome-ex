// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobDetails') {
    const jobDetails = scrapeJobDetails();
    sendResponse(jobDetails);
  }
});

function scrapeJobDetails() {
  const jobDetails = {
    title: '',
    company: '',
    location: '',
    logo: '',
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

      // Logo - multiple possible selectors
      const logoSelectors = [
        '.styles_jhc__comp-banner__ynBvr', // Main selector from your HTML
        'img[alt="Company Logo"]',
        '.styles_jhc__top img',
        '.styles_jhc__right img',
        'img[src*="logo"]',
        'img[srcset*="logo"]'
      ];
      
      for (const selector of logoSelectors) {
        const logoElement = document.querySelector(selector);
        if (logoElement) {
          // Get the best quality image source
          jobDetails.logo = logoElement.srcset ? 
            logoElement.srcset.split(',')[0].split(' ')[0] : 
            logoElement.src;
          if (jobDetails.logo) break;
        }
      }
    }
    // LinkedIn
    else if (window.location.href.includes('linkedin.com/jobs/view')) {
      jobDetails.title = document.querySelector('h1.jobs-top-card__job-title, h1.top-card-layout__title')?.innerText.trim();
      jobDetails.company = document.querySelector('a.jobs-top-card__company-name, a.topcard__org-name-link')?.innerText.trim();
      jobDetails.location = document.querySelector('span.jobs-top-card__bullet, span.topcard__flavor--bullet')?.innerText.trim();
      
      // LinkedIn logo selectors
      const linkedinLogoSelectors = [
        '.jobs-top-card__company-logo img',
        '.topcard__company-logo img',
        'img[alt*="logo" i]',
        '.jobs-company__logo img'
      ];
      
      for (const selector of linkedinLogoSelectors) {
        const logoElement = document.querySelector(selector);
        if (logoElement && logoElement.src) {
          jobDetails.logo = logoElement.src;
          break;
        }
      }
    }
    // Indeed
    else if (window.location.href.includes('indeed.com/viewjob')) {
      jobDetails.title = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.innerText.trim();
      jobDetails.company = document.querySelector('div[data-testid="inlineHeader-companyName"]')?.innerText.trim();
      jobDetails.location = document.querySelector('div[data-testid="inlineHeader-companyLocation"]')?.innerText.trim();
      
      // Indeed logo selectors  
      const indeedLogoSelectors = [
        'img[data-testid="companyLogo"]',
        '.jobsearch-CompanyAvatar img',
        'img[alt*="logo" i]'
      ];
      
      for (const selector of indeedLogoSelectors) {
        const logoElement = document.querySelector(selector);
        if (logoElement && logoElement.src) {
          jobDetails.logo = logoElement.src;
          break;
        }
      }
    }
    // AngelList
    else if (window.location.href.includes('angel.co/company')) {
      jobDetails.title = document.querySelector('h1')?.innerText.trim();
      jobDetails.company = document.querySelector('a[href^="/company/"]')?.innerText.trim();
      jobDetails.location = document.querySelector('div.text-gray-500')?.innerText.trim();
      
      // AngelList logo selectors
      const angelLogoSelectors = [
        '.company-avatar img',
        'img[alt*="logo" i]',
        '.company-header img'
      ];
      
      for (const selector of angelLogoSelectors) {
        const logoElement = document.querySelector(selector);
        if (logoElement && logoElement.src) {
          jobDetails.logo = logoElement.src;
          break;
        }
      }
    }

    // Log the results for debugging
    console.log('Job Trackr: Scraped data:', jobDetails);
    
    return jobDetails;

  } catch (error) {
    console.error("Job Trackr: Error scraping job details:", error);
    return jobDetails; // Return empty details on error
  }
}