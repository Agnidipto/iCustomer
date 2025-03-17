# B2B Data Catalog

A simple B2B data catalog showing product information with authentication.

## Setup

### Backend
```
# Clone repo
git clone <repo-url>

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
flask run  # Runs on http://localhost:5000
```

### Frontend
```
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

## Authentication
- Username: business
- Password: password123

## API Endpoints
- `POST /login` - Auth user, returns JWT
- `GET /products` - List all products (authenticated)
- `GET /products/:id` - Get product details (authenticated)
- `GET /categories` - List categories (authenticated)

## Tech Stack
- Backend: Flask, SQLite, JWT
- Frontend: React, Bootstrap