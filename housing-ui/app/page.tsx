import HousingForm from "@/components/HousingForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏠 Housing Price Predictor
          </h1>
          <p className="text-gray-600">
            Enter house details to predict the median house price in California
          </p>
        </div>
        <HousingForm />
      </div>
    </main>
  );
}
