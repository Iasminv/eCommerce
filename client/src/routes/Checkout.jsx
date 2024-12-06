import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Checkout() {
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [cookies, setCookie] = useCookies(["cart"]);
  const navigate = useNavigate();
  const setIsLoggedIn = useOutletContext();
  const apiHost = import.meta.env.VITE_API_HOST;

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    async function getUserSession() {
      try {
        const response = await fetch(`${apiHost}/api/users/getSession`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAddress(data);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

        const cartItems = cookies.cart ? cookies.cart.split(",") : [];
        setCart(cartItems);
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    }

    getUserSession();
  }, [cookies.cart, setIsLoggedIn]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiHost}/api/purchase/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          cart: cookies.cart,
        }),
      });

      if (response.ok) {
        // Clear cart cookie
        setCookie("cart", "", { path: "/" });
        navigate("/confirmation");
      } else {
        console.error("Failed to complete purchase");
        alert("Error completing purchase. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting purchase:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (!address) {
    return (
      <div className="container mt-5">
        <h1 className="mb-4">Checkout</h1>
        <p>
          You must <Link to="/login">login</Link> to proceed with the checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-light p-4 rounded shadow-sm">
        
        {/* Street */}
        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            type="text"
            className="form-control"
            {...register("street", { required: "Street is required" })}
          />
          {errors.street && <p className="text-danger">{errors.street.message}</p>}
        </div>

        {/* City */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && <p className="text-danger">{errors.city.message}</p>}
        </div>

        {/* Province */}
        <div className="mb-3">
          <label className="form-label">Province</label>
          <input
            type="text"
            className="form-control"
            {...register("province", { required: "Province is required" })}
          />
          {errors.province && <p className="text-danger">{errors.province.message}</p>}
        </div>

        {/* Country */}
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && <p className="text-danger">{errors.country.message}</p>}
        </div>

        {/* Postal Code */}
        <div className="mb-3">
          <label className="form-label">Postal Code</label>
          <input
            type="text"
            className="form-control"
            {...register("postal_code", {
              required: "Postal Code is required",
              pattern: {
                value: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
                message: "Invalid postal code format (e.g., A1A 1A1)",
              },
            })}
          />
          {errors.postal_code && (
            <p className="text-danger">{errors.postal_code.message}</p>
          )}
        </div>

        {/* Credit Card */}
        <div className="mb-3">
          <label className="form-label">Credit Card</label>
          <input
            type="text"
            className="form-control"
            {...register("credit_card", {
              required: "Credit card number is required",
              pattern: {
                value: /^[0-9]{13,19}$/,
                message: "Invalid credit card number",
              },
            })}
          />
          {errors.credit_card && (
            <p className="text-danger">{errors.credit_card.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="mb-3">
          <label className="form-label">Credit Expiry (MM/YY)</label>
          <input
            type="text"
            className="form-control"
            {...register("credit_expire", {
              required: "Expiry date is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: "Invalid expiry date format (MM/YY)",
              },
            })}
          />
          {errors.credit_expire && (
            <p className="text-danger">{errors.credit_expire.message}</p>
          )}
        </div>

        {/* CVV */}
        <div className="mb-3">
          <label className="form-label">CVV</label>
          <input
            type="text"
            className="form-control"
            {...register("credit_cvv", {
              required: "CVV is required",
              pattern: {
                value: /^[0-9]{3,4}$/,
                message: "Invalid CVV format",
              },
            })}
          />
          {errors.credit_cvv && (
            <p className="text-danger">{errors.credit_cvv.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3">
          Complete Purchase
        </button>
      </form>
    </div>
  );
}
