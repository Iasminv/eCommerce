import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import ViewCard from "../ui/ViewCard";

export default function Details() {
  const { product_id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null); // Store product details
  const [cookies, setCookie] = useCookies(["cart"]); // Cookie management
  const apiHost = import.meta.env.VITE_API_HOST; // API Host URL
  const apiUrl = `${apiHost}/api/products/get/${product_id}`; // API URL

  // Fetch product details
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Failed to fetch product details.");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      }
    }
    fetchData();
  }, [apiUrl]);

  // Add product ID to the cart cookie
  function addToCart(productId) {
    // add to cookie
    if (cookies.cart) {
      setCookie('cart', cookies.cart + ',' + productId, { maxAge: 7200 }); // 1hr = 3600 seconds
    }
    else {
      setCookie('cart', productId, { maxAge: 604800 });
    }
  }
  

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {product ? (
          <ViewCard product={product} apiHost={apiHost} />
        ) : (
          <p className="text-center">Product not found...</p>
        )}
      </div>

      {product && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => addToCart(product.product_id)}
            className="btn btn-primary me-3"
          >
            Add to Cart
          </button>
          <Link to="/" className="btn btn-secondary">
            Go Back
          </Link>
        </div>
      )}

      <p className="text-center mt-3">Cookie value: {cookies.cart}</p>
    </div>
  );
}