import { create } from "zustand";

interface BalanceState {
  balance: string;
  setBalance: (balance: string) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: "0000", 
  setBalance: (balance) => set({ balance }), 
}));
