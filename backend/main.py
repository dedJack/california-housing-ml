import os
from pydantic import BaseModel
from fastapi import FastAPI
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "model.pkl")
pipeline_path = os.path.join(BASE_DIR, "pipeline.pkl")

model = joblib.load(model_path)
pipeline = joblib.load(pipeline_path)

class HouseData(BaseModel):
    longitude: float
    latitude: float
    housing_median_age: float
    total_rooms: float
    total_bedrooms: float
    population: float
    households: float
    median_income:float
    ocean_proximity: str


app = FastAPI()

@app.post("/predict")
def predict(data:HouseData):

    # convert data into dataframe
    input_data = pd.DataFrame([data.dict()])

    # Transforming input data
    housing_data = pipeline.transform(input_data)

    # Model Prediction
    prediction = model.predict(housing_data)

    print(prediction)
    return {
        "predicted_house_value": prediction[0]
    }
