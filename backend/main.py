# import os
# import joblib
# import numpy as np
# import pandas as pd
# from sklearn.preprocessing import OneHotEncoder, StandardScaler
# from sklearn.impute import SimpleImputer
# from sklearn.model_selection import StratifiedShuffleSplit
# from sklearn.pipeline import Pipeline
# from sklearn.compose import ColumnTransformer
# from sklearn.ensemble import RandomForestRegressor

# MODEL_FILE = "model.pkl"
# PIPELINE_FILE = "pipeline.pkl"

# # Building pipeline for both numerical and categorical value
# def build_pipeline(num_fields, cat_fields):

#     # a.) Numerical values pipeline
#     num_pipe = Pipeline([
#         ('impute',SimpleImputer(strategy='median')),
#         ('scale', StandardScaler())
#     ])

#     # b.) Categorical values pipeline
#     cat_pipe = Pipeline([
#         ('onehot', OneHotEncoder(handle_unknown='ignore'))
#     ])

#     #c.) Final pipeline
#     final_pipe = ColumnTransformer([
#         ("num", num_pipe, num_fields),
#         ("cat", cat_pipe, cat_fields)
#     ])

#     return final_pipe

# if not os.path.exists(MODEL_FILE):
#     housing = pd.read_csv("housing.csv")

#     # 1. splitting the data 80/20
#     housing['income_cat'] = pd.cut(housing['median_income'], bins=[0.0,1.5,3.0,4.5,6.0,np.inf], labels=[1,2,3,4,5])
#     split = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
#     for train_index, test_index in split.split(housing,housing['income_cat']):
#         strat_test_data = housing.loc[test_index].drop('income_cat', axis = 1)
#         strat_train_data = housing.loc[train_index].drop('income_cat', axis = 1)

#     strat_test_data.to_csv("test_data.csv",index=False)
#     housing = strat_train_data.copy()

#     # ----Seperating Values which model is trained for predicting----
#     housing_labels = housing['median_house_value'].copy()
#     housing_features = housing.drop('median_house_value', axis=1)

#     # 2. Seperating the numerical and categorical columns 
#     num_fields = housing_features.drop('ocean_proximity', axis=1).columns.tolist()
#     cat_fields = ['ocean_proximity']

#     # 3. calling pipeline
#     pipeline = build_pipeline(num_fields, cat_fields)
#     housing_final_value = pipeline.fit_transform(housing_features)

#     # 4. Training model
#     model = RandomForestRegressor(random_state=42)
#     model.fit(housing_final_value, housing_labels)

#     # 5. Saving the model and pipeline preprocessing For future predictions on unknow data 
#     joblib.dump(model, MODEL_FILE)
#     joblib.dump(pipeline, PIPELINE_FILE)
#     print('Model train successfuly!')

# else:

#     # 1. Calling the trained model and pipeline preprocessing
#     model = joblib.load(MODEL_FILE)
#     pipeline = joblib.load(PIPELINE_FILE)

#     # 2. Reading testing/unknown data 
#     input_data = pd.read_csv('test_data.csv')

#     # 3. Transforming the data from pipeline and 
#     # predicting the value from trained model
#     transform_data = pipeline.transform(input_data)
#     prediction = model.predict(transform_data)
#     input_data["predicted_median_house_value"] = prediction
 
#     # 4. Saving Predictions in csv file
#     input_data.to_csv("output.csv", index=False)
#     print("Inference complete. Results saved to output.csv")

from pydantic import BaseModel
from fastapi import FastAPI
import pandas as pd
import joblib

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
