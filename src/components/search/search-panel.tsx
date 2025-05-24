"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, ChevronDown, X, Star, Loader2 } from "lucide-react";
import { useSearchData, type SearchItem } from "@/hooks/use-search-data";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface SearchPanelProps {
  isMobile?: boolean;
}

export const SearchPanel = ({ isMobile = false }: SearchPanelProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);
  const [activeLocationFilter, setActiveLocationFilter] = useState<
    string | null
  >(null);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    searchData,
    addRecentSearch,
    searchItems,
    isLoading,
    error,
    suggestions,
  } = useSearchData();
  const router = useRouter();

  // Debounced search function with better error handling
  const debouncedSearch = useCallback(
    async (query: string, typeFilter?: string, locationFilter?: string) => {
      // Don't search if query is too short and no filters
      if (!query.trim() && !typeFilter && !locationFilter) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        console.log("Starting search with:", {
          query,
          typeFilter,
          locationFilter,
        });
        const results = await searchItems(query, typeFilter, locationFilter);
        console.log("Search results:", results);
        setSearchResults(results);
      } catch (err) {
        console.error("Search error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Search failed. Please try again.";
        setSearchError(errorMessage);

        // Show different error messages for mobile vs desktop
        if (isMobile) {
          toast.error("Search failed. Check your connection and try again.");
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [searchItems, isMobile]
  );

  // Effect to handle search and filtering with debouncing
  useEffect(() => {
    if (!isSearchFocused) return;

    const timeoutId = setTimeout(() => {
      debouncedSearch(
        searchValue,
        activeTypeFilter || undefined,
        activeLocationFilter || undefined
      );
    }, 500); // Increased debounce time for mobile

    return () => clearTimeout(timeoutId);
  }, [
    searchValue,
    activeTypeFilter,
    activeLocationFilter,
    isSearchFocused,
    debouncedSearch,
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
        setActiveFilter(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      addRecentSearch(searchValue);
      // Don't show success toast on mobile to avoid clutter
      if (!isMobile) {
        toast.success(`Searching for "${searchValue}"`);
      }
    }
  };

  const handleTypeFilterSelect = (typeName: string) => {
    const newTypeFilter = activeTypeFilter === typeName ? null : typeName;
    setActiveTypeFilter(newTypeFilter);
    setActiveFilter(null);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleLocationFilterSelect = (locationName: string) => {
    const newLocationFilter =
      activeLocationFilter === locationName ? null : locationName;
    setActiveLocationFilter(newLocationFilter);
    setActiveFilter(null);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const clearFilters = () => {
    setActiveTypeFilter(null);
    setActiveLocationFilter(null);
    setSearchError(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchFocused(false);
      setActiveFilter(null);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // Retry search function
  const retrySearch = () => {
    setSearchError(null);
    debouncedSearch(
      searchValue,
      activeTypeFilter || undefined,
      activeLocationFilter || undefined
    );
  };

  // Function to render search results
  const renderSearchResults = () => {
    if (isSearching || isLoading) {
      return (
        <div className="p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Searching...</p>
        </div>
      );
    }

    if (searchError || error) {
      const displayError = searchError || error || "An unknown error occurred";
      return (
        <div className="p-4 text-center text-red-500">
          <p className="text-sm mb-2">
            {displayError.includes("Failed to fetch") ||
            displayError.includes("NetworkError")
              ? "Connection error. Please check your internet and try again."
              : displayError}
          </p>
          <button
            onClick={retrySearch}
            className="text-xs text-blue-500 hover:underline bg-blue-50 px-3 py-1 rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p className="mb-2">
            No results found. Try a different search term or filter.
          </p>
          {suggestions && suggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Did you mean:</p>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchValue(suggestion);
                      addRecentSearch(suggestion);
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="max-h-[350px] overflow-y-auto">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors group active:bg-gray-200"
            onClick={() => {
              try {
                // Navigate to store page
                router.push(`/store/${result.id}`);
                // Add to recent searches
                addRecentSearch(result.name);
                // Close search panel
                setIsSearchFocused(false);
                setSearchValue("");
              } catch (err) {
                console.error("Navigation error:", err);
                toast.error("Failed to navigate. Please try again.");
              }
            }}
          >
            <div className="flex-shrink-0 mr-3">
              {result.image ? (
                <Image
                  src={result.image || "/placeholder.svg"}
                  alt={result.name}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">
                    {result.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#1A2E20]">
                {result.name}
              </p>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  {result.location}
                </span>
                <span className="text-xs text-gray-500 mr-2">•</span>
                <span className="text-xs text-gray-500">
                  {result.deliveryTimeRange}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{result.type}</p>
            </div>
            <div className="flex flex-col items-end">
              {result.rating && result.rating > 0 && (
                <div className="flex items-center mb-1">
                  <Star
                    className="h-3 w-3 text-yellow-500 fill-yellow-500"
                    strokeWidth={1}
                  />
                  <span className="text-xs ml-1">{result.rating}</span>
                </div>
              )}
              <span className="text-xs text-gray-400">{result.priceRange}</span>
              <div className="flex items-center text-xs text-[#1A2E20] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                <span>View Store</span>
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={searchRef}
      className={`relative ${isMobile ? "w-full mt-3" : "flex-1 mx-4"} ${
        isSearchFocused ? "z-20" : ""
      }`}
    >
      <form onSubmit={handleSearch} className="w-full">
        <div
          className={`flex items-center bg-gray-100 rounded-full px-3 py-2 w-full transition-all duration-300 ${
            isSearchFocused ? "rounded-b-none shadow-md" : ""
          }`}
        >
          <Search className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={
              isMobile
                ? "Search..."
                : "Search restaurants, drinks, groceries..."
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none flex-1 text-base md:text-sm min-w-0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Active filters display */}
          {(activeTypeFilter || activeLocationFilter) && (
            <div className="flex items-center space-x-1 ml-2">
              {activeTypeFilter && (
                <div className="bg-[#1A2E20] text-white text-xs py-1 px-2 rounded-full flex items-center">
                  {activeTypeFilter}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTypeFilter(null);
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {activeLocationFilter && (
                <div className="bg-[#1A2E20] text-white text-xs py-1 px-2 rounded-full flex items-center">
                  {activeLocationFilter}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLocationFilter(null);
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {!isMobile && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-gray-500 text-xs ml-1"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </form>

      {isSearchFocused && (
        <div className="absolute left-0 right-0 top-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-30">
          <div className="p-2">
            <div className="flex space-x-2 mb-3 border-b pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilter(activeFilter === "type" ? null : "type");
                }}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center whitespace-nowrap ${
                  activeFilter === "type"
                    ? "bg-[#1A2E20] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Type <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilter(
                    activeFilter === "location" ? null : "location"
                  );
                }}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center whitespace-nowrap ${
                  activeFilter === "location"
                    ? "bg-[#1A2E20] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Location <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>

            {activeFilter === "type" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                {searchData.types.map((option) => (
                  <div
                    key={option.id}
                    className={`py-2 px-3 hover:bg-gray-100 rounded cursor-pointer text-sm active:bg-gray-200 ${
                      activeTypeFilter === option.name ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleTypeFilterSelect(option.name)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}

            {activeFilter === "location" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                {searchData.locations.map((option) => (
                  <div
                    key={option.id}
                    className={`py-2 px-3 hover:bg-gray-100 rounded cursor-pointer text-sm active:bg-gray-200 ${
                      activeLocationFilter === option.name ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleLocationFilterSelect(option.name)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}

            {!activeFilter && (
              <>
                {/* Show search results */}
                {searchValue.trim() ||
                activeTypeFilter ||
                activeLocationFilter ? (
                  renderSearchResults()
                ) : (
                  // Show recent searches when no query
                  <div>
                    {searchData.recentSearches.length > 0 ? (
                      <div>
                        <p className="text-xs text-gray-400 mb-2 px-3">
                          Recent searches
                        </p>
                        {searchData.recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center py-2 px-3 hover:bg-gray-100 rounded cursor-pointer active:bg-gray-200"
                            onClick={() => {
                              setSearchValue(search);
                              if (searchInputRef.current)
                                searchInputRef.current.focus();
                            }}
                          >
                            <Search className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">{search}</span>
                            <span className="text-xs text-gray-400 ml-auto">
                              Search again
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Start typing to search for businesses
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
