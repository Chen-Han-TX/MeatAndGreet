import OpenAI from "openai";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ref, push } from 'firebase/database';
import { getDoc } from "firebase/firestore";
import { scrape, scrapeFairprice } from "../ryantoh/Scrape";

// .env variables can be accessed from here
import config from '../.././config';
/*
Scrapes Fairprice and returns a dictionary of the schema:

{"name" : {"price": "5", "weight": "200g", "imgURL": "xxx.com/xxx.img"}

*/

/**
 * Asynchronously recommends food items based on user preferences.
 *
 * The function takes in a string of user preferences related to food items and
 * generates an array of recommended items. Each item in the array is structured
 * as a 2 element array consisting of the item name and its corresponding emoji.
 *
 * @function
 * @param roomId - A string containing the current room's room id
 * @returns {Promise<void>} A Promise that resolves when the recommendations are processed
 * successfully, or logs an error in case of failure.
 */
export const recommendItems = async (roomId) => {
    try {
        console.log(roomId)
        console.log("Generating recommendations for room")
        const openai = new OpenAI({
            apiKey: config.OPENAI_API_KEY,
            dangerouslyAllowBrowser: "true"
        });

        let groupPreferences = ""
        const roomDocRef = doc(db, "rooms", roomId);
        const room = await getDoc(roomDocRef);
        for (const memberId of room.data().members) {
            const docRef = doc(db, "users", memberId);
            const member = await getDoc(docRef)
            groupPreferences += member.data().preferences + " "
        }

        console.log(groupPreferences)
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "developer",
                    content: "You are to take in a string of user preferences of food and return a Javascript array." +
                        "The array MUST be structured in this way [[item, an emoji of the food item], [item, an emoji of the food item], ...]" +
                        "You are to ONLY RETURN an array object, without any other words or content whatsoever." },
                {
                    role: "user",
                    content: groupPreferences,
                },
            ],
        });

        // // For debugging only
        // console.log(completion.choices[0].message.content)

        // Transfers data for scraping
        // scrapeFairprice(completion.choices[0].message.content)

        const inputArray = completion.choices[0].message.content;

        // We'll store the results here
        const results = [];

        // Loop through each inner array
        for (let i = 0; i < inputArray.length; i++) {
            // The first element of each sub-array is the query
            const query = inputArray[i][0];
            
            // Call the scrape function (synchronously in this example)
            const result = scrape(query);
            
            // Reorganise and push the result into firebase
            // current format for result
            const dbRef = ref(db, "rooms", roomId)

            results.push(result);
        }

    console.log(scrape("beef shabu shabu"))

        
    } catch (error) {
        console.error(error);
    }
}