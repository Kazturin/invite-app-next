import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserData {
    id: string;
    name: string;
    email: string;
    created_at?: string;
    google_id?: string | null;
    roles?: any[];
}

interface UserState {
    user: UserData | null;
    token: string | null;
    _hasHydrated: boolean;
    setUser: (user: UserData | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            _hasHydrated: false,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            logout: () => {
                set({ user: null, token: null });
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
