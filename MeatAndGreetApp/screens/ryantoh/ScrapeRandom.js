import cheerio from 'cheerio-without-node-native';

function getRandomInt(min, max) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Generate a random integer between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function scrape(query, cookingTime) {
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
                    time: cookingTime,
                    weight: quantityString, // <--- store weight here as a string
                });
            });
        });

        console.log("Scraped results:", scrapedResults);
        // Return one random result lol
        if (scrapedResults.length > 0) {
            console.log("Report to user: ADDED");
            alert("Lucky ingredient added!");
        } else {
            console.log("Report to user: NOT ADDED");
            alert("Unfortunately, you were not lucky :(");
        }

        return scrapedResults[getRandomInt(1, scrapedResults.length - 1)];
    } catch (error) {
        console.error("Error scraping FairPrice:", error);
        throw error;
    }
}