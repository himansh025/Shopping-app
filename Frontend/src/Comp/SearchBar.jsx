import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearSearch, setProducts } from "../store/productsSlicer";
import axiosInstance from "../Config/apiConfig";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [showSearch, setshowSearch] = useState(false)
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)
        // console.log("role", user.role)
  const token = sessionStorage.getItem("token")
  const handleSearch = async () => {
    if (query.trim() === "") {
      dispatch(clearSearch());
      return;
    }
    let res;
    try {
      if (user?.role == "user") {
         res = await axiosInstance.get("/products/all", {
          params: { name: query }
        });
      }else{
       res = await axiosInstance.get("/products/seller/all", { params: { name: query } },
        {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      // console.log("res", res)

      dispatch(setProducts(res.data.products));
      setshowSearch(true)
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  useEffect(() => {
    handleSearch()
  }, [query])

  return (
    <div className="hidden md:flex items-center py-3 px-3 bg-slate-200 border-2 border-gray-100 rounded-full w-80 md:w-full m-3">
      <input
        type="text"
        className="flex-1 bg-transparent outline-none px-1 text-sm"
        placeholder="Search Product..."
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
