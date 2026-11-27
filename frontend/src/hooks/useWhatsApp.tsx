import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { WhatsAppModal as BaseWhatsAppModal } from '../components/ui/WhatsAppModal';

export const useWhatsApp = () => {
    const isOpenRef = useRef(false);
    const listenersRef = useRef(new Set<() => void>());

    const notify = useCallback(() => {
        listenersRef.current.forEach((listener) => listener());
    }, []);

    const openWhatsApp = useCallback(() => {
        if (!isOpenRef.current) {
            isOpenRef.current = true;
            notify();
        }
    }, [notify]);

    const closeWhatsApp = useCallback(() => {
        if (isOpenRef.current) {
            isOpenRef.current = false;
            notify();
        }
    }, [notify]);

    const subscribe = useCallback((listener: () => void) => {
        listenersRef.current.add(listener);
        return () => {
            listenersRef.current.delete(listener);
        };
    }, []);

    const getSnapshot = useCallback(() => isOpenRef.current, []);

    const ModalComponent = useMemo(() => {
        const StableWhatsAppModal = () => {
            const isOpen = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
            return <BaseWhatsAppModal isOpen={isOpen} onClose={closeWhatsApp} />;
        };
        return StableWhatsAppModal;
    }, [subscribe, getSnapshot, closeWhatsApp]);

    return {
        openWhatsApp,
        closeWhatsApp,
        WhatsAppModal: ModalComponent
    };
};
