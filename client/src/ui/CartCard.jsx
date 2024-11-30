import { Link } from "react-router-dom";

// Display card with responsive styling
export default function CartCard(props) {
    const { product } = props;
    return (
        <div className="card mb-3 border-1">
            <div className="row g-0 align-items-center">
                {/* Image Column */}
                <div className="col-4 col-sm-3 d-flex align-items-center justify-content-center p-2">
                    <img
                        src={`${props.apiHost}/images/${product.filename}`}
                        className="img-fluid rounded"
                        alt={product.name}
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                    />
                </div>

                {/* Text Column */}
                <div className="col-8 col-sm-9">
                    <div className="card-body">
                        <h5 className="card-title text-truncate">{product.name}</h5>
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                            <p className="mb-1">
                                <span className="fw-bold">Price:</span> ${product.cost}
                            </p>
                            <p className="mb-1">
                                <span className="fw-bold">Quantity:</span> {product.quantity}
                            </p>
                            <p className="mb-0 text-success">
                                <span className="fw-bold">Total:</span> ${(product.cost * product.quantity)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
