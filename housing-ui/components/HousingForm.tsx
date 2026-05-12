"use client";

import { useState } from "react";
import axios from "axios";

interface PredictionResult {
  prediction: number;
  input: {
    longitude: number;
    latitude: number;
    housingMedianAge: number;
    totalRooms: number;
    totalBedrooms: number;
    population: number;
    households: number;
    medianIncome: number;
    oceanProximity: string;
  };
}

export default function HousingForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    longitude: -120.0,
    latitude: 35.0,
    housingMedianAge: 30,
    totalRooms: 500,
    totalBedrooms: 100,
    population: 400,
    households: 120,
    medianIncome: 3.0,
    oceanProximity: "NEAR BAY",
  });

  const oceanProximityOptions = [
    "NEAR BAY",
    "INLAND",
    "NEAR OCEAN",
    "<1H OCEAN",
    "ISLAND",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "oceanProximity" ? value : parseFloat(value) || value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post<PredictionResult>(
        "/api/predict",
        formData
      );
      setResult(response.data);
      console.log(response)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error making prediction"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      longitude: -120.0,
      latitude: 35.0,
      housingMedianAge: 30,
      totalRooms: 500,
      totalBedrooms: 100,
      population: 400,
      households: 120,
      medianIncome: 3.0,
      oceanProximity: "NEAR BAY",
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Longitude */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Longitude
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="0.01"
              placeholder="-120.0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Range: -124 to -114
            </p>
          </div>

          {/* Latitude */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Latitude
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="0.01"
              placeholder="35.0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Range: 32 to 42
            </p>
          </div>

          {/* Housing Median Age */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Housing Median Age (years)
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="housingMedianAge"
              value={formData.housingMedianAge}
              onChange={handleInputChange}
              placeholder="30"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Years since built
            </p>
          </div>

          {/* Total Rooms */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Total Rooms
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleInputChange}
              placeholder="500"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Total rooms in block
            </p>
          </div>

          {/* Total Bedrooms */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Total Bedrooms
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalBedrooms"
              value={formData.totalBedrooms}
              onChange={handleInputChange}
              placeholder="100"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Total bedrooms in block
            </p>
          </div>

          {/* Population */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Population
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="population"
              value={formData.population}
              onChange={handleInputChange}
              placeholder="400"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Total population in block
            </p>
          </div>

          {/* Households */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Households
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="households"
              value={formData.households}
              onChange={handleInputChange}
              placeholder="120"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Total households in block
            </p>
          </div>

          {/* Median Income */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Median Income (in $10,000s)
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="medianIncome"
              value={formData.medianIncome}
              onChange={handleInputChange}
              step="0.1"
              placeholder="3.0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              e.g., 3.0 = $30,000
            </p>
          </div>

          {/* Ocean Proximity */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Ocean Proximity
              <span className="text-red-500">*</span>
            </label>
            <select
              name="oceanProximity"
              value={formData.oceanProximity}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {oceanProximityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Distance from ocean
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Predicting..." : "Predict Price"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition shadow-lg"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Prediction Result */}
      {result && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Predicted Price:</p>
          <p className="text-4xl font-bold text-green-600">
            ${(result.prediction).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            (Raw model output: {result.prediction})
          </p>
        </div>
      )}
    </div>
  );
}
