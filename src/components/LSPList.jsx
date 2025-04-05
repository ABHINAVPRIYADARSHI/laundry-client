import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { getAuth } from "firebase/auth";

export default function LSPList() {
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("laundryShops").select("*");
    if (error) {
      console.error("Error fetching shops:", error.message);
    } else {
      setShops(data);
    }
    setLoading(false);
  };

  const filteredShops = shops.filter((shop) =>
    shop.address.toLowerCase().includes(filter.toLowerCase())
  );

  const parseServices = (services) => {
    if (Array.isArray(services)) return services;
    try {
      return JSON.parse(services);
    } catch {
      return [];
    }
  };

  const handleOrder = async () => {
    if (!selectedService || !selectedShop || !currentUser) return;

    const { error } = await supabase.from("orders").insert([
      {
        user_id: currentUser.uid,
        user_name: currentUser.displayName,
        shop_id: selectedShop.id,
        shop_name: selectedShop.name,
        service_name: selectedService.name,
        service_price: selectedService.price,
        status: "placed",
      },
    ]);

    if (error) {
      console.error("Error placing order:", error.message);
    } else {
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setSelectedShop(null);
        setSelectedService(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">
          Nearby Laundry Service Providers
        </h2>

        <input
          type="text"
          placeholder="Filter by location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full mb-6 p-2 border border-gray-300 rounded-lg shadow-sm"
        />

        {loading ? (
          <p className="text-center text-gray-600">Loading shops...</p>
        ) : filteredShops.length === 0 ? (
          <p className="text-center text-gray-500">No shops found for that location.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-purple-700">{shop.name}</h3>
                <p className="text-sm text-gray-700">{shop.address}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Services:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {parseServices(shop.services).map((s, idx) => (
                    <li key={idx}>
                      {s.name} – ₹{s.price}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedShop(shop)}
                  className="mt-3 text-sm bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition"
                >
                  Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-full">
            <h3 className="text-lg font-bold mb-4 text-purple-700">
              Select a service from {selectedShop.name}
            </h3>
            <ul className="space-y-2">
              {parseServices(selectedShop.services).map((service, idx) => (
                <li
                  key={idx}
                  onClick={() => setSelectedService(service)}
                  className={`p-2 border rounded-lg cursor-pointer ${
                    selectedService?.name === service.name
                      ? "bg-purple-100 border-purple-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {service.name} – ₹{service.price}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedShop(null)}
                className="px-4 py-1 border rounded-lg text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                disabled={!selectedService}
                className="px-4 py-1 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
            {orderSuccess && (
              <p className="mt-3 text-green-600 text-sm font-medium">Order successful!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
