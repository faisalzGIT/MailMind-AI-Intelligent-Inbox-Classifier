import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "MailMind AI — Intelligent Inbox Classifier",
  description: "AI based Email classification app by Faisal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
