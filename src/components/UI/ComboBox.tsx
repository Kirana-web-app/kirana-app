"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";
import { forwardRef, useState } from "react";
import { IoChevronDownCircleOutline } from "react-icons/io5";

interface ComboboxDropDownProps {
  options: string[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
}

const ComboboxDropDown = forwardRef<HTMLInputElement, ComboboxDropDownProps>(
  (
    { options, value, onChange, label, placeholder, error, required, name, id },
    ref
  ) => {
    const [query, setQuery] = useState("");

    const filteredOptions =
      query === ""
        ? options
        : options.filter((option) => {
            return option.toLowerCase().includes(query.toLowerCase());
          });

    return (
      <div>
        <Combobox
          as="div"
          value={value}
          onChange={(option) => {
            setQuery("");
            onChange?.(option);
          }}
        >
          {label && (
            <Label className="block text-sm/6 font-medium text-gray-900">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}
          <div className="relative mt-2">
            <ComboboxInput
              ref={ref}
              name={name}
              id={id}
              placeholder={placeholder}
              className={`block w-full rounded-md bg-white py-3 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 ${
                error ? "outline-red-500" : "outline-gray-300"
              } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${
                error ? "focus:outline-red-500" : "focus:outline-primary"
              } sm:text-sm/6`}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => setQuery("")}
              displayValue={(option: string) => option || ""}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
              <IoChevronDownCircleOutline
                className="size-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>

            <ComboboxOptions
              transition
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
            >
              {query.length > 0 && filteredOptions.length === 0 && (
                <ComboboxOption
                  value={query}
                  className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-primary data-focus:text-white data-focus:outline-hidden"
                >
                  Create "{query}"
                </ComboboxOption>
              )}
              {filteredOptions.map((option) => (
                <ComboboxOption
                  key={option}
                  value={option}
                  className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-primary data-focus:text-white data-focus:outline-hidden"
                >
                  <span className="block truncate">{option}</span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </div>
        </Combobox>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

ComboboxDropDown.displayName = "ComboboxDropDown";

export default ComboboxDropDown;
