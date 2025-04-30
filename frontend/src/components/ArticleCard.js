import React, { useState } from "react";
import "./ArticleCard.css";

const ArticleCard = ({ article, variant = "secondary" }) => {
  const [expanded, setExpanded] = useState(false);
  const { image, source, title, summary, pubDate, link } = article;

  const formattedDate = new Date(pubDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let displaySummary = summary;
  if (variant === "secondary") {
    // Lower the limit to 100 so that many summaries trigger the button
    const charLimit = 100;
    const truncatedSummary =
      summary && summary.length > charLimit
        ? summary.substring(0, charLimit) + "..."
        : summary;
    displaySummary = expanded ? summary : truncatedSummary;
  } else if (variant === "remaining") {
    const charLimit = 100;
    displaySummary =
      summary && summary.length > charLimit
        ? summary.substring(0, charLimit) + "..."
        : summary;
  }

  const toggleExpand = (e) => {
    e.preventDefault();
    setExpanded((prev) => !prev);
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card-link"
    >
      <div className="article-card">
        <div className="article-card-image">
          {image && <img src={image} alt="Article" />}
        </div>
        <div className="article-card-content">
          <p className="article-card-source">{source}</p>
          <h3 className="article-card-title">{title}</h3>
          <p className="article-card-date">{formattedDate}</p>
          {summary && <p className="article-card-summary">{displaySummary}</p>}
          {variant === "secondary" && summary && summary.length > 100 && (
            <button className="read-more-btn" onClick={toggleExpand}>
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
