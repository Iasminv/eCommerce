import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./ui/navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div>
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold">Brazilian Food Store</h1>
          <p className="lead">Discover the best Brazilian delicacies!</p>
        </div>
        <Outlet context={[isLoggedIn, setIsLoggedIn]} /> {/* Pass isLoggedIn and setIsLoggedIn as an array */}
      </div>
    </>
  );
}

export default App;
