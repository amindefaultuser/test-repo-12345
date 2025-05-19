import { create } from "zustand";


  
  interface UserStore {
    user: any | null;
    setUser: (user: any | null) => void;
    loader: boolean;
    setLoader: (loader: boolean) => void;
  }
  
  const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    loader: false,
    setLoader: (loader) => set({ loader })
  }));
  
  export default useUserStore;
