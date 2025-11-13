import React from "react";

export default function Wishlist() {
  // Placeholder data
  const wishlistItems = [
    { id: 1, name: "Dell Latitude 7400", price: "₹35,000" },
    { id: 2, name: "Lenovo ThinkPad X1", price: "₹42,000" },
  ];

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.price}</p>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add to Cart
                </button>
                <button className="text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
