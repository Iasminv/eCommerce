import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import CartCard from "../ui/cartCard";

export default function Cart() {
  const [products, setProducts] = useState([]); // Store fetched product details
  const [cookies] = useCookies(["cart"]); // Access cart cookie
  const apiHost = import.meta.env.VITE_API_HOST; // API Host URL

  useEffect(() => {
    async function fetchCartItems() {
      const cart = cookies.cart ? cookies.cart.split(",") : []; // Parse cart as array
      const uniqueIds = [...new Set(cart)]; // Get unique product IDs

      if (uniqueIds.length > 0) {
        try {
          // Fetch all products and filter those in the cart
          const response = await fetch(`${apiHost}/api/products/all`);
          if (response.ok) {
            const allProducts = await response.json();

            // Filter products based on cart IDs and calculate quantities
            const productData = allProducts
              .filter((product) => uniqueIds.includes(String(product.product_id)))
              .map((product) => {
                const quantity = cart.filter((id) => id === String(product.product_id)).length;
                return { ...product, quantity };
              });

            setProducts(productData);
          } else {
            console.error("Failed to fetch all products.");
            setProducts([]);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      } else {
        setProducts([]); // No items in cart
      }
    }

    fetchCartItems();
  }, [cookies.cart, apiHost]);

  // Calculate subtotal
  const subtotal = products.reduce((acc, product) => acc + product.cost * product.quantity, 0);

  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        {products.length > 0 ? (
          products.map((product) => (
            <CartCard
            key={product.product_id}
            product={product}
            apiHost={apiHost}
            showLinks={false}
          />
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {products.length > 0 && (
        <div className="mt-4">
          <h4>Subtotal: ${subtotal}</h4>
        </div>
      )}
      <div className="mt-3">
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
        <Link to="/checkout" className="btn btn-success ms-3">
          Complete Purchase
        </Link>
      </div>
    </div>
  );
}
