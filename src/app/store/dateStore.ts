import { create } from "zustand";

type DateState = {
  startDate: Date;
  endDate: Date;
  setStartDate: (newDate: Date) => void;
  setEndDate: (newDate: Date) => void;
};

export const useDateStore = create<DateState>((set) => ({
  startDate: new Date(),
  endDate: new Date(),
  setStartDate: (newDate: Date) => set({ startDate: newDate }),
  setEndDate: (newDate: Date) => set({ endDate: newDate }),
}));
