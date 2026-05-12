import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import cross_val_score 


# 1. Load the data
housing = pd.read_csv('housing.csv')

# 2. Split train and test data
housing['income_cat'] = pd.cut(housing['median_income'], bins=[0.0,1.5,3.0,4.5,6.0, np.inf], labels=[1,2,3,4,5])

split = StratifiedShuffleSplit(n_splits=1 , test_size=0.2, random_state=42 )
for train_index, test_index in split.split(housing,housing['income_cat']):
    strat_train = housing.loc[train_index].drop('income_cat',axis=1)
    strat_test = housing.loc[test_index].drop('income_cat',axis=1)

# We only work on copied training data
housing = strat_train.copy()
 
# 3. Separate predictors and labels
housing_value = housing['median_house_value'].copy()
housing = housing.drop('median_house_value', axis=1)

# 4. Separate numerical and categorical columns
housing_num = housing.drop('ocean_proximity', axis=1).columns.to_list()
housing_cat = ['ocean_proximity'] 

# 5. Pipeline

# For numerical values
pipeline_num = Pipeline([
    ('imputer', SimpleImputer(strategy = 'median')),
    ('scale', StandardScaler()),
])

# For Categorical values
pipeline_cat = Pipeline([
    ('encode', OneHotEncoder(handle_unknown='ignore'))
])

final_pipeline = ColumnTransformer([
    ('num',pipeline_num, housing_num),
    ('cat',pipeline_cat, housing_cat),
])

# 6. Transformed Data
housing_data = final_pipeline.fit_transform(housing)

# 7. TESTING AND SELECTING MODELS

# a.) Linear Regression model
lin_reg = LinearRegression()
lin_reg.fit(housing_data,housing_value)
lin_predict = lin_reg.predict(housing_data)
# lin_rmse = root_mean_squared_error(housing_value, lin_predict)
lin_rmses = -cross_val_score(lin_reg, housing_data, housing_value, scoring='neg_root_mean_squared_error', cv = 10)
print(f"The root mean square error of Linear Regression mdoel = {pd.Series(lin_rmses).describe()}")

# b.) Decision Tree model
dec_reg = DecisionTreeRegressor()
dec_reg.fit(housing_data,housing_value)
dec_predict = dec_reg.predict(housing_data)
# dec_rmse = root_mean_squared_error(housing_value, dec_predict)
dec_rmses = -cross_val_score(dec_reg, housing_data, housing_value, scoring='neg_root_mean_squared_error', cv = 10)
print(f"The root mean square error of Decision Treet mdoel = {pd.Series(dec_rmses).describe()}")

# c.) Randome Forest model
random_forest_reg = RandomForestRegressor()
random_forest_reg.fit(housing_data, housing_value)
random_forest_predict = random_forest_reg.predict(housing_data)
# random_forest_rmse = root_mean_squared_error(housing_value, random_forest_predict)
random_forest_rmses = -cross_val_score(random_forest_reg, housing_data, housing_value, scoring='neg_root_mean_squared_error', cv=10)
print(f"The root mean square error of Random Forest mdoel = {pd.Series(random_forest_rmses).describe()}")