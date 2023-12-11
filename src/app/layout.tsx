import Navbar from '@/components/navbar'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import styles from './layout.module.css'
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'KNN Kesuburan Air',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <Navbar />
        <main className={styles.main}>
          {children}
        </main>
        
      </body>
    </html>
  )
}
