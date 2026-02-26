import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserData {
    id?: string;
    name?: string;
    email?: string;
    // Add other user fields as needed
}

interface UserState {
    user: UserData;
    token: string | null;
    _hasHydrated: boolean;
    setUser: (user: UserData) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: {},
            token: null,
            _hasHydrated: false,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            logout: () => {
                set({ user: {}, token: null });
            },
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
