/* Display the return message as a list of food items in the following format: */
const mockIngredients = [
    { id: '1', name: 'Beef Slices', calories: 200, price: 5.0 },
    { id: '2', name: 'Pork Belly', calories: 250, price: 6.0 },
    { id: '3', name: 'Everbest Ring Roll', calories: 100, price: 5.05 },
];

/* Input: a list of all the text prompts */


// Export preferences as prompt to chatGPT
export const fetchGptFoodList = async (preferences) => {
    const [input, setInput] = useState('');
    // const [response, setResponse] = useState('');

    try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Update with the correct API endpoint
    const apiKey = process.env.OPENAI_API_KEY; // Replace with your actual API key
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const requestBody = {
        messages: [{ role: 'user', content: "Here is a list of preferred food items. " }],
    };

    const { data } = await axios.post(apiUrl, requestBody, { headers });

    // return 
    // setResponse(data.choices[0].message.content);
    fetchPriceAndWeight()


    } catch (error) {
    console.error('Error sending message:', error);
    }
};

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




