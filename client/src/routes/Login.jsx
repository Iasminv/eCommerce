import { useForm } from "react-hook-form";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginFail, setLoginFail] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useOutletContext(); // Access the context from App
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    async function checkLoginStatus() {
      const apiHost = import.meta.env.VITE_API_HOST;
      const response = await fetch(`${apiHost}/api/users/getSession`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, [setIsLoggedIn]);

  async function formSubmit(data) {
    const apiHost = import.meta.env.VITE_API_HOST;
    const apiURL = apiHost + "/api/users/login";

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (response.ok) {
      setIsLoggedIn(true); // Update the isLoggedIn state after successful login
      navigate('/'); // Redirect to home page
    } else {
      setLoginFail(true);
    }
  }

  if (isLoggedIn) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">You are already logged in</h3>
                <p className="text-center">You are already logged in. Click <Link to="/">here</Link> to go to the homepage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>

              {loginFail && <div className="alert alert-danger" role="alert">Incorrect username or password.</div>}

              <form onSubmit={handleSubmit(formSubmit)} method="post">
                <div className="mb-3">
                  <label className="form-label">Email (username)</label>
                  <input
                    {...register("email", { required: "Email is required." })}
                    type="text"
                    className="form-control bg-light"
                  />
                  {errors.email && <div className="text-danger">{errors.email.message}</div>}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    {...register("password", { required: "Password is required." })}
                    type="password"
                    className="form-control bg-light"
                  />
                  {errors.password && <div className="text-danger">{errors.password.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100">Login</button>
                <Link to="/" className="btn btn-outline-dark w-100 mt-2">Cancel</Link>
              </form>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/signup" className="fw-bold">Sign-up</Link> now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
