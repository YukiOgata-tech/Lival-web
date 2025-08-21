// src/app/layout.tsx
import "./globals.css";
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <MainHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <MainFooter />
      </body>
    </html>
  )
}