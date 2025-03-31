// men-backend/index.js
const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const feeds = require("./feeds");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const parser = new Parser();

/**
 * GET /api/news
 * Fetches all feeds defined in feeds.js, merges them, returns JSON
 */
app.get("/api/news", async (req, res) => {
  try {
    let results = [];

    // Loop through each feed
    for (const feedConfig of feeds) {
      const feedData = await parser.parseURL(feedConfig.url);

      // feedData has .title, .items, etc.
      const items = (feedData.items || []).map((item) => {
        return {
          source: feedConfig.name,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          // Some RSS feeds have image in item.enclosure or custom fields
          // We'll attempt to get an image if present
          image:
            item.enclosure && item.enclosure.url ? item.enclosure.url : null,
          // or if there's a media:content or other property, you’d parse it similarly
        };
      });

      results = results.concat(items);
    }

    // Optional: sort all items by pubDate desc
    results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return res.json(results);
  } catch (error) {
    console.error("Error fetching RSS feeds:", error);
    return res.status(500).json({ error: "Failed to fetch feeds" });
  }
});

app.listen(PORT, () => {
  console.log(`men-backend running on port ${PORT}`);
});
