// src/app/layout.tsx
import "./globals.css";
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import { AuthProvider } from '@/hooks/useAuth'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <MainHeader />
          <main className="min-h-screen">
            {children}
          </main>
          <MainFooter />
        </AuthProvider>
      </body>
    </html>
  )
}