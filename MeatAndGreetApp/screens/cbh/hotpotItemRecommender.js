import OpenAI from "openai";
import { doc, updateDoc } from "firebase/firestore";
import {db} from "../../firebaseConfig";
import { getDoc } from "firebase/firestore";

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
            apiKey: "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",
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

        console.log(completion.choices[0].message.content)
    } catch (error) {
        console.error(error);
    }
}

/*
* Fetches all preferences from user.
* Inputs: List of Preferences in Plain Text
*/
function fetchPrefFromUser(preferences) {

}

// Obtain price, weight from FairPrice
function fetchPriceAndWeight() {

}

// Obtain calorie information from chatGPT
function fetchGptFoodCalories() {

}
