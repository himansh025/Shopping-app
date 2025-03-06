import { Search } from "lucide-react";
import React, { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      console.log("Searching for:", query);
      // Implement search functionality here
    }
  };

  return (
    <div className="flex items-center py-2 px-4 bg-slate-200 border-2 border-gray-100 rounded-full w-full max-w-md">
      <input
        type="text"
        className="flex-1 bg-transparent outline-none px-2 text-sm"
        placeholder="Search Product here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Search
        onClick={handleSearch}
        className="h-5 w-5 cursor-pointer text-gray-600 hover:text-black transition"
      />
    </div>
  );
}

export default SearchBar;
