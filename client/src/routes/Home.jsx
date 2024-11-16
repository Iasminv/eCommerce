import { useState, useEffect } from "react";

export default function Home(){
  const [user, setUser] = useState('');

  useEffect(() => {
    async function getUserSession() {
      const url = "http://localhost:3000/api/users/session";
      const response = await fetch(url, {
        method: "GET",
        credentials: 'include' // inlcude cookies in request
      });

      if(response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
      else {
        setUser('Nobody logged in');
      }
    }

    getUserSession();
  }, []);

  return (
    <>
      <h1>Home</h1>
      <p>User: {user}</p>
    </>
  )
}