const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const cheerio = require("cheerio"); // for parsing HTML
const feeds = require("./feeds");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Configure the parser to handle namespaced fields
const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["media:content", "mediaContent"],
      ["dc:creator", "creator"],
    ],
  },
});

// Helper function to extract the image from an item
const extractImage = (item) => {
  // First, try enclosure if available
  const imageFromEnclosure =
    item.enclosure && item.enclosure.url ? item.enclosure.url : null;

  // Then check for media:content (mapped to mediaContent by customFields)
  let imageFromMedia = null;
  if (item.mediaContent) {
    if (Array.isArray(item.mediaContent)) {
      imageFromMedia = item.mediaContent[0].url || null;
    } else {
      imageFromMedia = item.mediaContent.url || null;
    }
  }

  // If still no image, try contentEncoded (which comes from <content:encoded>)
  let imageFromContent = null;
  if (!imageFromEnclosure && !imageFromMedia && item.contentEncoded) {
    const $ = cheerio.load(item.contentEncoded);
    imageFromContent = $("img").first().attr("src") || null;
  }

  // Lastly, fallback to the <description> field if available
  if (
    !imageFromEnclosure &&
    !imageFromMedia &&
    !imageFromContent &&
    item.description
  ) {
    const $ = cheerio.load(item.description);
    imageFromContent = $("img").first().attr("src") || null;
  }

  return imageFromEnclosure || imageFromMedia || imageFromContent;
};

// Helper to summarize an article using dynamic import for node-summary
const summarizeArticle = (title, text) => {
  return new Promise(async (resolve) => {
    try {
      const summaryModule = await import("node-summary");
      summaryModule.summarize(title, text, (err, summarized) => {
        resolve(err ? "" : summarized);
      });
    } catch (error) {
      console.error("Error importing node-summary:", error);
      resolve("");
    }
  });
};

app.get("/api/news", async (req, res) => {
  try {
    let results = [];

    for (const feedConfig of feeds) {
      const feedData = await parser.parseURL(feedConfig.url);
      const items = feedData.items || [];

      const processedItems = await Promise.all(
        items.map(async (item) => {
          const imageUrl = extractImage(item);
          // Use several possible fields for the article text
          const articleText =
            item.contentSnippet ||
            item.contentEncoded ||
            item.content ||
            item.description ||
            "";
          // Attempt to get a summary using node-summary
          const summaryText = await summarizeArticle(item.title, articleText);
          // Fallback: if no summary is generated, use a truncated version of the article text
          const fallbackSummary =
            articleText && articleText.length > 150
              ? articleText.substring(0, 150) + "..."
              : articleText;

          return {
            source: feedConfig.name,
            sourceLogo: feedConfig.sourceLogo, // Ensure this key matches your feed configuration
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            image: imageUrl,
            summary: summaryText || fallbackSummary, // Use fallback if summaryText is empty
          };
        })
      );

      results = results.concat(processedItems);
    }

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
