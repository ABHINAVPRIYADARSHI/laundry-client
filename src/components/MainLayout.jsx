// src/components/MainLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { auth } from "../firebase";
import { Menu } from "lucide-react"; // Install lucide-react if not already
import A2HSButton from "./A2HSButton";

export default function MainLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 flex items-center justify-between px-4 py-3">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="text-purple-700 w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-purple-700">Laundry Studio</h1>
        <div className="w-6" /> {/* Placeholder for spacing */}
      </header>

      {/* Sidebar Overlay */}
      <Sidebar user={user} open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Page Content */}
      <div className="pt-16">{children}</div>
      <A2HSButton />
    </div>
  );
}
