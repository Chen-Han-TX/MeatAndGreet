import cheerio from 'cheerio-without-node-native';

export async function scrape(query) {
  console.log("Scraping with query:", query);

  try {
    // 1) Build the URL
    const baseUrl = 'https://www.fairprice.com.sg/search?query=';
    const searchUrl = `${baseUrl}${encodeURIComponent(query)}`;

    // 2) Fetch the page
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        // Attempt to mimic a real browser
        'User-Agent': 'Mozilla/5.0 (compatible; RN-Scraper/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    // 3) Get the HTML text
    const html = await response.text();

    // 4) Parse HTML with cheerio
    const $ = cheerio.load(html);

    // 5) Query product containers
    const productContainers = $('div[class*="product-container"]');
    const scrapedResults = [];

    productContainers.each((_, container) => {
      const productLinks = $(container).find('> a');

      productLinks.each((_, link) => {
        const $link = $(link);

        // Read product title from <img> tag’s "title" attribute
        const imgElem = $link.find('img').first();
        const productTitle = imgElem.attr('title') || 'Unknown';

        // Get the image URL and ensure it is fully qualified
        let imageUrl = imgElem.attr('src') || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = 'https://www.fairprice.com.sg' + imageUrl;
        }

        // Build product link
        const linkToProduct = $link.attr('href');
        const fullLink = `https://www.fairprice.com.sg${linkToProduct}`;

        // Find potential price spans
        const spanList = $link.find('span');
        const priceList = [];

        spanList.each((_, span) => {
          const text = $(span).text().trim();
          if (text.startsWith('$')) {
            const numericVal = parseFloat(text.replace('$', ''));
            if (!isNaN(numericVal)) {
              priceList.push(numericVal);
            }
          }
        });

        // If no valid prices, skip
        if (priceList.length === 0) return;

        // Check for measurement text (e.g., "200g", "1kg", "500ml", etc.)
        // Added keyword 'per' as some items are xxx per pack, xxx per box
        const units = ['kg', 'KG', 'g', 'G', 'ml', 'ML', 'l', 'L', 'per'];
        let quantityString = '';
        spanList.each((_, span) => {
          const text = $(span).text().trim();

          // Check if the text contains any unit and does not include "halal" (case-insensitive)
          const isLikelyUnit =
              units.some((unit) => text.includes(unit)) &&
              !/halal/i.test(text); // Exclude any text containing "halal"

          // If it's short enough to be a typical product weight string, store it
          if (isLikelyUnit && text.length <= 15) {
            quantityString = text;
          }
        });


        // Push into results array
        scrapedResults.push({
          title: productTitle,
          price: Math.min(...priceList),
          link: fullLink,
          supermarket: 'ntuc',
          image: imageUrl,
          weight: quantityString, // <--- store weight here as a string
        });
      });
    });

    console.log("Scraped results:", scrapedResults);
    // Return one result
    return scrapedResults[0];
  } catch (error) {
    console.error("Error scraping FairPrice:", error);
    throw error;
  }
}




// export function scrape(request) {
//     const [query, setQuery] = request[0];
//     console.log(query);
//     console.log("-1");
//     const [results, setResults] = [];
//     console.log("chicken");
//     console.log("0");
//     const [loading, setLoading] = false;
//     const [error, setError] = null;
//     console.log("1");

//     // setLoading(true);
//     // setResults([]);
//     // setError(null);

//     // modification to resolve conflict
//     try {
//         console.log("executing..")
//         // Build the URL
//         const baseUrl = 'https://www.fairprice.com.sg/search?query=';
//         const searchUrl = `${baseUrl}${encodeURIComponent(query)}`;

//         // Fetch the raw HTML
//         // NOTE: React Native's fetch does NOT enforce browser-like CORS the same way,
//         //       but the server *may* still block or return invalid data.
//         const response = fetch(searchUrl, {
//         method: 'GET',
//         headers: {
//             // Try to mimic a real browser
//             'User-Agent': 'Mozilla/5.0 (compatible; RN-Scraper/1.0)',
//         },
//         });

//         // If the server denies the request, you might get a 403 or another error
//         if (!response.ok) {
//         throw new Error(`Request failed with status: ${response.status}`);
//         }

//         const html = response.text();

//         // Parse HTML with the cheerio fork
//         const $ = cheerio.load(html);

//         // Attempt to locate product containers
//         const productContainers = $('div[class*="product-container"]');
//         const scrapedResults = [];

//         productContainers.each((_, container) => {
//         // each "container" might have multiple <a> children
//         const productLinks = $(container).find('> a');

//         productLinks.each((_, link) => {
//             const $link = $(link);

//             // Product title from the <img> tag's title attribute
//             const imgElem = $link.find('img').first();
//             const productTitle = imgElem.attr('title');

//             // Link to product page
//             const linkToProduct = $link.attr('href');
//             const fullLink = `https://www.fairprice.com.sg${linkToProduct}`;

//             // Find price spans
//             const spanList = $link.find('span');
//             let priceList = [];

//             spanList.each((_, span) => {
//             const text = $(span).text().trim();
//             if (text.startsWith('$')) {
//                 const numericVal = parseFloat(text.replace('$', ''));
//                 if (!isNaN(numericVal)) {
//                 priceList.push(numericVal);
//                 }
//             }
//             });

//             // If no price, skip
//             if (priceList.length === 0) return;

//             // Check for measurement (g, kg, ml, etc.)
//             const units = ['kg','KG','g','G','ml','ML','l','L'];
//             let measurement = '';
//             spanList.each((_, span) => {
//             const text = $(span).text().trim();
//             if (units.some((unit) => text.includes(unit)) && text.length <= 15) {
//                 measurement = text;
//             }
//             });

//             scrapedResults.push({
//             title: productTitle || 'Unknown',
//             price: Math.min(...priceList),
//             measurement,
//             link: fullLink,
//             supermarket: 'ntuc',
//             });
//         });
//         });

//         setResults(scrapedResults);
//         console.log(results);
//     } catch (err) {
//         console.error(err);
//         setError(err.message || 'Query failed. FairPrice may be down');
//     } finally {
//         setLoading(false);
//     }
// }