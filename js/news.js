// news.js
// Handles rendering news articles and expand/collapse logic

// Get the container where articles will be inserted
const newsList = document.getElementById('news-list');

// Remove the loading message before adding articles
if (newsList && typeof newsArticles !== 'undefined') {
  newsList.innerHTML = ''; // This removes the loading message

  newsArticles.slice().reverse().forEach(article => {
    newsList.appendChild(createNewsArticle(article));
  });
}

// Function to create a single news article element
function createNewsArticle(article) {
  // Create the main article container
  const articleDiv = document.createElement('div');
  articleDiv.className = 'news-article';
  articleDiv.id = article.id;

  // Create and append the title
  const title = document.createElement('div');
  title.className = 'news-title';
  title.textContent = article.title;
  articleDiv.appendChild(title);

  // Create and append the date
  const date = document.createElement('div');
  date.className = 'news-date';
  date.textContent = article.date;
  articleDiv.appendChild(date);

  // Create and append the summary
  const summary = document.createElement('div');
  summary.className = 'news-summary';
  summary.textContent = article.summary;
  articleDiv.appendChild(summary);

  // Create the expandable content container
  const content = document.createElement('div');
  content.className = 'news-content';
  content.innerHTML = article.content;
  articleDiv.appendChild(content);

  // Create the expand/collapse toggle
  const toggle = document.createElement('span');
  toggle.className = 'expand-toggle';
  toggle.textContent = 'Show more';
  articleDiv.appendChild(toggle);

  // Expand/collapse logic
  let expanded = false;
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    expanded = !expanded;
    articleDiv.classList.toggle('expanded', expanded);
    toggle.textContent = expanded ? 'Show less' : 'Show more';
  });

  // Also allow clicking the article box to expand/collapse
  articleDiv.addEventListener('click', (e) => {
    // Prevent double toggling if the toggle was clicked
    if (e.target === toggle) return;
    expanded = !expanded;
    articleDiv.classList.toggle('expanded', expanded);
    toggle.textContent = expanded ? 'Show less' : 'Show more';
  });

  return articleDiv;
}

// Render all articles (most recent first)
if (newsList && typeof newsArticles !== 'undefined') {
  newsArticles.slice().reverse().forEach(article => {
    newsList.appendChild(createNewsArticle(article));
  });
}

// Utility: Get the latest N articles for the index page preview
function getLatestNewsArticles(n = 2) {
  // Returns the N most recent articles (as objects)
  return newsArticles.slice(-n).reverse();
}

// Expose the function globally for index.js to use
window.getLatestNewsArticles = getLatestNewsArticles;