# Housing Price Predictor UI

A beautiful Next.js UI for predicting California housing prices using machine learning.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📝 Comprehensive form for house details input
- 🔮 Real-time price predictions
- 🎯 Input validation and helpful hints
- 📱 Mobile-friendly interface

## Input Fields

The form collects the following information:

- **Longitude**: Geographic longitude (-124 to -114)
- **Latitude**: Geographic latitude (32 to 42)
- **Housing Median Age**: Years since the house was built
- **Total Rooms**: Total rooms in the block
- **Total Bedrooms**: Total bedrooms in the block
- **Population**: Total population in the block
- **Households**: Total households in the block
- **Median Income**: Median income in $10,000s (e.g., 3.0 = $30,000)
- **Ocean Proximity**: Distance from ocean (NEAR BAY, INLAND, NEAR OCEAN, <1H OCEAN, ISLAND)

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Python backend running (Flask or FastAPI)

### Installation

1. Navigate to the project directory:
```bash
cd housing-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file (optional, for production):
```
PYTHON_BACKEND_URL=http://your-python-backend-url:port
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Backend Integration

The UI communicates with your Python backend via the `/api/predict` endpoint. Make sure your Python backend is running and accessible.

The API expects a POST request to `/predict` with the following structure:

```json
{
  "longitude": -120.0,
  "latitude": 35.0,
  "housing_median_age": 30,
  "total_rooms": 500,
  "total_bedrooms": 100,
  "population": 400,
  "households": 120,
  "median_income": 3.0,
  "ocean_proximity": "NEAR BAY"
}
```

And should return:

```json
{
  "prediction": 0.123456
}
```

## Python Backend Example (Flask)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load your trained model
model = joblib.load('model.pkl')
pipeline = joblib.load('pipeline.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Prepare features from data
    features = [[
        data['longitude'],
        data['latitude'],
        data['housing_median_age'],
        data['total_rooms'],
        data['total_bedrooms'],
        data['population'],
        data['households'],
        data['median_income'],
        data['ocean_proximity']
    ]]
    
    # Process through pipeline and model
    prediction = model.predict(pipeline.transform(features))[0]
    
    return jsonify({'prediction': float(prediction)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
housing-ui/
├── app/
│   ├── api/
│   │   └── predict/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── HousingForm.tsx           # Main form component
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Technologies Used

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP requests
- **React Hooks**: State management

## Notes

- Adjust the `PYTHON_BACKEND_URL` environment variable based on your backend URL
- The form includes placeholder values - adjust them based on your dataset
- All input fields are required to make a prediction
- Results are displayed in a readable currency format

## Troubleshooting

### "Cannot reach backend" error
- Ensure your Python backend is running
- Check that the backend URL is correct
- Verify CORS is enabled on your Python backend

### Form not submitting
- Check browser console for errors
- Verify all required fields are filled
- Check network tab to see the actual request/response

## License

MIT
