import React from "react";
import "./FeaturedCard.css";

const FeaturedCard = ({ article }) => {
  const { image, source, title, summary, pubDate, link } = article;

  const formattedDate = new Date(pubDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="featured-card-link"
    >
      <div className="featured-card">
        <div className="featured-card-image">
          {image && <img src={image} alt="Article" />}
        </div>
        <div className="featured-card-content">
          <p className="featured-card-source">{source}</p>
          <h2 className="featured-card-title">{title}</h2>
          <p className="featured-card-date">{formattedDate}</p>
          {summary && <p className="featured-card-summary">{summary}</p>}
        </div>
      </div>
    </a>
  );
};

export default FeaturedCard;
