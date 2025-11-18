import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { emails, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "Missing Gemini API key" }, { status: 400 });
        }

        const classifiedEmails = await Promise.all(
            emails.map(async (email) => {
                const prompt = `
Classify this email into one of these: Important, Promotions, Social, Marketing, Spam, General.

Examples:
- "Meeting tomorrow at 9AM" → Important
- "50% OFF on shoes" → Promotions
- "You have a new Instagram follower" → Social
- "Our monthly product newsletter" → Marketing
- "Claim your free gift" → Spam

Email:
Subject: ${email.subject}
From: ${email.from}
Snippet: ${email.snippet}

Answer with only one word from the list.
`;


                try {
                    const res = await fetch(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-goog-api-key": apiKey,
                            },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }],
                                generationConfig: {
                                    temperature: 0.3,
                                    maxOutputTokens: 20,
                                },
                            }),
                        }
                    );

                    const data = await res.json();
                    // console.log("Gemini raw:", JSON.stringify(data, null, 2));

                    let category = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "General";
                    category = category.split("\n")[0].trim();
                    category = category.replace(/[^a-zA-Z]/g, "");
                    category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

                    if (
                        !["Important", "Promotions", "Social", "Marketing", "Spam", "General"].includes(category)
                    ) {
                        category = "General";
                    }

                    return { ...email, category };
                } catch (err) {
                    console.error("Error classifying email:", err);
                    return { ...email, category: "Unclassified" };
                }
            })
        );

        return NextResponse.json({ classifiedEmails });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error during classification" }, { status: 500 });
    }
}
