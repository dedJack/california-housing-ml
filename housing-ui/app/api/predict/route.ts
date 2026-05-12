import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Prepare data for Python backend
    const predictionData = {
      longitude: body.longitude,
      latitude: body.latitude,
      housing_median_age: body.housingMedianAge,
      total_rooms: body.totalRooms,
      total_bedrooms: body.totalBedrooms,
      population: body.population,
      households: body.households,
      median_income: body.medianIncome,
      ocean_proximity: body.oceanProximity,
    };

    // Call your Python backend (Flask/FastAPI)
    // Replace localhost:5000 with your actual backend URL
    const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    
    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(predictionData),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const prediction = await response.json();
    console.log(prediction)
    return NextResponse.json(
      {
        prediction: prediction.predicted_house_value,
        input: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
