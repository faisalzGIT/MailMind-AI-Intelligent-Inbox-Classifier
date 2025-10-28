import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "MagicSlides Assignment",
  description: "Email classification app by Faisal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
