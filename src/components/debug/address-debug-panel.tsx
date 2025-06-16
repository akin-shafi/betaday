/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";

export function AddressDebugPanel() {
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const { input, setInput, suggestions, loading } = useAddressAutocomplete();

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Address Debug Panel</h3>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Address:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: Lekki Phase 1, Victoria Island, Ikeja, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-blue-600">Loading suggestions...</p>}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Suggestions:</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id}
                onClick={() => setSelectedAddress(suggestion)}
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
              >
                <div className="font-medium">{suggestion.description}</div>
                {suggestion.details && (
                  <div className="text-sm text-gray-600 mt-1">
                    State: {suggestion.details.state} | Local Gov:{" "}
                    {suggestion.details.localGovernment} | Locality:{" "}
                    {suggestion.details.locality}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Address Details */}
      {selectedAddress && selectedAddress.details && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Selected Address Details:</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Full Address:</strong> {selectedAddress.description}
            </p>
            <p>
              <strong>Formatted Address:</strong>{" "}
              {selectedAddress.details.formattedAddress}
            </p>
            <p>
              <strong>State:</strong> {selectedAddress.details.state}
            </p>
            <p>
              <strong>Local Government:</strong>{" "}
              {selectedAddress.details.localGovernment}
            </p>
            <p>
              <strong>City:</strong> {selectedAddress.details.city}
            </p>
            <p>
              <strong>Locality:</strong> {selectedAddress.details.locality}
            </p>
            <p>
              <strong>Sublocality:</strong>{" "}
              {selectedAddress.details.sublocality}
            </p>
            <p>
              <strong>Sublocality Level 1:</strong>{" "}
              {selectedAddress.details.sublocality_level_1}
            </p>
            <p>
              <strong>Administrative Area Level 2:</strong>{" "}
              {selectedAddress.details.administrative_area_level_2}
            </p>
            <p>
              <strong>Neighborhood:</strong>{" "}
              {selectedAddress.details.neighborhood}
            </p>
            <p>
              <strong>Coordinates:</strong> {selectedAddress.details.latitude},{" "}
              {selectedAddress.details.longitude}
            </p>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h5 className="font-medium text-yellow-800 mb-2">
              Current localGovernmentId Logic:
            </h5>
            <p className="text-sm text-yellow-700">
              Currently using:{" "}
              <strong>{selectedAddress.details.localGovernment}</strong>
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              This is what gets sent to the backend as localGovernmentId
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
