"use client";
import { FC, useState, useMemo } from "react";
import StoreCard from "./components/StoreCard";
import { store } from "@/src/data/mockStores";
import { Store } from "@/src/types/user";
import { useFilterStore } from "@/src/stores/filterStore";
import { filterStores } from "@/src/utils/filterUtils";
import { useTranslations } from "next-intl";

type TabType = "nearYou" | "saved";

const BazaarPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("nearYou");
  const [savedStores, setSavedStores] = useState<string[]>(["2"]); // Mock saved store IDs
  const t = useTranslations("Bazaar");

  // Get filter state from Zustand store
  const filters = useFilterStore();

  // Apply filters to stores
  const getFilteredStores = useMemo(() => {
    // First filter by tab (nearYou vs saved)
    const tabFilteredStores =
      activeTab === "nearYou"
        ? store
        : store.filter((storeItem) => savedStores.includes(storeItem.id));

    // Then apply search and filter criteria
    return filterStores(tabFilteredStores, filters);
  }, [activeTab, savedStores, filters]);

  const filteredStores = getFilteredStores;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleToggleSave = (storeId: string) => {
    setSavedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  return (
    <div className="">
      {/* Tab Navigation */}
      <div className="">
        <div className="border-gray-200 border-b">
          <div className="flex items-center max-w-4xl md:justify-start">
            <button
              onClick={() => handleTabChange("nearYou")}
              className={`w-full py-4 border-b-2 font-medium transition ${
                activeTab === "nearYou"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span data-translated>{t("nearYou")}</span>
            </button>
            <button
              onClick={() => handleTabChange("saved")}
              className={`w-full py-4 border-b-2 font-medium transition ${
                activeTab === "saved"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span data-translated>{t("saved")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStores.map((storeItem, index) => (
              <StoreCard
                key={storeItem.id}
                store={storeItem}
                isSaved={savedStores.includes(storeItem.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              {activeTab === "saved" ? (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <span data-translated>
                {(() => {
                  const hasFilters =
                    filters.searchQuery ||
                    filters.selectedBusinessTypes.length > 0 ||
                    filters.selectedDeliveryRate ||
                    filters.selectedRating > 0;
                  if (hasFilters) return t("noStoresMatch");
                  return activeTab === "saved"
                    ? t("noSavedStores")
                    : t("noStoresNearby");
                })()}
              </span>
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              <span data-translated>
                {(() => {
                  const hasFilters =
                    filters.searchQuery ||
                    filters.selectedBusinessTypes.length > 0 ||
                    filters.selectedDeliveryRate ||
                    filters.selectedRating > 0;
                  if (hasFilters) return t("adjustFilters");
                  return activeTab === "saved"
                    ? t("saveStoresMessage")
                    : t("expandSearch");
                })()}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default BazaarPage;
