import { create } from "zustand";

export interface FilterState {
  searchQuery: string;
  selectedBusinessTypes: string[];
  selectedDeliveryRate: string;
  selectedRating: number;
  selectedArea: string;
}

export interface FilterActions {
  setSearchQuery: (query: string) => void;
  setSelectedBusinessTypes: (types: string[]) => void;
  addBusinessType: (type: string) => void;
  removeBusinessType: (type: string) => void;
  setSelectedDeliveryRate: (rate: string) => void;
  setSelectedRating: (rating: number) => void;
  setSelectedArea: (area: string) => void;
  clearFilters: () => void;
}

export type FilterStore = FilterState & FilterActions;

const defaultState: FilterState = {
  searchQuery: "",
  selectedBusinessTypes: [],
  selectedDeliveryRate: "",
  selectedRating: 0,
  selectedArea: "",
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...defaultState,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedBusinessTypes: (types) => set({ selectedBusinessTypes: types }),

  addBusinessType: (type) => {
    const currentTypes = get().selectedBusinessTypes;
    if (!currentTypes.includes(type)) {
      set({ selectedBusinessTypes: [...currentTypes, type] });
    }
  },

  removeBusinessType: (type) => {
    const currentTypes = get().selectedBusinessTypes;
    set({ selectedBusinessTypes: currentTypes.filter((t) => t !== type) });
  },

  setSelectedDeliveryRate: (rate) => set({ selectedDeliveryRate: rate }),

  setSelectedRating: (rating) => set({ selectedRating: rating }),

  setSelectedArea: (area) => set({ selectedArea: area }),

  clearFilters: () => set(defaultState),
}));
