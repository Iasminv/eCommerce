import { useEffect, useState } from "react"

export default function Logout() {
  const [status, setStatus] = useState("Logging out...");
  
  useEffect(() => {
    async function logout() {
      const apiHost = import.meta.env.VITE_API_HOST; // API Host
      const apiURL = apiHost + "/api/logout"; // API url
      const response = await fetch(apiURL, {
        method: "POST",
        credentials: 'include' // inlcude cookies in request
      });

      if(response.ok) {        
        setStatus('You are successfully logged out.');
      }
      else {
        setStatus('Error encountered. Try again.');
      }
    }

    logout();
  }, []);

  return (
    <>
      <h1>Logout</h1>
      <p>{ status }</p>
    </>
  )
}