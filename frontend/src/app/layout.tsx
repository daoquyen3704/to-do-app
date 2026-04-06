import "./globals.css";
import Providers from "@/providers/providers";
import CustomToaster from "@/components/Toaster";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Providers>
          {children}
          <CustomToaster />
        </Providers>
      </body>
    </html>
  );
}
