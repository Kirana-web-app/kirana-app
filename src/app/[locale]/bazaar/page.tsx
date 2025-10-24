"use client";
import { FC, useState, useMemo, use, useEffect } from "react";
import StoreCard from "./components/StoreCard";
import { Store, Customer } from "@/src/types/user";
import { useFilterStore } from "@/src/stores/filterStore";
import { filterStores } from "@/src/utils/filterUtils";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStores,
  saveStore,
  unsaveStore,
  getSavedStores,
} from "@/src/utils/users";
import LoadingSpinner from "@/src/components/UI/LoadingSpinner";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/src/stores/authStore";
import { GoBookmark } from "react-icons/go";
import { ROUTES } from "@/src/constants/routes/routes";

type TabType = "nearYou" | "saved";

const BazaarPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("nearYou");
  const [savedStores, setSavedStores] = useState<string[]>([]); // Optimistic saved store IDs
  const t = useTranslations("Bazaar");
  const { userData, authLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();

  // useEffect(() => {
  //   if (authLoading) return;

  //   if (!userData) {
  //     router.push(ROUTES.AUTH.LOGIN);
  //   }
  // }, [userData, router]);

  // Get filter state from Zustand store
  const filters = useFilterStore();

  const { data: store, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch saved stores for customers when on saved tab
  const { data: savedStoresList, isLoading: savedStoresLoading } = useQuery({
    queryKey: ["savedStores", userData?.id],
    queryFn: () => {
      if (!userData?.id || userData.role !== "customer") return null;
      return getSavedStores(userData.id);
    },
    enabled:
      !!userData?.id && userData.role === "customer" && activeTab === "saved",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize saved stores from user data
  useEffect(() => {
    if (userData?.role === "customer") {
      const customerData = userData as Customer;
      if (customerData.savedStores) {
        setSavedStores(customerData.savedStores);
      }
    }
  }, [userData]);

  // Mutations for save/unsave stores
  const saveStoreMutation = useMutation({
    mutationFn: (storeId: string) => {
      if (!userData?.id) throw new Error("User not authenticated");
      return saveStore(userData.id, storeId);
    },
    onMutate: async (storeId) => {
      // Optimistic update
      setSavedStores((prev) =>
        prev.includes(storeId) ? prev : [...prev, storeId]
      );
    },
    onSuccess: (_, storeId) => {
      // Update authStore
      if (userData?.role === "customer") {
        const customerData = userData as Customer;
        const updatedSavedStores = customerData.savedStores?.includes(storeId)
          ? customerData.savedStores
          : [...(customerData.savedStores || []), storeId];

        const updatedUserData = {
          ...customerData,
          savedStores: updatedSavedStores,
        };
        useAuthStore.getState().setUserData(updatedUserData);

        // Invalidate saved stores query to refetch updated data
        queryClient.invalidateQueries({
          queryKey: ["savedStores", userData.id],
        });
      }
    },
    onError: (error, storeId) => {
      // Rollback optimistic update
      setSavedStores((prev) => prev.filter((id) => id !== storeId));
      console.error("Error saving store:", error);
      alert("Failed to save store. Please try again.");
    },
  });

  const unsaveStoreMutation = useMutation({
    mutationFn: (storeId: string) => {
      if (!userData?.id) throw new Error("User not authenticated");
      return unsaveStore(userData.id, storeId);
    },
    onMutate: async (storeId) => {
      // Optimistic update
      setSavedStores((prev) => prev.filter((id) => id !== storeId));
    },
    onSuccess: (_, storeId) => {
      // Update authStore
      if (userData?.role === "customer") {
        const customerData = userData as Customer;
        const updatedSavedStores = (customerData.savedStores || []).filter(
          (id) => id !== storeId
        );

        const updatedUserData = {
          ...customerData,
          savedStores: updatedSavedStores,
        };
        useAuthStore.getState().setUserData(updatedUserData);

        // Invalidate saved stores query to refetch updated data
        queryClient.invalidateQueries({
          queryKey: ["savedStores", userData.id],
        });
      }
    },
    onError: (error, storeId) => {
      // Rollback optimistic update
      setSavedStores((prev) =>
        prev.includes(storeId) ? prev : [...prev, storeId]
      );
      console.error("Error unsaving store:", error);
      alert("Failed to unsave store. Please try again.");
    },
  });

  useEffect(() => {
    if (tab === "saved" || tab === "near") {
      setActiveTab(tab === "saved" ? "saved" : "nearYou");
    }
  }, [tab]);

  // Apply filters to stores
  const getFilteredStores = useMemo(() => {
    // First filter by tab (nearYou vs saved)
    const tabFilteredStores = activeTab === "nearYou" ? store : savedStoresList; // Use fetched saved stores list instead of filtering

    // Then apply search and filter criteria
    if (tabFilteredStores) return filterStores(tabFilteredStores, filters);
  }, [store, savedStoresList, activeTab, filters]);

  const filteredStores = getFilteredStores;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    //update query param
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab === "saved" ? "saved" : "near");
    window.history.replaceState({}, "", url.toString());
  };

  const handleToggleSave = (storeId: string) => {
    // Check if user is authenticated and is a customer
    if (!userData || userData.role !== "customer") {
      alert("Please log in as a customer to save stores.");
      return;
    }

    if (savedStores.includes(storeId)) {
      unsaveStoreMutation.mutate(storeId);
    } else {
      saveStoreMutation.mutate(storeId);
    }
  };

  if (isLoading || (activeTab === "saved" && savedStoresLoading))
    return <LoadingSpinner />;

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
        {/* Show login prompt for saved tab if user is not a customer */}
        {activeTab === "saved" &&
        (!userData || userData.role !== "customer") ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <GoBookmark className="size-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <span data-translated>{t("noSavedStores")}</span>
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              <span data-translated>{t("saveStoresMessage")}</span>
            </p>
          </div>
        ) : filteredStores && filteredStores.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStores.map((storeItem, index) => (
              <StoreCard
                key={storeItem.id}
                store={storeItem}
                isSaved={savedStores.includes(storeItem.id)}
                onToggleSave={handleToggleSave}
                isToggling={
                  (saveStoreMutation.isPending &&
                    saveStoreMutation.variables === storeItem.id) ||
                  (unsaveStoreMutation.isPending &&
                    unsaveStoreMutation.variables === storeItem.id)
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              {activeTab === "saved" ? (
                <GoBookmark className="size-8" />
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
