import { Store } from "@/src/types/user";
import { FilterState } from "@/src/stores/filterStore";

export const filterStores = (
  stores: Store[],
  filters: FilterState
): Store[] => {
  return stores.filter((store) => {
    // Search query filter
    if (filters.searchQuery.trim()) {
      const searchTerm = filters.searchQuery.toLowerCase();
      const matchesName = store.name.toLowerCase().includes(searchTerm);
      const matchesType = store.type.toLowerCase().includes(searchTerm);
      if (!matchesName && !matchesType) {
        return false;
      }
    }

    // Business type filter
    if (filters.selectedBusinessTypes.length > 0) {
      if (!filters.selectedBusinessTypes.includes(store.type)) {
        return false;
      }
    }

    // Delivery rate filter
    if (filters.selectedDeliveryRate) {
      if (store.deliverySpeed !== filters.selectedDeliveryRate) {
        return false;
      }
    }

    // Rating filter
    if (filters.selectedRating > 0) {
      const storeRating = store.rating || 0;
      if (storeRating < filters.selectedRating) {
        return false;
      }
    }

    return true;
  });
};
