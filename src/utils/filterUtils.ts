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
      const matchesName =
        store.ownerName.toLowerCase().includes(searchTerm) ||
        (store.storeName && store.storeName.toLowerCase().includes(searchTerm));
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
      if (store.avgDeliverySpeed != (filters.selectedDeliveryRate as any)) {
        return false;
      }
    }

    // Rating filter
    if (filters.selectedRating > 0) {
      const storeRating = store.avgRating || 0;
      if (storeRating < filters.selectedRating) {
        return false;
      }
    }

    // Area filter
    if (filters.selectedArea.trim()) {
      if (filters.selectedArea === "Any") {
        return true;
      }

      const storeAddress = store.address.addressLine?.toLowerCase();

      // Split the area string into words
      const areaWords = filters.selectedArea
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2); // ignore very short words

      // Check if any of those words appear in the address
      const matchFound = areaWords.some((word) => storeAddress?.includes(word));

      if (!matchFound) {
        return false;
      }
    }

    return true;
  });
};
