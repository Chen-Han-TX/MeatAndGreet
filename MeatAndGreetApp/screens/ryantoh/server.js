const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const BASE_URL = "https://www.fairprice.com.sg/search?query=";

// Endpoint to fetch product data
app.get("/api/search", async (req, res) => {
  const keywords = req.query.q;
  const searchURL = `${BASE_URL}${encodeURIComponent(keywords)}`;

  try {
    const response = await axios.get(searchURL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const results = [];

    // Parse product containers
    $('div[class*="product-container"]').each((_, elem) => {
      const product = {};

      // Get product name
      const image = $(elem).find("img").attr("title");
      if (image) {
        product.title = image;
      }

      // Get link to product
      const link = $(elem).find("a").attr("href");
      if (link) {
        product.link = `https://www.fairprice.com.sg${link}`;
      }

      // Get prices (handle multiple prices)
      const priceList = [];
      $(elem)
        .find("span")
        .each((_, span) => {
          const text = $(span).text();
          if (text.includes("$")) {
            const cleanedPrice = parseFloat(text.replace("$", "").trim());
            if (!isNaN(cleanedPrice)) priceList.push(cleanedPrice);
          }
        });

      if (priceList.length > 0) {
        product.price = Math.min(...priceList);
      }

      // Get measurement (e.g., kg, g, ml, etc.)
      const units = ["kg", "g", "ml", "l", "KG", "G", "ML", "L"];
      $(elem)
        .find("span")
        .each((_, span) => {
          const text = $(span).text();
          if (units.some((unit) => text.includes(unit)) && text.length <= 15) {
            product.measurement = text.trim();
          }
        });

      if (Object.keys(product).length > 0) {
        results.push(product);
      }
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
