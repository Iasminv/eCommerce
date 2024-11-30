import { Link } from "react-router-dom";

// Display card with an improved professional design
export default function Card({ product, apiHost }) {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex">
      <div className="card h-100 border-1">
        {/* Clickable Image */}
        <Link to={`/details/${product.product_id}`}>
          <img
            src={`${apiHost}/images/${product.filename}`}
            alt={product.name}
            className="card-img-top img-fluid"
            style={{ objectFit: "cover", height: "200px" }}
          />
        </Link>

        {/* Card Body */}
        <div className="card-body d-flex flex-column justify-content-between">
          {/* Product Name */}
          <h5 className="card-title text-truncate" title={product.name}>
            {product.name}
          </h5>

          {/* Product Cost */}
          <p className="card-text fw-bold fs-5">${product.cost}</p>

        </div>
      </div>
    </div>
  );
}
