export default function ViewCard({ product, apiHost }) {

  return (
    <div className="card" style={{ maxWidth: "500px" }}>
      {/* Image */}
      <img
        src={`${apiHost}/images/${product.filename}`}
        alt={product.name}
        className="card-img-top img-fluid"
        style={{ height: "500px", objectFit: "cover" }}
      />

      {/* Card Content */}
      <div className="card-body text-center">
        <h2 className="card-title fw-bold">{product.name}</h2>
        <p className="card-text text-muted">{product.description}</p>
        <p className="fw-bold fs-4 text-success">${product.cost}</p>
      </div>
    </div>
  );
}
