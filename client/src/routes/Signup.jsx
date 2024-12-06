import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {

  // react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [signupFail, setSignupFail] = useState(false);

  // form submit function
  async function formSubmit(data) {
    const apiHost = import.meta.env.VITE_API_HOST;
    const apiURL = `${apiHost}/api/users/signup`;
  
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
  
      if (response.ok) {
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        setSignupFail(errorData.error || "Signup failed. Please check your inputs.");
      }
    } catch (error) {
      setSignupFail("An unexpected error occurred. Please try again.");
    }
  }
  

  return (
    <div className="container mt-5">
      <h1>Signup</h1>
      {signupFail && <p className="text-danger">{signupFail}</p>}
      <form onSubmit={handleSubmit(formSubmit)} method="post" className="w-50">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input {...register("firstName", { required: "First Name is required." })} type="text" className="form-control bg-light" />
          {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input {...register("lastName", { required: "Last Name is required." })} type="text" className="form-control bg-light" />
          {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email (username)</label>
          <input {...register("email", { required: "Email is required." })} type="email" className="form-control bg-light" />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input {...register("password", { required: "Password is required." })} type="password" className="form-control bg-light" />
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
        <Link to="/login" className="btn btn-outline-dark ms-2">Cancel</Link>
      </form>
    </div>
  );
}
