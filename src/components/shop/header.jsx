// src/components/common/Pagination.jsx
import { useState } from "react";
import React from "react";

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
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Product from "../product/Product";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setGridView, setListView } from "../../redux/ui/viewSlice";
import PriceRangeSlider from "./PriceRangeSlider";
import Pagination from "./Pagination";
import { useEffect } from "react";
import {
  setPriceRange,
  toggleFilter,
  toggleSection,
} from "../../redux/shopFilters/filtreSlice";
import {
  setCurrentPage,
  setProductsPerPage,
  setSortOption,
} from "../../redux/shopFilters/pageOptions";
import { useNavigate, useParams } from "react-router-dom";
import Filters from "./filters";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
const pageOptions = [
  { value: 12, current: true },
  { value: 24, current: false },
  { value: 36, current: false },
  { value: 48, current: false },
];

export default function Header({
  formattedCategory,
  totalProducts,
  setMobileFiltersOpen,
}) {
  const dispatch = useDispatch();

  const view = useSelector((state) => state.view.view);
  const filter = useSelector((state) => state.view.view);

  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions
  );
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.userInfo);

  return (
    <div className="block md:flex items-baseline justify-between border-b border-gray-200 md:pt-8 pt-8 pb-0 gap-4">
      {/* Title */}
      <h1 className="text-3xl mb-2 md:text-4xl font-bold tracking-tight text-gray-900 w-full md:w-1/4">
        {formattedCategory || "Shop"}{" "}
        <span className="hidden md:inline text-xs md:text-base font-medium tracking-tight text-gray-600">
          products ({totalProducts})
        </span>
      </h1>

      {/* Settings */}
      <div className="flex flex-wrap w-full md:w-3/4 justify-between items-center gap-4">
        {/* Left: View/filter buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(setGridView())}
            className={`px-2 py-2 border border-gray-300 rounded shadow-sm cursor-pointer transition 
       ${
         view === "grid"
           ? "bg-[#2c2d84] shadow-md text-white"
           : "bg-white hover:bg-gray-100"
       }`}
          >
            <span className="sr-only">View grid</span>
            <Squares2X2Icon aria-hidden="true" className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setListView())}
            className={`px-2 py-2 border border-gray-300 rounded shadow-sm cursor-pointer transition 
       ${
         view === "list"
           ? "bg-[#2c2d84] shadow-md text-white"
           : "bg-white hover:bg-gray-100"
       }`}
          >
            <span className="sr-only">View list</span>
            <ListBulletIcon aria-hidden="true" className="size-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="size-5" aria-hidden="true" />
            <span className="inline md:hidden text-xs font-medium tracking-tight text-gray-600">
              products ({totalProducts})
            </span>
          </div>
        </button>
        {/* Right: Sort and Affichage */}
        <div className="flex items-center gap-4">
          {/* Sort Menu */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDownIcon
                aria-hidden="true"
                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <MenuItem key={option.name}>
                          <button
                            type="button"
                            onClick={() => dispatch(setSortOption(option.name))}
                            className={classNames(
                              sortOption === option.name
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            )}
                          >
                            {option.name}
                          </button>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                ))}
              </div>
            </MenuItems>
          </Menu>

          {/* Affichage Menu */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Affichage
              <ChevronDownIcon
                aria-hidden="true"
                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                {pageOptions.map((option) => (
                  <MenuItem key={option.value}>
                    <button
                      type="button"
                      onClick={() => dispatch(setProductsPerPage(option.value))}
                      className={classNames(
                        productsPerPage === option.value
                          ? "font-medium text-gray-900"
                          : "text-gray-500",
                        "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      )}
                    >
                      {option.value}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}
