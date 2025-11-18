/**
 * AIKeyInput Component
 * 
 * Manages Gemini API key input with secure storage.
 * Features:
 * - Secure password input with show/hide toggle
 * - LocalStorage persistence
 * - Validation (keys must start with "AI")
 * - Visual feedback for saved state
 */

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AIKeyInput() {
    const [apiKey, setApiKey] = useState("");
    const [saved, setSaved] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [feedback, setFeedback] = useState(""); // For success/error messages

    // Load key from localStorage on component mount
    useEffect(() => {
        const storedKey = localStorage.getItem("gemini_ai_api_key");
        if (storedKey) {
            setApiKey(storedKey);
            setSaved(true);
        }
    }, []);

    const handleSave = () => {
        const trimmedKey = apiKey.trim();

        // Validate: Accept Gemini (AI) keys starting with "AI"
        if (trimmedKey.startsWith("AI")) {
            localStorage.setItem("gemini_ai_api_key", trimmedKey);
            setSaved(true);
            setFeedback("✅ API Key saved successfully!");
            setTimeout(() => setFeedback(""), 3000);
        } else {
            setFeedback("⚠️ Invalid format. Key must start with 'AI'");
            setTimeout(() => setFeedback(""), 3000);
        }
    };

    // Remove saved key from localStorage
    const handleRemove = () => {
        localStorage.removeItem("gemini_ai_api_key");
        setApiKey("");
        setSaved(false);
        setFeedback("🗑️ API Key removed");
        setTimeout(() => setFeedback(""), 2000);
    };

    return (
        <div className="space-y-4">
            {/* Input field with show/hide toggle */}
            <div className="relative group">
                <input
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your Gemini API key" 
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                        saved
                            ? "bg-green-50/10 border-green-400/30 text-green-200 cursor-not-allowed"
                            : "bg-white/5 border-white/20 text-slate-50 focus:ring-purple-400 focus:border-purple-400 hover:border-white/40"
                    }`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={saved}
                />

                {/* Show/Hide toggle button - only visible when not saved */}
                {!saved && (
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition opacity-70 hover:opacity-100"
                        aria-label={showKey ? "Hide API key" : "Show API key"}
                    >
                        {showKey ? (
                            // Eye icon (show)
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // Eye-off icon (hide)
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M15.171 13.576l1.414 1.414A10.016 10.016 0 0020 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-2.053.204l1.44 1.44a4 4 0 015.28 5.28z" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Checkmark icon when saved */}
                {saved && (
                    <div className="absolute right-3 top-3 text-green-400 flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Save/Remove button */}
            <div className="flex gap-2">
                {!saved ? (
                    <button
                        onClick={handleSave}
                        disabled={!apiKey.trim()}
                        className="flex-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
                    >
                        Save API Key
                    </button>
                ) : (
                    <button
                        onClick={handleRemove}
                        className="flex-1 bg-red-500/20 text-red-200 border border-red-400/30 px-4 py-2.5 rounded-lg font-medium hover:bg-red-500/30 transition"
                    >
                        Remove Key
                    </button>
                )}
            </div>

            {/* Feedback message with animation */}
            {feedback && (
                <div className={`text-sm text-center p-2 rounded-lg transition-all ${
                    feedback.includes("✅")
                        ? "bg-green-500/20 text-green-200 border border-green-400/30"
                        : feedback.includes("⚠️")
                        ? "bg-yellow-500/20 text-yellow-200 border border-yellow-400/30"
                        : "bg-slate-400/20 text-slate-200 border border-slate-400/30"
                }`}>
                    {feedback}
                </div>
            )}

            {/* Status indicator */}
            {saved && (
                <div className="text-xs text-green-200/80 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    Key is securely saved locally
                </div>
            )}
        </div>
    );
}
