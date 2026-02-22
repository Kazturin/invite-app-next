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
    setUser: (user: UserData) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: {},
            token: null,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            logout: () => {
                set({ user: {}, token: null });
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('TOKEN');
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
