import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import CartCard from "../ui/CartCard"; // Adjust the import path if necessary

export default function Cart() {
  const [products, setProducts] = useState([]); // Store fetched product details
  const [cookies, setCookie, removeCookie] = useCookies(["cart"]); // Access cart cookie
  const apiHost = import.meta.env.VITE_API_HOST; // API Host URL
  const taxRate = 0.15; // Define the tax rate

  useEffect(() => {
    async function fetchCartItems() {
      const cart = cookies.cart ? cookies.cart.split(",") : []; // Parse cart as array
      const uniqueIds = cart.length ? [...new Set(cart)] : []; // Get unique product IDs

      if (uniqueIds.length) {
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
          setProducts([]); // Gracefully handle fetch errors
        }
      } else {
        console.log("No items in cart.");
        setProducts([]); // No items in cart
      }
    }

    fetchCartItems();
  }, [cookies.cart, apiHost]);

  function removeFromCart(productId) {
    const cart = cookies.cart ? cookies.cart.split(",") : [];
    const updatedCart = cart.filter((id) => id !== String(productId));

    if (updatedCart.length > 0) {
      setCookie("cart", updatedCart.join(","), { maxAge: 7200 }); // Update cookie if not empty
    } else {
      removeCookie("cart"); // Remove cookie if empty
    }

    // Update state to reflect changes
    const updatedProducts = products.filter(
      (product) => product.product_id !== productId || --product.quantity > 0
    );
    setProducts(updatedProducts);
  }

  // Calculate subtotal
  const subtotal = products.reduce((acc, product) => acc + product.cost * product.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        {products.length > 0 ? (
          products.map((product) => (
            <CartCard
              key={product.product_id}
              product={product}
              apiHost={apiHost}
              removeFromCart={() => removeFromCart(product.product_id)} // Pass product_id correctly
            />
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {products.length > 0 && (
        <div className="mt-4">
          <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
          <h4>Tax: ${tax.toFixed(2)}</h4>
          <h4>Total: ${total.toFixed(2)}</h4>
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
