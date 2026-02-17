import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Interfaz Didáctica | Formación Integral para Empresas',
  description:
    'Especialistas en Ofimática, Atención al Cliente y Desarrollo Gerencial. Soluciones a medida para empresas con más de 17 años de trayectoria en Caracas.',
  metadataBase: new URL('https://www.interfazdidactica.com/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased bg-white text-foreground font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
