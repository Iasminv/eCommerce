import { useState } from 'react'
import { Outlet } from 'react-router-dom' 
import Navbar from './ui/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Navbar />
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold">Brazilian Food Store</h1>
          <p className="lead">Discover the best Brazilian delicacies!</p>
        </div>
        <Outlet />
      </div>

    </>
  )
}

export default App
