import React from "react";

export default function Orders() {
  // Placeholder data
  const orders = [
    { id: 1, date: "2023-10-01", status: "Delivered", total: "₹35,000" },
    { id: 2, date: "2023-09-15", status: "Shipped", total: "₹38,000" },
  ];

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">Date: {order.date}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{order.total}</p>
                  <button className="text-blue-600 hover:underline">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
