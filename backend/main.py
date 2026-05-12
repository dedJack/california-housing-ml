
import os
from pydantic import BaseModel
from fastapi import FastAPI
import pandas as pd
import joblib
from train_model import train_model

if not os.path.exists('model.pkl'):
    train_model()

model = joblib.load('model.pkl')
pipeline = joblib.load('pipeline.pkl')

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
