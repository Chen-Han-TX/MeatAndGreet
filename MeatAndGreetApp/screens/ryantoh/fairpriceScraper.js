import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

// Use the specialized Cheerio build
import cheerio from 'cheerio-without-node-native';

export default function FairpriceScraper(input_array) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      // Build the URL
      const baseUrl = 'https://www.fairprice.com.sg/search?query=';
      const searchUrl = `${baseUrl}${encodeURIComponent(query)}`;

      // Fetch the raw HTML
      // NOTE: React Native's fetch does NOT enforce browser-like CORS the same way,
      //       but the server *may* still block or return invalid data.
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          // Try to mimic a real browser
          'User-Agent': 'Mozilla/5.0 (compatible; RN-Scraper/1.0)',
        },
      });

      // If the server denies the request, you might get a 403 or another error
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const html = await response.text();

      // Parse HTML with the cheerio fork
      const $ = cheerio.load(html);

      // Attempt to locate product containers
      const productContainers = $('div[class*="product-container"]');
      const scrapedResults = [];

      productContainers.each((_, container) => {
        // each "container" might have multiple <a> children
        const productLinks = $(container).find('> a');

        productLinks.each((_, link) => {
          const $link = $(link);

          // Product title from the <img> tag's title attribute
          const imgElem = $link.find('img').first();
          const productTitle = imgElem.attr('title');

          // Link to product page
          const linkToProduct = $link.attr('href');
          const fullLink = `https://www.fairprice.com.sg${linkToProduct}`;

          // Find price spans
          const spanList = $link.find('span');
          let priceList = [];

          spanList.each((_, span) => {
            const text = $(span).text().trim();
            if (text.startsWith('$')) {
              const numericVal = parseFloat(text.replace('$', ''));
              if (!isNaN(numericVal)) {
                priceList.push(numericVal);
              }
            }
          });

          // If no price, skip
          if (priceList.length === 0) return;

          // Check for measurement (g, kg, ml, etc.)
          const units = ['kg','KG','g','G','ml','ML','l','L'];
          let measurement = '';
          spanList.each((_, span) => {
            const text = $(span).text().trim();
            if (units.some((unit) => text.includes(unit)) && text.length <= 15) {
              measurement = text;
            }
          });

          scrapedResults.push({
            title: productTitle || 'Unknown',
            price: Math.min(...priceList),
            measurement,
            link: fullLink,
            supermarket: 'ntuc',
          });
        });
      });

      setResults(scrapedResults);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Query failed. FairPrice may be down');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>FairPrice Direct Scraper (For Testing)</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginVertical: 8,
          padding: 8,
        }}
        placeholder="Type product name..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Scrape FairPrice" onPress={handleSearch} />
      {loading && <Text style={{ marginTop: 10 }}>Loading...</Text>}
      {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item}</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
            {item.measurement ? <Text>Measurement: {item.measurement}</Text> : null}
            <Text>Link: {item.link}</Text>
          </View>
        )}
      />
    </View>
  );
}
