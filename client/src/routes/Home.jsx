import { useState, useEffect } from "react";
import Card from "../ui/Card";

export default function Home() {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const apiHost = import.meta.env.VITE_API_HOST; // API Host
  const apiURL = apiHost + "/api/products/all"; 

  useEffect(() => {
    // Fetch data from API
    async function fetchData() {
      try {
        const response = await fetch(apiURL);
        if (response.ok) {
          const data = await response.json();
          setProducts(data || []); // Ensure data is an array
        } else {
          console.error("Failed to fetch products, status:", response.status);
          setProducts([]); // Set as empty array on error
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Set as empty array on error
      }
    }

    fetchData();
  }, [apiURL]);

  return (
    <div className="container py-3 justify-content-center">
      <div className="row justify-content-center">
        {products.length > 0 ? ( // Ensure products is not null
          products.map((product) => (
            <Card key={product.product_id} product={product} apiHost={apiHost} />
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
}
