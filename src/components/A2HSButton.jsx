import React, { useEffect, useState } from "react";

export default function A2HSButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const dismissedThisSession = sessionStorage.getItem("a2hs-dismissed");

    const handler = (e) => {
      if (!dismissedThisSession) {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    sessionStorage.setItem("a2hs-dismissed", "true");
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("a2hs-dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-xl rounded-full px-4 py-2 flex items-center gap-3 z-50">
      <p className="text-sm text-gray-700">Install App</p>
      <button
        onClick={handleInstallClick}
        className="bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-purple-700"
      >
        Add
      </button>
      <button
        onClick={handleDismiss}
        className="text-gray-500 text-xs underline hover:text-gray-700"
      >
        Not now
      </button>
    </div>
  );
}
