import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        // console.log("Full token:", token);

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const accessToken = token.access_token;

        const url = new URL(req.url);
        const maxResults =
            url.searchParams.get("maxResults") ||
            url.searchParams.get("count") ||
            10;


        // Fetch emails from Gmail API
        const res = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = await res.json();

        // Extract message IDs
        const messageIds = data.messages?.map((m) => m.id) || [];

        // Fetch details of each email
        const emails = await Promise.all(
            messageIds.map(async (id) => {
                const emailRes = await fetch(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const emailData = await emailRes.json();

                // Extract basic info (subject, sender, snippet)
                const headers = emailData.payload.headers;
                const subject = headers.find((h) => h.name === "Subject")?.value || "";
                const from = headers.find((h) => h.name === "From")?.value || "";
                const snippet = emailData.snippet || "";

                return { id, subject, from, snippet };
            })
        );

        return NextResponse.json({ emails });
    } catch (err) {
        console.error("Error fetching emails:", err);
        return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
    }
}
