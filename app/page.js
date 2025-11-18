/**
 * Home Page - Authentication & Dashboard
 * 
 * This is the landing page that displays:
 * - Authentication UI when user is not logged in (sign in with Google)
 * - User dashboard with profile info and Gemini API key input when logged in
 * 
 * Features:
 * - NextAuth Google OAuth integration
 * - Secure local API key storage
 * - Responsive design for mobile and desktop
 */

"use client";

import AIKeyInput from "@/components/AIKeyInput";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
    // Get the current user session from NextAuth
    // session.user contains: name, email, image (Google profile picture)
    // session.access_token and refresh_token are available for Gmail API calls
    const { data: session } = useSession();

    // Debug: Log session data to console during development
    //   {session && console.log("Session:", session.user);}

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-50 flex items-center justify-center  md:px-4">
            {/* Main card container - centered with max width for readability */}
            <div className="max-w-4xl md:pt-[5%] pt-4 w-full h-screen bg-white/5 backdrop-blur-md border border-white/10 md:p-10 p-3 shadow-2xl">
                {/* Header with branding */}
                <div className="flex flex-col items-center justify-center  gap-4 mb-8">
                    {/* AI logo badge - gradient with shadow */}
                    <div className="flex-none w-14 h-14 bg-gradient-to-br  text-slate-900 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg"><img src="/gemini-logo.png" alt="gemini-logo" /></div>
                    {/* App title and description */}
                    <div className="flex justify-center items-center flex-col">
                        <h1 className="md:text-5xl text-4xl font-bold">MailMind AI</h1>
                        <p className="text-slate-400 text-sm">Intelligent Inbox Classifier Powered by Gemini </p>
                    </div>
                </div>

                {/* Conditional rendering: Show different UI based on authentication state */}
                {!session ? (
                    // UNAUTHENTICATED VIEW: Two-column layout with welcome info and CTA
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left card: Welcome message and app description */}
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition">
                            <div className="flex items-start gap-3 mb-4">
                                {/* Info icon */}
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zm-2-5a.75.75 0 00-1.5 0v1.253a.75.75 0 001.5 0V3zm0 4.747a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H16zm-1.5 5a.75.75 0 001.5 0v-.003a.75.75 0 00-1.5 0v.003z" /></svg>
                                </div>
                                <h2 className="font-semibold text-lg">Welcome Back</h2>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">Sign in with your Google account to fetch and organize your emails. Your API key stays secure in your browser.</p>
                        </div>

                        {/* Right card: Call-to-action with sign in button */}
                        <div className="p-6 rounded-xl bg-gradient-to-b from-amber-500/20 to-transparent border border-amber-400/30 flex flex-col justify-between">
                            <div className="mb-4">
                                <h2 className="font-semibold text-lg text-amber-100 mb-1">Ready to Get Started?</h2>
                                <p className="text-sm text-amber-200/70">One click to connect and classify.</p>
                            </div>
                            <div className="space-y-3">
                                {/* Main CTA: Sign in with Google */}
                                <button
                                    onClick={() => signIn("google")}
                                    className="w-full bg-amber-400 text-slate-900 py-3 rounded-lg font-semibold hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15.5 1H4.5A3.5 3.5 0 001 4.5v11A3.5 3.5 0 004.5 19h11a3.5 3.5 0 003.5-3.5v-11A3.5 3.5 0 0015.5 1zm-4 15H9v-5h2.5v5zm-7-7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7-7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" /></svg>
                                    Sign in with Google
                                </button>
                                {/* Secondary CTA: Try demo without authentication */}
                                <Link href="/emails" className="w-full text-center text-slate-300 hover:text-slate-100 text-sm hover:underline transition">
                                    or try demo emails
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    // AUTHENTICATED VIEW: Two-section layout with profile and API key
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Profile Section (2/3 width) */}
                        <div className=" lg:col-span-2  p-8 md:pt-15 pt-10 h-79 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                            {/* Profile header with avatar and user info */}
                            <div className="flex items-center  gap-5 mb-8 pb-8 border-b border-white/10">
                                {/* Avatar: Display user's Google profile picture or initials fallback */}
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt={session.user.name} className="md:w-20 w-16 md:h-20 h-16 rounded-full ring-2 ring-amber-400/50 shadow-lg" />
                                ) : (
                                    // Fallback: Show user initials in a gradient circle if image not available
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 flex items-center justify-center font-bold text-lg ring-2 ring-amber-400/50 shadow-lg">
                                        {(session?.user?.name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("")}
                                    </div>
                                )}
                                {/* User details */}
                                <div>
                                    <h2 className="font-bold md:text-4xl text-xl">{session.user.name}</h2>
                                    <p className="text-slate-400 md:text-lg text-xs">{session.user.email}</p>
                                    <p className="text-slate-500 md:text-sm text-xs mt-1">✓ Connected</p>
                                </div>
                            </div>

                            {/* Action buttons: Navigate to emails or sign out */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Primary CTA: Go to email classification */}
                                <Link href="/emails" className="flex-1 text-center bg-amber-400 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.5 3A1.5 1.5 0 001 4.5v.006c0 .596.34 1.116.83 1.38H17.5A2.5 2.5 0 0120 5.5v-1A2.5 2.5 0 0017.5 2h-15A1.5 1.5 0 002.5 3zm15.5 4H.5v9.5A2.5 2.5 0 003 17h14a2.5 2.5 0 002.5-2.5V7z" /></svg>
                                    Go to Emails
                                </Link>
                                {/* Secondary action: Sign out and return to login */}
                                <button
                                    onClick={() => signOut()}
                                    className="px-6 py-3 rounded-lg border border-white/20 text-slate-200 hover:bg-white/5 font-medium transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* API Key Section (1/3 width) - sticky so it remains visible when scrolling */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur sticky top-8">
                            {/* Header with icon */}
                            <div className="flex items-center gap-2 mb-4">
                                {/* Key icon */}
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-300">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" /></svg>
                                </div>
                                <h3 className="font-bold text-lg">API Key</h3>
                            </div>
                            {/* Description and input component */}
                            <p className="text-slate-400 text-xs mb-5 leading-relaxed">Add your Gemini API key - it stays in your browser only</p>
                            {/* Component: Input field for Gemini API key (stored in localStorage) */}
                            <AIKeyInput />

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
