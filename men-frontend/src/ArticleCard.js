import React from "react";

const sourceColors = {
  "Al Jazeera": "#0077B5", // Example: Blue
  "Al Arabiya": "#D7263D", // Example: Red
};

const ArticleCard = ({ article }) => {
  const { title, image, source, pubDate, link } = article;
  const badgeColor = sourceColors[source] || "#333";

  return (
    <div
      style={{
        border: `1px solid ${badgeColor}`,
        borderRadius: "8px",
        padding: "1rem",
        margin: "1rem",
        maxWidth: "300px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{title}</h3>
        <span
          style={{
            backgroundColor: badgeColor,
            color: "#fff",
            borderRadius: "4px",
            padding: "0.2rem 0.5rem",
            fontSize: "0.8rem",
          }}
        >
          {source}
        </span>
      </div>
      {image && (
        <img
          src={image}
          alt="Article"
          style={{ width: "100%", borderRadius: "4px", marginTop: "0.5rem" }}
        />
      )}
      <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.5rem 0" }}>
        {new Date(pubDate).toLocaleString()}
      </p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: badgeColor }}
        >
          Read more
        </a>
      )}
    </div>
  );
};

export default ArticleCard;
