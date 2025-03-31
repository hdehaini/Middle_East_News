import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

function App() {
  const [articles, setArticles] = useState([]);
  const [filterSource, setFilterSource] = useState("All");

  useEffect(() => {
    fetch("http://localhost:3001/api/news")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  // Filter articles by source if a filter is selected
  const filteredArticles =
    filterSource === "All"
      ? articles
      : articles.filter((article) => article.source === filterSource);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <header>
        <h1>Middle East News (MEN)</h1>
        <div>
          <button onClick={() => setFilterSource("All")}>All</button>
          <button onClick={() => setFilterSource("Al Jazeera")}>
            Al Jazeera
          </button>
          <button onClick={() => setFilterSource("Al Arabiya")}>
            Al Arabiya
          </button>
        </div>
      </header>
      <main style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredArticles.map((article, idx) => (
          <ArticleCard key={idx} article={article} />
        ))}
      </main>
    </div>
  );
}

export default App;
