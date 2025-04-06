// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { auth } from "../firebase";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        fetchOrders(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async (uid) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
        Your Laundry Orders
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-purple-800">
                {order.shop_name}
              </h3>
              <p className="text-sm text-gray-700">Service: {order.service_name}</p>
              <p className="text-sm text-gray-700">Price: {order.service_price}</p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span className="font-medium text-blue-600">{order.status}</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Ordered on: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
