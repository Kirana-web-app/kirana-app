"use client";

import { FC, ReactNode, useState } from "react";
import { useFilterStore } from "@/src/stores/filterStore";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { classNames } from "@/src/utils";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import SearchBar from "@/src/components/UI/SearchBar";
import ComboboxDropDown from "@/src/components/UI/ComboBox";
import Tag from "@/src/components/UI/Tag";
import { RadioButton } from "@/src/components/UI/RadioButton";
import {
  businessTypesEnglish,
  businessTypesUrdu,
} from "@/src/data/businessTypes";
import { useTranslations } from "next-intl";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

const deliveryRate = [
  { id: 1, name: "Quick (5 - 15 mins)", value: "Quick" },
  { id: 2, name: "Fast (15 - 30 mins)", value: "Fast" },
  { id: 3, name: "Average (30 - 60 mins)", value: "Average" },
  { id: 4, name: "Slow (1 - 6 hours)", value: "Slow" },
  { id: 5, name: "Slowest (1 - 3 days)", value: "Slowest" },
];

const FiltersLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Zustand store
  const {
    searchQuery,
    selectedBusinessTypes,
    selectedDeliveryRate,
    selectedRating,
    setSearchQuery,
    addBusinessType,
    removeBusinessType,
    setSelectedDeliveryRate,
    setSelectedRating,
    clearFilters,
  } = useFilterStore();

  //   const t = useTranslations("Filters");
  const l = useTranslations("locale");

  const handleRatingClick = (rating: number) => {
    const newRating = rating === selectedRating ? 0 : rating;
    setSelectedRating(newRating);
  };

  const handleRatingInputChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setSelectedRating(numValue);
    } else if (value === "") {
      setSelectedRating(0);
    }
  };

  const handleBusinessTypeChange = (value: string | null) => {
    if (!value) return;

    if (selectedBusinessTypes.includes(value)) {
      // If already selected, remove it
      removeBusinessType(value);
    } else {
      // If not selected, add it
      addBusinessType(value);
    }
  };

  return (
    <div className="">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative flex size-full w-full transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Clear Filters
                </button>
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {/* Business Type Filter */}
                <div className="px-4 py-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Business Type
                  </h3>
                  <ComboboxDropDown
                    options={
                      l("locale") === "ur"
                        ? businessTypesUrdu
                        : businessTypesEnglish
                    }
                    value={""}
                    onChange={handleBusinessTypeChange}
                    placeholder="Select business types"
                    name="businessType"
                    id="mobile-businessType"
                  />

                  {/* Selected Business Types Tags */}
                  {selectedBusinessTypes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedBusinessTypes.map((type) => {
                        return (
                          <Tag
                            key={type}
                            label={type}
                            onRemove={() => removeBusinessType(type)}
                            variant="primary"
                            size="md"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* Delivery Rate Filter */}
                <div className="px-4 py-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Delivery Time
                  </h3>
                  <div className="space-y-3">
                    {deliveryRate.map((rate) => (
                      <RadioButton
                        key={rate.id}
                        id={`mobile-delivery-${rate.id}`}
                        name="mobile-delivery-rate"
                        value={rate.value}
                        checked={selectedDeliveryRate === rate.value}
                        onChange={setSelectedDeliveryRate}
                        label={rate.name}
                        className=""
                      />
                    ))}
                  </div>
                </div>
                {/* Rating Filter */}
                <div className="px-4 py-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Rating
                  </h3>

                  {/* Star Rating Display */}
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className=" hover:scale-110 transition-transform"
                      >
                        <svg
                          className={`size-12 ${
                            star <= selectedRating
                              ? "text-primary fill-current"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Rating Number Input */}
                  <div className="mx-auto w-fit ">
                    <input
                      id="mobile-rating-input"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={selectedRating || ""}
                      onChange={(e) => handleRatingInputChange(e.target.value)}
                      placeholder="0.0"
                      className="p-2 pl-20 font-medium rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-xl"
                    />
                  </div>
                </div>
                <h3 className="sr-only">Additional Filters</h3>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-gray-200 lg:pt-12 pt-8 pb-6 gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
              className="flex-1 max-w-lg"
            />
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className=" text-gray-400 hover:text-gray-500  lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <HiOutlineAdjustmentsVertical className="size-7 text-gray-600 ml-2" />
              </button>
            </div>
          </div>

          <section aria-labelledby="stores-heading" className="lg:pt-6 pb-24">
            <h2 id="stores-heading" className="sr-only">
              Stores
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
                {/* Business Type Filter */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Business Type
                  </h3>
                  <ComboboxDropDown
                    options={
                      l("locale") === "ur"
                        ? businessTypesUrdu
                        : businessTypesEnglish
                    }
                    value={""}
                    onChange={handleBusinessTypeChange}
                    placeholder="Select business types"
                    name="businessType"
                    id="desktop-businessType"
                  />

                  {/* Selected Business Types Tags */}
                  {selectedBusinessTypes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedBusinessTypes.map((type) => {
                        return (
                          <Tag
                            key={type}
                            label={type}
                            onRemove={() => removeBusinessType(type)}
                            variant="primary"
                            size="md"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Delivery Rate Filter */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Delivery Time
                  </h3>
                  <div className="space-y-3">
                    {deliveryRate.map((rate) => (
                      <RadioButton
                        key={rate.id}
                        id={`desktop-delivery-${rate.id}`}
                        name="desktop-delivery-rate"
                        value={rate.value}
                        checked={selectedDeliveryRate === rate.value}
                        onChange={setSelectedDeliveryRate}
                        label={rate.name}
                        className=""
                      />
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Rating
                  </h3>

                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className=" hover:scale-110 transition-transform"
                      >
                        <svg
                          className={`size-8 ${
                            star <= selectedRating
                              ? "text-primary fill-current"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Rating Number Input */}
                  <div className="">
                    <input
                      id="desktop-rating-input"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={selectedRating || ""}
                      onChange={(e) => handleRatingInputChange(e.target.value)}
                      placeholder="0.0"
                      className="p-2 font-medium rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <h3 className="sr-only">Additional Filters</h3>
              </form>

              <div className="lg:col-span-3">{children}</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default FiltersLayout;
