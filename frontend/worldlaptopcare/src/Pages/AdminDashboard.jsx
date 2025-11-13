import { useState } from "react";
import { Users, Package, CreditCard, Truck } from "lucide-react";

export default function AdminDashboard() {
  const [section, setSection] = useState("users");

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-1/4 bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-4">Admin Panel</h3>
        <ul className="space-y-2">
          <li onClick={() => setSection("users")} className="cursor-pointer hover:text-blue-600 flex items-center gap-2"><Users /> Users</li>
          <li onClick={() => setSection("products")} className="cursor-pointer hover:text-blue-600 flex items-center gap-2"><Package /> Products</li>
          <li onClick={() => setSection("orders")} className="cursor-pointer hover:text-blue-600 flex items-center gap-2"><CreditCard /> Orders</li>
          <li onClick={() => setSection("shipment")} className="cursor-pointer hover:text-blue-600 flex items-center gap-2"><Truck /> Shipments</li>
        </ul>
      </aside>

      <section className="flex-1 bg-white rounded-xl shadow p-6">
        {section === "users" && <div>👤 Manage Users</div>}
        {section === "products" && <div>💻 Manage Products</div>}
        {section === "orders" && <div>📦 Manage Orders & Payments</div>}
        {section === "shipment" && <div>🚚 Track Shipments</div>}
      </section>
    </div>
  );
}