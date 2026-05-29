import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JournalEntry, PaperTrade } from "./types";

interface SystemSlice {
  schedulerRunning: boolean;
  backendOnline: boolean;
  dbOnline: boolean;
  setSchedulerRunning: (v: boolean) => void;
  setBackendOnline: (v: boolean) => void;
  setDbOnline: (v: boolean) => void;

  openPositions: PaperTrade[];
  setOpenPositions: (trades: PaperTrade[]) => void;

  selectedTicker: string | null;
  setSelectedTicker: (ticker: string | null) => void;

  events: SystemEvent[];
  pushEvent: (event: Omit<SystemEvent, "id" | "ts">) => void;
}

export interface SystemEvent {
  id: string;
  ts: number;
  kind: "ALLOW" | "BLOCK" | "WARN" | "CLOSED" | "INFO";
  message: string;
}

export const useSystemStore = create<SystemSlice>((set) => ({
  schedulerRunning: false,
  backendOnline: false,
  dbOnline: false,
  setSchedulerRunning: (v) => set({ schedulerRunning: v }),
  setBackendOnline: (v) => set({ backendOnline: v }),
  setDbOnline: (v) => set({ dbOnline: v }),

  openPositions: [],
  setOpenPositions: (trades) => set({ openPositions: trades }),

  selectedTicker: null,
  setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),

  events: [],
  pushEvent: (event) =>
    set((state) => ({
      events: [
        { ...event, id: crypto.randomUUID(), ts: Date.now() },
        ...state.events,
      ].slice(0, 30),
    })),
}));

interface PersistSlice {
  briefingConfirmedDate: string | null;
  confirmBriefing: (dateET: string) => void;

  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  removeJournalEntry: (id: string) => void;
}

export const usePersistStore = create<PersistSlice>()(
  persist(
    (set) => ({
      briefingConfirmedDate: null,
      confirmBriefing: (dateET) => set({ briefingConfirmedDate: dateET }),

      journalEntries: [],
      addJournalEntry: (entry) =>
        set((state) => ({ journalEntries: [entry, ...state.journalEntries] })),
      removeJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        })),
    }),
    { name: "tradingmind-storage" }
  )
);
