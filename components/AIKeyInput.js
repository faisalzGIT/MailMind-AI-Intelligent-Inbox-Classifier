"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AIKeyInput() {
    const [apiKey, setApiKey] = useState("");
    const [saved, setSaved] = useState(false);
    const [showKey, setShowKey] = useState(false);

    // Load key from localStorage if it exists
    useEffect(() => {
        const storedKey = localStorage.getItem("gemini_ai_api_key");
        if (storedKey) {
            setApiKey(storedKey);
            setSaved(true);
        }
    }, []);

    const handleSave = () => {
        const trimmedKey = apiKey.trim();

        // Accept Gemini (AI) keys
        if (trimmedKey.startsWith("AI")) {
            localStorage.setItem("gemini_ai_api_key", trimmedKey);
            setSaved(true);
            alert("✅ API Key saved successfully!");
        } else {
            alert("⚠️ Invalid API Key format");
        }
    };


    const handleRemove = () => {
        localStorage.removeItem("gemini_ai_api_key");
        setApiKey("");
        setSaved(false);
    };

    return (
        <div className="flex flex-col items-center gap-3 mt-6">
            <div className="relative w-80">
                <input
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your API key Gemini" 
                    className="border rounded-lg p-2 w-full text-center pr-10"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={saved}
                />

                {/* Toggle button with SVG icon */}
                {!saved && (
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-2 top-2 p-1"
                    >
                        <Image
                            src={showKey ? "/hide.svg" : "/show.svg"}
                            alt={showKey ? "Hide key" : "Show key"}
                            width={20}
                            height={20}
                            className="opacity-70 hover:opacity-100 transition"
                        />
                    </button>
                )}
            </div>

            {!saved ? (
                <button
                    onClick={handleSave}
                    className="border px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black"
                >
                    Save API Key
                </button>
            ) : (
                <button
                    onClick={handleRemove}
                    className="border px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black"
                >
                    Remove Saved Key
                </button>
            )}
        </div>
    );
}
