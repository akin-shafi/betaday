/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  X,
  Star,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSearchData, type SearchItem } from "@/hooks/use-search-data";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useVoiceSearchAnalytics } from "./voice-search-analytics";
import { useEnhancedVoiceRecognition } from "@/hooks/use-enhanced-voice-recognition";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { extractKeywords } from "@/utils/keyword-extraction";
import { useKeywordExtraction } from "@/hooks/use-keyword-extraction";

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
  const [voiceSearchMetadata, setVoiceSearchMetadata] = useState<any>(null);
  const [lastSearchParams, setLastSearchParams] = useState<string>("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use the imported hooks
  const {
    searchData,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
    searchItems,
    isLoading,
    error,
    suggestions,
  } = useSearchData();
  const {
    isListening,
    isSupported,
    isProcessing,
    lastTranscript,
    startListening,
    stopListening,
  } = useEnhancedVoiceRecognition();
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: ttsSupported,
  } = useTextToSpeech();
  const { trackVoiceSearch } = useVoiceSearchAnalytics();
  const { extractKeywords: extractKeywordsAPI } = useKeywordExtraction();
  const router = useRouter();

  // Enhanced debounced search function with hybrid keyword extraction
  const debouncedSearch = useCallback(
    async (
      query: string,
      typeFilter?: string,
      locationFilter?: string,
      isVoice = false,
      originalQuery?: string
    ) => {
      // Create search params key to prevent duplicates
      const searchParamsKey = JSON.stringify({
        query: query.trim(),
        typeFilter,
        locationFilter,
        isVoice,
        originalQuery,
      });

      // Prevent duplicate searches
      if (searchParamsKey === lastSearchParams && !isVoice) {
        console.log("Preventing duplicate search");
        return;
      }

      // Prevent API calls if no meaningful search criteria
      if (!query.trim() && !typeFilter && !locationFilter) {
        setSearchResults([]);
        setSearchError(null);
        setVoiceSearchMetadata(null);
        setLastSearchParams("");
        return;
      }

      // Prevent API calls for very short queries
      if (query.trim() && query.trim().length < 2) {
        setSearchResults([]);
        setSearchError(null);
        setVoiceSearchMetadata(null);
        setLastSearchParams("");
        return;
      }

      // Prevent duplicate API calls if already searching
      if (isSearching) {
        console.log("Search already in progress, skipping duplicate call");
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      setLastSearchParams(searchParamsKey);

      try {
        console.log("Starting enhanced search with:", {
          query,
          typeFilter,
          locationFilter,
          isVoice,
          originalQuery,
        });

        const searchOptions: any = {
          query,
          typeFilter,
          locationFilter,
        };

        if (isVoice && originalQuery) {
          searchOptions.voiceOptions = {
            keywords: voiceSearchMetadata?.extractedKeywords || [originalQuery],
            voiceSearch: true,
            originalQuery,
          };
        }

        const results = await searchItems(
          searchOptions.query,
          searchOptions.typeFilter,
          searchOptions.locationFilter,
          searchOptions.voiceOptions
        );

        console.log("Enhanced search results:", results);
        setSearchResults(results || []);

        // Track voice search analytics
        if (isVoice && originalQuery) {
          await trackVoiceSearch({
            originalQuery,
            extractedKeywords: voiceSearchMetadata?.extractedKeywords || [
              originalQuery,
            ],
            detectedBusinessType: voiceSearchMetadata?.detectedBusinessType,
            searchResults: results?.length || 0,
            userClicked: false,
            confidence: voiceSearchMetadata?.confidence || 0.5,
          });
        }
      } catch (err) {
        console.error("Enhanced search error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Search failed. Please try again.";
        setSearchError(errorMessage);

        if (isMobile) {
          message.error("Search failed. Check your connection and try again.");
        } else {
          message.error(errorMessage);
        }

        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [
      searchItems,
      isMobile,
      trackVoiceSearch,
      isSearching,
      lastSearchParams,
      voiceSearchMetadata,
    ]
  );

  // Hybrid keyword enhancement function
  const enhanceWithBackendAPI = useCallback(
    async (originalQuery: string, localResult: any) => {
      try {
        setIsEnhancing(true);
        console.log("🔄 Enhancing with backend API for:", originalQuery);

        const backendResult = await extractKeywordsAPI(originalQuery, {
          language: "en",
        });

        if (
          backendResult &&
          backendResult.confidence > localResult.confidence
        ) {
          console.log("✅ Backend provided better results:", backendResult);

          // Update search if backend found better business type
          if (
            backendResult.businessType &&
            backendResult.businessType !== localResult.businessType
          ) {
            setActiveTypeFilter(backendResult.businessType);
            message.success(
              `🧠 AI enhanced: Found ${backendResult.businessType.toLowerCase()} category`,
              {
                autoClose: 2000,
              }
            );

            if (ttsSupported) {
              speak(
                `AI enhanced search found ${backendResult.businessType.toLowerCase()} category`
              );
            }
          }

          // Update search term if backend found better keywords
          if (
            backendResult.searchTerm &&
            backendResult.searchTerm !== localResult.searchTerm
          ) {
            setSearchValue(backendResult.searchTerm);
          }

          // Update metadata with enhanced results
          setVoiceSearchMetadata((prev: any) => ({
            ...prev,
            enhancedKeywords: backendResult.keywords,
            enhancedBusinessType: backendResult.businessType,
            enhancedConfidence: backendResult.confidence,
            suggestions: backendResult.suggestions,
            isEnhanced: true,
            enhancedAt: new Date().toISOString(),
          }));

          // Re-run search with enhanced parameters
          await debouncedSearch(
            backendResult.searchTerm,
            backendResult.businessType,
            activeLocationFilter || undefined,
            true,
            originalQuery
          );

          return backendResult;
        } else {
          console.log("ℹ️ Local extraction was sufficient");
          return localResult;
        }
      } catch (error) {
        console.error("❌ Backend enhancement failed:", error);
        // Silently fail - local extraction already worked
        return localResult;
      } finally {
        setIsEnhancing(false);
      }
    },
    [
      extractKeywordsAPI,
      ttsSupported,
      speak,
      setActiveTypeFilter,
      setSearchValue,
      debouncedSearch,
      activeLocationFilter,
    ]
  );

  // Rest of the component logic remains the same...
  // Effect to handle search and filtering with debouncing and duplicate prevention
  useEffect(() => {
    if (!isSearchFocused) return;

    // Don't make API calls if we're already searching
    if (isSearching) return;

    // Don't make API calls if we have no search criteria
    const hasSearchCriteria =
      searchValue.trim() || activeTypeFilter || activeLocationFilter;
    if (!hasSearchCriteria) {
      setSearchResults([]);
      setSearchError(null);
      setVoiceSearchMetadata(null);
      return;
    }

    // Don't make API calls for very short queries
    if (searchValue.trim() && searchValue.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setVoiceSearchMetadata(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      // Double-check conditions before making the API call
      if (!isSearching && hasSearchCriteria) {
        debouncedSearch(
          searchValue,
          activeTypeFilter || undefined,
          activeLocationFilter || undefined
        );
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [
    searchValue,
    activeTypeFilter,
    activeLocationFilter,
    isSearchFocused,
    debouncedSearch,
    isSearching,
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
        setActiveFilter(null);
        stopSpeaking();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      addRecentSearch(searchValue);
      if (!isMobile) {
        message.success(`Searching for "${searchValue}"`);
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
    setVoiceSearchMetadata(null);
  };

  // Enhanced voice search handler with hybrid approach
  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
      return;
    }

    if (!isSupported) {
      message.error("Voice search is not supported in your browser");
      return;
    }

    stopSpeaking();

    startListening(
      async (transcript) => {
        console.log("🎤 Voice transcript:", transcript);

        // Step 1: Immediate local extraction for fast UX
        const localResult = extractKeywords(transcript);
        console.log("⚡ Local extraction:", localResult);

        // Step 2: Immediate UI updates
        setSearchValue(localResult.searchTerm);

        if (localResult.businessType) {
          setActiveTypeFilter(localResult.businessType);
          message.success(
            `Voice search: Found ${localResult.businessType.toLowerCase()} category`
          );

          if (ttsSupported) {
            speak(
              `Found ${localResult.businessType.toLowerCase()} category. Searching for ${
                localResult.searchTerm || transcript
              }`
            );
          }
        } else {
          message.success(`Voice search: "${transcript}"`);

          if (ttsSupported) {
            speak(`Searching for ${transcript}`);
          }
        }

        // Step 3: Set initial metadata
        setVoiceSearchMetadata({
          originalQuery: transcript,
          extractedKeywords: localResult.keywords,
          detectedBusinessType: localResult.businessType,
          confidence: localResult.businessType ? 0.8 : 0.5,
          isEnhanced: false,
        });

        addRecentSearch(transcript);

        // Step 4: Start initial search with local results
        await debouncedSearch(
          localResult.searchTerm,
          localResult.businessType,
          activeLocationFilter || undefined,
          true,
          transcript
        );

        // Step 5: Enhance with backend API in background (non-blocking)
        setTimeout(async () => {
          await enhanceWithBackendAPI(transcript, localResult);
        }, 100); // Small delay to ensure UI updates first

        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      },
      (error) => {
        console.error("Voice recognition error:", error);
        message.error(error);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchFocused(false);
      setActiveFilter(null);
      stopSpeaking();
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const retrySearch = () => {
    setSearchError(null);
    debouncedSearch(
      searchValue,
      activeTypeFilter || undefined,
      activeLocationFilter || undefined
    );
  };

  // Enhanced result click handler with analytics
  const handleResultClick = async (result: SearchItem) => {
    try {
      if (voiceSearchMetadata) {
        await trackVoiceSearch({
          ...voiceSearchMetadata,
          userClicked: true,
        });
      }

      router.push(`/store/${result.id}`);
      addRecentSearch(result.name);
      setIsSearchFocused(false);
      setSearchValue("");

      if (ttsSupported && voiceSearchMetadata) {
        speak(`Opening ${result.name}`);
      }
    } catch (err) {
      console.error("Navigation error:", err);
      message.error("Failed to navigate. Please try again.");
    }
  };

  // Enhanced render search results function
  const renderSearchResults = () => {
    if (isSearching || isLoading) {
      return (
        <div className="p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Searching...</p>
          {isEnhancing && (
            <p className="text-purple-500 text-xs mt-1">
              🧠 AI enhancing results...
            </p>
          )}
        </div>
      );
    }

    if (searchError || error) {
      const displayError = searchError || error || "An unknown error occurred";
      return (
        <div className="p-4 text-center text-red-500">
          <p className="text-sm mb-2">
            {displayError.includes("Failed to fetch") ||
            displayError.includes("NetworkError") ||
            displayError.includes("Connection failed")
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

    if (
      searchResults.length === 0 &&
      (searchValue.trim() || activeTypeFilter || activeLocationFilter)
    ) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p className="mb-2">
            No results found. Try a different search term or filter.
          </p>
          {voiceSearchMetadata && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
              <p className="font-medium">Voice Search Details:</p>
              <p>Original: "{voiceSearchMetadata.originalQuery}"</p>
              {voiceSearchMetadata.detectedBusinessType && (
                <p>Detected: {voiceSearchMetadata.detectedBusinessType}</p>
              )}
              {voiceSearchMetadata.isEnhanced && (
                <p className="text-purple-600">
                  🧠 AI Enhanced: {voiceSearchMetadata.enhancedBusinessType}
                </p>
              )}
              <p>
                Confidence:{" "}
                {Math.round(
                  (voiceSearchMetadata.enhancedConfidence ||
                    voiceSearchMetadata.confidence) * 100
                )}
                %
              </p>
            </div>
          )}
          {(suggestions?.length > 0 ||
            voiceSearchMetadata?.suggestions?.length > 0) && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Did you mean:</p>
              <div className="flex flex-wrap gap-1">
                {(voiceSearchMetadata?.suggestions || suggestions || []).map(
                  (suggestion: string, index: number) => (
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
                  )
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (searchResults.length > 0) {
      return (
        <div className="max-h-[350px] overflow-y-auto">
          {voiceSearchMetadata && (
            <div
              className={`p-2 border-b text-xs ${
                voiceSearchMetadata.isEnhanced ? "bg-purple-50" : "bg-green-50"
              }`}
            >
              <p
                className={`font-medium ${
                  voiceSearchMetadata.isEnhanced
                    ? "text-purple-800"
                    : "text-green-800"
                }`}
              >
                {voiceSearchMetadata.isEnhanced
                  ? "🧠 AI Enhanced Voice Search"
                  : "Voice Search Results"}
              </p>
              <p
                className={
                  voiceSearchMetadata.isEnhanced
                    ? "text-purple-600"
                    : "text-green-600"
                }
              >
                Found {searchResults.length} results for "
                {voiceSearchMetadata.originalQuery}"
              </p>
              {voiceSearchMetadata.isEnhanced &&
                voiceSearchMetadata.enhancedBusinessType && (
                  <p className="text-purple-600">
                    AI detected: {voiceSearchMetadata.enhancedBusinessType}
                  </p>
                )}
              {!voiceSearchMetadata.isEnhanced &&
                voiceSearchMetadata.detectedBusinessType && (
                  <p className="text-green-600">
                    Detected category:{" "}
                    {voiceSearchMetadata.detectedBusinessType}
                  </p>
                )}
            </div>
          )}
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors group active:bg-gray-200"
              onClick={() => handleResultClick(result)}
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
                <span className="text-xs text-gray-400">
                  {result.priceRange}
                </span>
                <div className="flex items-center gap-1">
                  {ttsSupported && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSpeaking) {
                          stopSpeaking();
                        } else {
                          speak(
                            `${result.name}, ${result.type}, located in ${result.location}`
                          );
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title={isSpeaking ? "Stop speaking" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </button>
                  )}
                  <div className="flex items-center text-xs text-[#1A2E20] opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>
          ))}
        </div>
      );
    }

    return null;
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
          className={`flex items-center border border-gray-200 rounded-lg px-3 py-2 w-full transition-all duration-300 ${
            isSearchFocused ? "rounded-b-none shadow-md" : ""
          }`}
        >
          <Search className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={
              isMobile
                ? "Search or speak..."
                : "Search restaurants, drinks, groceries or speak..."
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

          {/* Enhanced voice input indicator */}
          {(isListening || isProcessing || isEnhancing) && (
            <div className="flex items-center space-x-2 ml-2">
              {isEnhancing ? (
                <div className="flex items-center text-purple-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  <span className="text-xs">AI enhancing...</span>
                </div>
              ) : isProcessing ? (
                <div className="flex items-center text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  <span className="text-xs">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                  <span className="text-xs">Listening...</span>
                </div>
              )}
              {lastTranscript && (
                <span className="text-xs text-gray-500 max-w-20 truncate">
                  "{lastTranscript}"
                </span>
              )}
            </div>
          )}

          {/* Active filters display */}
          {(activeTypeFilter || activeLocationFilter) && (
            <div className="flex items-center space-x-1 ml-2">
              {activeTypeFilter && (
                <div
                  className={`text-white text-xs py-1 px-2 rounded-full flex items-center ${
                    voiceSearchMetadata?.isEnhanced
                      ? "bg-purple-600"
                      : "bg-[#1A2E20]"
                  }`}
                >
                  {voiceSearchMetadata?.isEnhanced && "🧠 "}
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

          {/* Enhanced voice search button */}
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              disabled={isProcessing}
              className={`ml-2 p-2 rounded-full transition-all duration-200 ${
                isListening || isProcessing
                  ? "bg-red-500 text-white animate-pulse"
                  : isEnhancing
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
              }`}
              title={
                isEnhancing
                  ? "AI enhancing voice search..."
                  : isProcessing
                  ? "Processing voice input..."
                  : isListening
                  ? "Stop listening"
                  : "Start AI voice search"
              }
            >
              {isProcessing || isEnhancing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Text-to-speech toggle */}
          {ttsSupported && searchResults.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  const resultText = `Found ${searchResults.length} results. ${searchResults[0]?.name}`;
                  speak(resultText);
                }
              }}
              className={`ml-1 p-2 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
              }`}
              title={isSpeaking ? "Stop speaking" : "Read results aloud"}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
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

              {/* Enhanced voice search indicator */}
              {isSupported && (
                <div className="flex items-center text-xs text-gray-500 ml-auto">
                  <Mic className="h-3 w-3 mr-1" />
                  <span>🧠 AI Voice</span>
                  {ttsSupported && (
                    <>
                      <Volume2 className="h-3 w-3 ml-2 mr-1" />
                      <span>Audio</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {activeFilter === "type" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <div className="space-y-1">
                  {searchData.types.map((option) => (
                    <div
                      key={option.id}
                      className={`py-2 px-3 hover:bg-gray-100 rounded cursor-pointer text-sm active:bg-gray-200 transition-colors ${
                        activeTypeFilter === option.name
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                      onClick={() => handleTypeFilterSelect(option.name)}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
                {searchData.types.length > 8 && (
                  <div className="text-xs text-gray-400 text-center mt-2 py-1 border-t">
                    Scroll to see more options
                  </div>
                )}
              </div>
            )}

            {activeFilter === "location" && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <div className="space-y-1">
                  {searchData.locations.map((option) => (
                    <div
                      key={option.id}
                      className={`py-2 px-3 hover:bg-gray-100 rounded cursor-pointer text-sm active:bg-gray-200 transition-colors ${
                        activeLocationFilter === option.name
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                      onClick={() => handleLocationFilterSelect(option.name)}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
                {searchData.locations.length > 8 && (
                  <div className="text-xs text-gray-400 text-center mt-2 py-1 border-t">
                    Scroll to see more options
                  </div>
                )}
              </div>
            )}

            {!activeFilter && (
              <>
                {searchValue.trim() ||
                activeTypeFilter ||
                activeLocationFilter ? (
                  renderSearchResults()
                ) : (
                  <div>
                    {searchData.recentSearches.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between px-3 mb-2">
                          <p className="text-xs text-gray-400">
                            Recent searches
                          </p>
                          <button
                            onClick={clearAllRecentSearches}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                        {searchData.recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center py-2 px-3 hover:bg-gray-100 rounded cursor-pointer active:bg-gray-200"
                          >
                            <div
                              className="flex items-center flex-1"
                              onClick={() => {
                                setSearchValue(search);
                                if (searchInputRef.current)
                                  searchInputRef.current.focus();
                              }}
                            >
                              <Search className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm">{search}</span>
                              <span className="text-xs text-gray-400 ml-auto mr-2">
                                Search again
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(search);
                              }}
                              className="p-1 rounded transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100"
                              title="Remove from recent searches"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        <div className="flex items-center justify-center mb-2">
                          <Search className="h-5 w-5 mr-2" />
                          {isSupported && <Mic className="h-5 w-5" />}
                          {ttsSupported && <Volume2 className="h-5 w-5 ml-1" />}
                        </div>
                        Start typing or {isSupported ? "speak" : "type"} to
                        search for businesses
                        {ttsSupported && <br />}
                        {ttsSupported && (
                          <span className="text-xs">
                            🧠 AI-powered voice search with audio feedback
                          </span>
                        )}
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
