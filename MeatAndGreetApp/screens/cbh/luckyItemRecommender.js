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
                        "You are to take in a string of user preferences of food and return a Javascript array." +
                        "The array MUST be structured in this way [[item name, in seconds of no less than 5 and no more than 300, of the best boiling time in a hotpot for the food item recommended in this list, be reasonable], [item name, item name, in seconds of no less than 10, of the best boiling time in a hotpot for the food item recommended in this list, be reasonable], ...]." +
                        'An example will be [["Beef Shabu Shabu", "20"], ["Broccoli", "60"]].  IMPORTANT, You are to ONLY RETURN an array object, without any other words or content or formatting whatsoever.' +
                        "Phrase the item name similar to common supermarket food items.",
                },
                {
                    role: "user",
                    content: itemName,
                },
            ],
        });

        // 5) Parse the OpenAI response as JSON
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
        const scrapedResults = [];
        for (let i = 0; i < inputArray.length; i++) {
            const [productName, cookingTime] = inputArray[i];
            const result = await scrape(productName, parseInt(cookingTime, 10));
            console.log("Scraped result:", result);

            // Check if scrape returned valid data
            if (result && result.title && result.price && result.weight && result.image && result.link) {
                // Only push valid results
                scrapedResults.push(result);
            } else {
                console.log(`Invalid scraped result for ${productName}:`, result);
            }
        }

        // 7) Transform your scrapedResults to the desired structure
        const existingFood = roomData.food || [];

        scrapedResults.forEach((item) => {
            // Ensure item has the required fields
            if (item.title && item.price && item.weight && item.image && item.link) {
                const entry = {
                    [item.title]: {
                        price: String(item.price),
                        weight: item.weight,
                        imgURL: item.image,
                        time: "20", // Assuming "20" for cooking time, update as needed
                        storeURL: item.link
                    },
                };
                existingFood.push(entry);
            } else {
                console.log("Skipping item with missing fields:", item);
            }
        });

        // 8) Update the existing room document in Firestore
        if (existingFood.length > 0) {
            await updateDoc(roomDocRef, {
                food: existingFood,
            });
            console.log("Room updated successfully with new items:", roomId);
        } else {
            console.log("No valid food items to update in room:", roomId);
        }
    } catch (error) {
        console.error("Error in recommendItem:", error);
    }
};
