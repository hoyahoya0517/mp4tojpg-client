import "./globals.css";

export const metadata = {
  title: "mp4tojpg",
  description: "mp4tojpg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
