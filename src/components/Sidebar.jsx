// src/components/Sidebar.jsx
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar({ user, open, onClose }) {
  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20"
          onClick={onClose}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mt-16 p-4">
          {user && (
            <div className="mb-6 text-gray-700">
              <p className="font-medium">Hi, {user.displayName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}

          <nav className="space-y-4">
            <a
              href="/"
              onClick={onClose}
              className="block px-3 py-2 rounded-md hover:bg-purple-100 text-purple-700 font-medium"
            >
              Home
            </a>
            <a
              href="/orders"
              onClick={onClose}
              className="block px-3 py-2 rounded-md hover:bg-purple-100 text-purple-700 font-medium"
            >
              Order History
            </a>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
