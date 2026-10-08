import { useState } from 'react';
import { CalendlyModal } from '../components/ui/CalendlyModal';

export const useCalendly = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openCalendly = () => setIsOpen(true);
    const closeCalendly = () => setIsOpen(false);

    const ModalComponent = () => (
        <CalendlyModal isOpen={isOpen} onClose={closeCalendly} />
    );

    return {
        openCalendly,
        CalendlyModal: ModalComponent
    };
};
