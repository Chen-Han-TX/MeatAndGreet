// import React, { useState } from "react";
// import axios from "axios";

// /* Obtain Fairprice Food */
// /*
// Input: array of food e.g. ["chicken", "shabu pork", "chinese sausage"]
// Output: dictionary of food
// e.g. 
// {
// "chicken" : {"price": 5.96, "weight": 300}
// "shabu pork" : {"price": 10.69, "weight": 700}
// }
// */
// export const fetchFoodPriceAndWeight = async (preferences) => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     try {
//       setError(null);
//       const response = await axios.get("http://localhost:5000/api/search", {
//         params: { q: query },
//       });
//       setResults(response.data);
//     } catch (err) {
//       setError("Failed to fetch data.");
//     }
//   };

//   return (
//     <div>
//       <h1>FairPrice Search</h1>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search for products..."
//       />
//       <button onClick={handleSearch}>Search</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <ul>
//         {results.map((item, index) => (
//           <li key={index}>
//             <strong>{item.title}</strong> - ${item.price} ({item.measurement}) <br />
//             <a href={item.link} target="_blank" rel="noopener noreferrer">
//               View Product
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default fetchFoodPriceAndWeight;
