"use client";

import { useState } from "react";
import EmailShimmer from "@/components/ShimmerCard";

export default function EmailsPage() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [classifying, setClassifying] = useState(false);
    const [error, setError] = useState("");
    const [emailCount, setEmailCount] = useState(15);
    const [selectedEmail, setSelectedEmail] = useState(null);

    const categoryColors = {
        Important: "text-green-600 border-green-600",
        Marketing: "text-orange-500 border-orange-500",
        Spam: "text-red-500 border-red-500",
        General: "text-gray-500 border-gray-500",
    };

    // ✅ Fetch emails
    const fetchEmails = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/fetchEmails?count=${emailCount}`);
            const data = await res.json();
            setEmails(data?.emails || []);
        } catch (err) {
            console.error("Error fetching emails:", err);
            setError("Failed to fetch emails.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Classify emails
    const classifyEmails = async () => {
        setClassifying(true);
        try {
            const apiKey = localStorage.getItem("gemini_ai_api_key"); // ✅ get saved key
            if (!apiKey) {
                alert("Please enter your Gemini API key first!");
                setClassifying(false);
                return;
            }

            const res = await fetch("/api/classifyEmails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emails, apiKey }), // ✅ send key too
            });

            const data = await res.json();
            console.log("Classify response:", data);
            setEmails(data?.classifiedEmails || data || []);
        } catch (err) {
            console.error("Error classifying emails:", err);
        } finally {
            setClassifying(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Fetched Emails</h1>

                <div className="flex items-center gap-3">
                    <label htmlFor="emailCount" className="text-sm font-medium text-gray-100">
                        Show emails:
                    </label>
                    <select
                        id="emailCount"
                        value={emailCount}
                        onChange={(e) => setEmailCount(Number(e.target.value))}
                        className="border text-yellow-50 border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        {[10, 15, 20, 25, 30].map((num) => (
                            <option className="text-black" key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={fetchEmails}
                    className="border px-4 py-2 rounded-md hover:text-black hover:bg-gray-100"
                    disabled={loading}
                >
                    {loading ? "Fetching..." : "Fetch Emails"}
                </button>

                <button
                    onClick={classifyEmails}
                    className="border px-4 py-2 rounded-md hover:text-black hover:bg-gray-100"
                    disabled={classifying}
                >
                    {classifying ? "Classifying..." : "Classify Emails"}
                </button>
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* 🔥 Split Layout */}
            <div className="flex gap-6">
                {/* Left side — Email List */}
                <div className={`space-y-4 w-${selectedEmail ? "1/2" : "full"}`}>
                    {loading ? (
                        Array.from({ length: emailCount }).map((_, i) => <EmailShimmer key={i} />)
                    ) : (
                        emails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <h2 className="font-semibold">{email.subject || "(No Subject)"}</h2>
                                <p className="text-sm text-gray-500 mb-1">{email.from}</p>
                                <p className="text-gray-700 text-sm">{email.snippet}</p>

                                {email.category && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[email.category] ||
                                            categoryColors.General
                                            }`}
                                    >
                                        {email.category}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Right side — Email Detail */}
                {selectedEmail && (
                    <div className="w-1/2 bg-gray-50 p-6 rounded-lg shadow-inner">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg text-gray-800 font-semibold">{selectedEmail.subject}</h2>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[selectedEmail.category] ||
                                    categoryColors.General
                                    }`}
                            >
                                {selectedEmail.category}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-3">{selectedEmail.from}</p>
                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                            {selectedEmail.fullBody || selectedEmail.snippet}
                        </div>

                        <button
                            onClick={() => setSelectedEmail(null)}
                            className="mt-6 text-sm text-blue-600 hover:underline"
                        >
                            ← Back to list
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
