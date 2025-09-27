'use client';

import { Header } from '@/components/Header';
import { ContactModal } from '@/components/ContactModal';
import { useState, createContext, useContext } from 'react';

interface ContactContextType {
openContactModal: () => void;
}

const ContactContext = createContext<ContactContextType | null>(null);

export const useContact = () => {
const context = useContext(ContactContext);
if (!context) {
throw new Error('useContact must be used within a ContactProvider');
}
return context;
};

interface ClientLayoutProps {
children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
const [isContactModalOpen, setIsContactModalOpen] = useState(false);

const openContactModal = () => setIsContactModalOpen(true);
const closeContactModal = () => setIsContactModalOpen(false);

return (
<ContactContext.Provider value={{ openContactModal }}>
<Header onContactClick={openContactModal} />
<main>{children}</main>
<ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
</ContactContext.Provider>
);
}
