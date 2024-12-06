import { useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";

export default function Logout() {
  const [status, setStatus] = useState("Logging out...");
  const [isLoggedIn, setIsLoggedIn] = useOutletContext(); // Access the context from App
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      const apiHost = import.meta.env.VITE_API_HOST;
      const apiURL = apiHost + "/api/users/logout";
      const response = await fetch(apiURL, {
        method: "POST",
        credentials: 'include'
      });

      if(response.ok) {
        setStatus('You are successfully logged out.');
        setIsLoggedIn(false); // Update the isLoggedIn state after successful logout
        navigate('/'); // Redirect to home page
      } else {
        setStatus('Error encountered. Try again.');
      }
    }

    logout();
  }, [setIsLoggedIn, navigate]);

  return (
    <div className="container mt-5">
      <h1>Logout</h1>
      <p>{ status }</p>
      {status === 'You are successfully logged out.' && (
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary me-2">Login</Link>
          <Link to="/" className="btn btn-outline-dark">Home</Link>
        </div>
      )}
    </div>
  );
}
