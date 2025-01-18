import OpenAI from "openai";

export const recommendItems = async (preferences) => {
    try {
        const openai = new OpenAI({
            apiKey: "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",
            dangerouslyAllowBrowser: "true"
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "developer",
                    content: "You are to take in a string of user preferences of food and return an array of food items." },
                {
                    role: "user",
                    content: "",
                },
            ],
        });
        console.log(completion.choices[0].message)
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




