import { createContext, useContext } from "react";

export type AdminPeriodFilter = "today" | "7d" | "30d";

export interface AdminFiltersContextValue {
  period: AdminPeriodFilter;
  setPeriod: (value: AdminPeriodFilter) => void;
  region: string;
  setRegion: (value: string) => void;
  league: string;
  setLeague: (value: string) => void;
}

const AdminFiltersContext = createContext<AdminFiltersContextValue | null>(null);

export const useAdminFilters = () => {
  const ctx = useContext(AdminFiltersContext);

  if (!ctx) {
    throw new Error("useAdminFilters must be used within AdminFiltersContext.Provider");
  }

  return ctx;
};

export default AdminFiltersContext;
