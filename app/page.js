"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {!session ? (
        <>
          <button
            onClick={() => signIn("google")}
            className="border px-4 py-2 rounded-md"
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
            className="border px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
