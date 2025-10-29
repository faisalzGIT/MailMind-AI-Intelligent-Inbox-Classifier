"use client";

import AIKeyInput from "@/components/AIKeyInput";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {!session ? (
        <>
          <button
            onClick={() => signIn("google")}
            className="border px-4 py-2 rounded-md hover:bg-amber-50 hover:text-black"
          >
            Login with Google
          </button>
        </>
      ) : (
        <>
          <img
            src={session.user.image}
            alt="user"
            className="w-12 h-12 rounded-full"
          />
          <h2>{session.user.name}</h2>
          <p>{session.user.email}</p>

          <button
            onClick={() => signOut()}
            className="border px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black"
          >
            Logout
          </button>
        <AIKeyInput />

        <Link href="/emails" className="border px-4 py-2 rounded-md hover:bg-gray-100 hover:text-black">
            Go to Emails
        </Link>
        </>
      )}
    </div>
  );
}
