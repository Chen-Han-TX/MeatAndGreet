<img src="https://github.com/user-attachments/assets/26fd1c0f-f3c7-4d7c-9d4a-7a2f978d5f11"  width="100" height="100">

# MeatAndGreet
*NUS HacknRoll 2025*

![photo_2025-01-19 12 29 01](https://github.com/user-attachments/assets/c217afe7-2a19-41b2-bfa8-ef315508748a)


## Inspiration
Hotpot is a communal dining experience cherished by many, but the planning and execution often involve guesswork and coordination challenges. We wanted to create a platform that enhances the hotpot experience by simplifying logistics, ensuring perfect cooking times, and personalizing the meal based on everyone's preferences. After all, I am the one hosting and I was kinda lazy to coordinate :p

![photo_2025-01-19 12 28 53](https://github.com/user-attachments/assets/56909fff-1102-409d-b1ba-13922d0f8a59)


## What it does
MeatAndGreet is a cross platform react native app designed to streamline hotpot planning and elevate the dining experience. Key features include:

Session Planning: Users can create or join a hotpot session, allowing seamless coordination of ingredients and preferences.
AI-Driven Suggestions: Using chatGPT and real-time data from Fairprice, the app recommends ingredient pairings that cater to everyone's preferences and ensure the best hotpot combinations to keep everyone happy.
Built-in Timers: Each ingredient comes with a cooking timer, ensuring meats and vegetables are cooked just right.

![photo_2025-01-19 12 28 47](https://github.com/user-attachments/assets/4f4eeb70-b013-4994-8a08-e2652f7b1da5)


## How we built it
Frontend: We used React Native to create a user-friendly mobile interface that works across devices.
AI Integration: Leveraged ** for AI-based ingredient recommendations. Data is fetched from Fairprice's API to provide real-time pricing and availability.
Database: Used Firebase to store user preferences, hotpot session details, and ingredient timers.
Timers: Implemented with JavaScript and integrated directly into the app, with a smooth user interface to display real-time progress.


![photo_2025-01-19 12 28 41](https://github.com/user-attachments/assets/5ecb1c0c-b1fd-4640-a4fb-3daf9275db8b)


## Challenges we ran into
Data Integration: Pulling real-time data from Fairprice and ensuring accuracy in AI suggestions was tricky due to API limitations and inconsistencies.
Timer Precision: Calibrating ingredient timers to work for a variety of ingredients and preferences required extensive testing and fine-tuning.
User Coordination: Designing a seamless user experience for multiple people to join and manage a single session presented challenges in UI/UX and backend synchronization.
AI Complexity: Developing a recommendation engine that accounts for individual and group preferences, ingredient pairings, and availability was a complex but rewarding task.


## Accomplishments that we're proud of
Successfully integrated real-time data from Fairprice to provide intelligent and relevant suggestions.
Developed an intuitive, multi-user session management system that simplifies the logistics of a communal meal.
Created a built-in timer system that ensures perfect cooking for a wide variety of hotpot ingredients.
Designed an engaging and accessible interface that makes hotpot planning fun and collaborative.

## What we learned
Collaborative Design: Building features for group use requires careful consideration of synchronization and usability.
AI Personalization: Balancing personalization with real-time data input can create a powerful and engaging experience for users.
APIs and Real-Time Data: Working with third-party APIs taught us the importance of error handling and data validation.
Time Management: Building a complex project with multiple features within a limited timeframe pushed us to prioritize and iterate quickly.


## What's next for MeatAndGreet
Expanded Ingredient Database: Incorporate data from other supermarkets and local grocers for broader coverage.
Dietary Preferences: Add advanced filters for dietary restrictions like vegan, gluten-free, or halal/kosher options.
Gamification: Introduce badges and rewards for frequent users or creative hotpot combinations/who is the biggest eater :p

## Additional Features
Social Features: Enable users to share their hotpot creations or invite friends via social media.
Custom Timers: Allow users to input their own cooking preferences for ingredients.
Recipe Sharing: Provide a space for the community to share their unique hotpot recipes and ideas.

## Setup
1. Clone the repository.
2. Create a new file in the root directory, called "config.js".
3. Insert your OpenAI API Key as follows:

"""
// for environment variables
// not pushed to git

const config = {
    OPENAI_API_KEY: 'YOUR-API-KEY-HERE',
  };
  
export default config;
"""

4. run npm install
5. run npm start



## Built With
openai
react-native
  
