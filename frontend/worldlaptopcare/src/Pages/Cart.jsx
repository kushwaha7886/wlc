import React from "react";

export default function Cart() {
  // Placeholder data
  const cartItems = [
    { id: 1, name: "Dell Latitude 7400", price: "₹35,000", quantity: 1 },
    { id: 2, name: "HP EliteBook 840", price: "₹38,000", quantity: 2 },
  ];

  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price.replace("₹", "").replace(",", "")) * item.quantity, 0);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border rounded-lg p-4 shadow">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{item.price}</p>
                <button className="text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right mt-6">
            <p className="text-xl font-bold">Total: ₹{total.toLocaleString()}</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
