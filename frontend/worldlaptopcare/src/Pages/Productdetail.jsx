import { useParams, Link } from "react-router-dom";
import React from "react";
import {jsxdev as _jsxDEV} from "react/jsx-dev-runtime";


const products = {
  1: { name: "Dell Latitude 7400", desc: "Slim, fast and business-ready laptop.", price: "₹35,000" },
  2: { name: "HP EliteBook 840", desc: "Durable design with solid performance.", price: "₹38,000" },
  3: { name: "Lenovo ThinkPad X1", desc: "Premium ultrabook with excellent battery life.", price: "₹42,000" },
};

export default function ProductDetails() {
  const { id } = useParams();
  const product = products[id];

  if (!product) {
    return <div className="text-center mt-10 text-xl">Product not found</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-lg mx-auto border rounded-xl p-8 shadow text-center">
        <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.desc}</p>
        <p className="text-xl font-semibold mb-6">{product.price}</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}
