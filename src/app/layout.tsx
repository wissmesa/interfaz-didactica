import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';

const geistSans = Geist({
variable: '--font-geist-sans',
subsets: ['latin']
});

const geistMono = Geist_Mono({
variable: '--font-geist-mono',
subsets: ['latin']
});

export const metadata: Metadata = {
title: 'Interfaz Didáctica',
description: 'Especialistas en la Gestión y Capacitación del Talento Humano',
metadataBase: new URL('https://www.interfazdidactica.com/')
};

export default function RootLayout({
children
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="es">
<body
className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
>
<Header />
<main>{children}</main>
</body>
</html>
);
}
