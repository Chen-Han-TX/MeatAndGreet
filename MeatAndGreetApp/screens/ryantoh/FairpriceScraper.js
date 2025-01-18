import React, { useState } from "react";
import axios from "axios";

export const FairpriceScraper = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) {
            setError("Please enter a query.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:5000/api/search", {
                params: { q: query },
            });
            setResults(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch data.");
        }
    };

    return (
        <div>
            <h1>FairPrice Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
            />
            <button onClick={handleSearch}>Search</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {results.map((item, index) => (
                    <li key={index}>
                        <strong>{item.title}</strong> - ${item.price} ({item.measurement}) <br />
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            View Product
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FairpriceScraper;

