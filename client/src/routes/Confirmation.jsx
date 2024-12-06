import { Link } from 'react-router-dom';

export default function Confirmation() {
  return (
    <div className="container mt-5">
      <h1>Purchase Confirmed</h1>
      <p>Your purchase has been successfully completed!</p>
      <Link to="/" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );
}
