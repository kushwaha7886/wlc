import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 hover:shadow-lg transition">
      <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded-lg" />
      <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.specs.processor}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-blue-600 font-bold">₹{product.price}</span>
        <Link
          to={`/product/${product._id}`}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700"
        >
          View
        </Link>
      </div>
    </div>
  );
}