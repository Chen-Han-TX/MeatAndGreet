import OpenAI from "openai";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";  // Your Firestore instance
import { scrape } from "../ryantoh/ScrapeRandom"; // Your scraping function
import config from "../../config";          // Contains OPENAI_API_KEY, etc.

/**
 * Generates recommended food items and their respective attributes based on the provided item name.
 *
 * This asynchronous function uses OpenAI's API to generate recommendations for similar food items
 * and their associated emojis. It then parses the recommendations, scrapes additional information
 * for each recommended item, and transforms the results into a structured array to be used for further processing.
 *
 * @param roomId - A string containing the current room's room id in Firestore
 * @param {string} itemName - The name of the food item for which recommendations are to be generated.
 * @returns {Promise<void>} Does not return a value directly but modifies and updates the existing
 *                           data structure (e.g., `roomData.food`) with detailed information on the recommended items.
 *
 * @throws {Error} If OpenAI fails to generate a valid JSON array, or for any errors encountered
 *                 during scraping or processing.
 */
export const recommendItem = async (roomId, itemName) => {
    try {
        console.log("Generating recommendations for room:", roomId);

        // 1) Initialize OpenAI
        const openai = new OpenAI({
            apiKey: config.OPENAI_API_KEY,
            dangerouslyAllowBrowser: true
        });

        // 2) Fetch the current room
        const roomDocRef = doc(db, "rooms", roomId);
        const roomSnapshot = await getDoc(roomDocRef);
        if (!roomSnapshot.exists()) {
            throw new Error(`No room found with ID: ${roomId}`);
        }
        const roomData = roomSnapshot.data();

        // 4) Call OpenAI to get recommendations (for the searched item only!)
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You are to take in a string describing a food and return a Javascript array with ONE ELEMENT." +
                        "The array MUST be structured in this way [[item, an emoji of the food item]]." +
                        "You are to ONLY RETURN an array object, without any other words or content or formatting whatsoever." +
                        "Phrase the item name similar to common supermarket food items.",
                },
                {
                    role: "user",
                    content: itemName,
                },
            ],
        });

        // 5) Parse the OpenAI response as JSON
        // Example response: '[["Beef Shabu Shabu", "🥩"]'
        const content = completion.choices[0].message.content.trim();
        let inputArray;
        try {
            inputArray = JSON.parse(content); // must be a valid JSON array
        } catch (parseErr) {
            throw new Error(
                `OpenAI did not return valid JSON array. Received:\n${content}\nError: ${parseErr}`
            );
        }

        // 6) Scrape each recommended item
        // We'll store the scraping results in 'scrapedResults'
        const scrapedResults = [];
        for (let i = 0; i < inputArray.length; i++) {
            const [productName] = inputArray[i]; // item = [ "Beef Shabu Shabu", "🥩" ]
            // Call your scrape function (async)
            const result = await scrape(productName);
            console.log("Scraped result:", result);
            if (result) {
                scrapedResults.push(result);
            }
        }

        // 7) Transform your scrapedResults to the desired structure
        // Existing room might have a 'food' array or not, so we read it first
        const existingFood = roomData.food || [];

        // For each item in scrapedResults, we create an entry like:
        // { "Beef Shabu Shabu": { price: "10.95", weight: "500 g", imgURL: "some.url" }}
        // and push to the array
        scrapedResults.forEach((item) => {
            const entry = {
                [item.title]: {
                    price: String(item.price),
                    weight: item.weight,
                    imgURL: item.image,
                    storeURL: item.link
                },
            };
            existingFood.push(entry);
        });

        // 8) Update the existing room document in Firestore
        // Only updating the 'food' field here; you can also update 'isActive', etc., if desired
        await updateDoc(roomDocRef, {
            food: existingFood,
            // createdAt: new Date(),  // if you want to overwrite
            // isActive: true,         // if you want to overwrite
        });
        alert("Lucky ingredient added!");
        console.log("Room updated successfully with LUCKY ITEM:", roomId);
    } catch (error) {
        console.error("Error in recommendItems:", error);
    }
};