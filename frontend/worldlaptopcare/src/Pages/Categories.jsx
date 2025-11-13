import React from "react";

export default function Categories() {
  // Placeholder data
  const categories = [
    { id: 1, name: "Laptops", description: "High-performance laptops for work and play." },
    { id: 2, name: "Desktops", description: "Powerful desktops for home and office." },
    { id: 3, name: "Accessories", description: "Essential accessories for your devices." },
  ];

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Product Categories</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-6 shadow hover:shadow-lg transition text-center">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Products
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
