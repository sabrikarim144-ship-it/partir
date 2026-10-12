import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Partir — L’esprit léger', description: 'Votre assistant personnel pour préparer chaque voyage, simplement.', icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg` } };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="fr"><body>{children}</body></html>; }
