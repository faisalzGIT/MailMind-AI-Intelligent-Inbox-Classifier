"use client";

import { useMemo, useState } from "react";
import EmailShimmer from "@/components/ShimmerCard";

export default function EmailsPage() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [classifying, setClassifying] = useState(false);
    const [error, setError] = useState("");
    const [emailCount, setEmailCount] = useState(15);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const badgeClasses = {
        Important: "bg-green-50 text-green-800 border-green-100",
        Marketing: "bg-orange-50 text-orange-800 border-orange-100",
        Spam: "bg-red-50 text-red-800 border-red-100",
        General: "bg-gray-50 text-gray-800 border-gray-100",
    };

    // Fetch emails
    const fetchEmails = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/fetchEmails?count=${emailCount}`);
            const data = await res.json();
            setEmails(data?.emails || []);
            setSelectedEmail(null);
        } catch (err) {
            console.error("Error fetching emails:", err);
            setError("Failed to fetch emails.");
        } finally {
            setLoading(false);
        }
    };

    // Classify emails
    const classifyEmails = async () => {
        setClassifying(true);
        try {
            const apiKey = localStorage.getItem("gemini_ai_api_key");
            if (!apiKey) {
                alert("Please enter your Gemini API key first!");
                setClassifying(false);
                return;
            }

            const res = await fetch("/api/classifyEmails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emails, apiKey }),
            });

            const data = await res.json();
            console.log("Classify response:", data);
            setEmails(data?.classifiedEmails || data || []);
        } catch (err) {
            console.error("Error classifying emails:", err);
            setError("Failed to classify emails.");
        } finally {
            setClassifying(false);
        }
    };

    const filteredEmails = useMemo(() => {
        if (!searchTerm) return emails;
        const q = searchTerm.toLowerCase();
        return emails.filter(e => (e.subject || "").toLowerCase().includes(q) || (e.from || "").toLowerCase().includes(q));
    }, [emails, searchTerm]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Fetched Emails</h1>
                    <p className="text-sm text-gray-500">Fetch, review, and classify emails with AI.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search subject or sender..."
                        className="flex-1 md:flex-none min-w-0 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />

                    <label htmlFor="emailCount" className="text-sm font-medium text-gray-700 hidden md:inline">
                        Show:
                    </label>
                    <select
                        id="emailCount"
                        value={emailCount}
                        onChange={(e) => setEmailCount(Number(e.target.value))}
                        className="border rounded-md px-2 py-1 text-sm"
                    >
                        {[10, 15, 20, 25, 30].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={fetchEmails}
                    className="bg-amber-400 text-slate-900 px-4 py-2 rounded-md shadow-sm hover:brightness-95 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Fetching..." : "Fetch Emails"}
                </button>

                <button
                    onClick={classifyEmails}
                    className="border px-4 py-2 rounded-md hover:bg-gray-100 disabled:opacity-60"
                    disabled={classifying}
                >
                    {classifying ? "Classifying..." : "Classify Emails"}
                </button>
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Split Layout */}
            <div className="flex gap-6">
                {/* Left side — Email List */}
                <div className={`${selectedEmail ? "w-1/2" : "w-full"} space-y-4`}>
                    {loading ? (
                        Array.from({ length: emailCount }).map((_, i) => <EmailShimmer key={i} />)
                    ) : (
                        <div className="space-y-3">
                            {filteredEmails.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500 border rounded-md">
                                    No emails yet. Click "Fetch Emails" to load messages.
                                </div>
                            ) : (
                                filteredEmails.map((email) => (
                                    <div
                                        key={email.id}
                                        onClick={() => setSelectedEmail(email)}
                                        className={`border p-4 rounded-lg shadow-sm transition cursor-pointer hover:shadow-md ${selectedEmail?.id === email.id ? 'ring-2 ring-amber-300' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="min-w-0">
                                                <h2 className="font-semibold truncate">{email.subject || "(No Subject)"}</h2>
                                                <p className="text-sm text-gray-500 truncate">{email.from}</p>
                                            </div>

                                            {email.category && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badgeClasses[email.category] || badgeClasses.General}`}>
                                                    {email.category}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{email.snippet}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Right side — Email Detail */}
                {selectedEmail && (
                    <div className="w-1/2 bg-white p-6 rounded-lg shadow-inner border">
                        <div className="flex justify-between items-center mb-3 gap-3">
                            <div className="min-w-0">
                                <h2 className="text-lg text-gray-900 font-semibold truncate">{selectedEmail.subject}</h2>
                                <p className="text-sm text-gray-500">{selectedEmail.from}</p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badgeClasses[selectedEmail.category] || badgeClasses.General}`}>
                                {selectedEmail.category}
                            </span>
                        </div>

                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                            {selectedEmail.fullBody || selectedEmail.snippet}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setSelectedEmail(null)} className="text-sm text-blue-600 hover:underline">← Back to list</button>
                            <button className="ml-auto bg-amber-400 text-slate-900 px-3 py-1 rounded-md text-sm">Mark as Important</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
