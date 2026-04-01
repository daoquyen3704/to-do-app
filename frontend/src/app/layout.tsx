import "./globals.css";
import Providers from "@/providers/providers";
import { Toaster } from 'sonner';

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
          <Toaster
            position="top-center"
            expand={true}
            duration={2000}
            visibleToasts={5}
            theme="light" 
            offset="20px"
            toastOptions={{
                style: {
                  background: '#000', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px 0 rgba(79, 57, 246, 0.2)', 
                  color: '#ffffff', 
                },
                
                classNames: {
                  toast: 'group',
                  title: 'text-white font-medium',
                  description: 'text-blue-100 text-xs', 
                  icon: 'text-white', 
                  actionButton: 'bg-white text-[#4f39f6] font-bold', 
                },
              }}
            />
        </Providers>
      </body>
    </html>
  );
}
