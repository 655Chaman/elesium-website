import { useState } from 'react';
import { WhatsAppModal } from '../components/ui/WhatsAppModal';

export const useWhatsApp = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openWhatsApp = () => setIsOpen(true);
    const closeWhatsApp = () => setIsOpen(false);

    const ModalComponent = () => (
        <WhatsAppModal isOpen={isOpen} onClose={closeWhatsApp} />
    );

    return {
        openWhatsApp,
        closeWhatsApp,
        WhatsAppModal: ModalComponent
    };
};
