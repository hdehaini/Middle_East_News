import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import FeaturedCard from "./components/FeaturedCard";
import ArticleCard from "./components/ArticleCard";

function App() {
  const [articles, setArticles] = useState([]);
  const [filterSource, setFilterSource] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/news")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setArticles(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  const uniqueSources = Array.from(
    new Set(
      Array.isArray(articles) ? articles.map((article) => article.source) : []
    )
  );

  // Filter articles by source and search text
  const filteredArticles = articles.filter((article) => {
    const matchesSource =
      filterSource === "All" || article.source === filterSource;
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  // Separate articles into featured, secondary, and remaining
  const featuredArticle = filteredArticles[0];
  const secondaryArticles = filteredArticles.slice(1, 4);
  const remainingArticles = filteredArticles.slice(4);

  return (
    <div>
      <NavBar />
      <div className="filter-container">
        <label>
          Source:&nbsp;&nbsp;
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueSources.map((source, idx) => (
              <option key={idx} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
        <label>
          Search:
          <input
            type="text"
            placeholder="Enter keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>
      <main>
        {featuredArticle && (
          <div className="featured-section">
            <div className="featured-article">
              <FeaturedCard article={featuredArticle} />
            </div>
            {secondaryArticles.length > 0 && (
              <div className="secondary-articles">
                {secondaryArticles.map((article, index) => (
                  <ArticleCard
                    key={index + 1}
                    article={article}
                    variant="secondary"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {remainingArticles.length > 0 && (
          <div className="remaining-articles">
            {remainingArticles.map((article, index) => (
              <ArticleCard
                key={index + 4}
                article={article}
                variant="remaining"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
