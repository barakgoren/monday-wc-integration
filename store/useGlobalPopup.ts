import { create } from 'zustand';

interface GlobalPopupState {
    isOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
}

const useGlobalPopup = create<GlobalPopupState>((set) => ({
    isOpen: false,
    openPopup: () => set({ isOpen: true }),
    closePopup: () => set({ isOpen: false }),
}));

export default useGlobalPopup;