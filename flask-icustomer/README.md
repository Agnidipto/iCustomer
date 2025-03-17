
# README.md
# B2B Data Catalog Backend

This is the backend API for the B2B Data Catalog application.

## Setup Instructions

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the application:
   ```
   flask run
   ```
   
## API Endpoints

- `POST /login` - Authenticates a user and returns a JWT token
- `GET /products` - Returns a list of all products (requires authentication)
- `GET /products/:id` - Returns details of a specific product by ID (requires authentication)
- `GET /categories` - Returns a list of all unique data categories (requires authentication)

## Authentication Details

Sample credentials for testing:
- Username: business
- Password: password123

To authenticate, send a POST request to `/login` with JSON body:
```json
{
  "username": "business",
  "password": "password123"
}
```

Use the returned token in the Authorization header for subsequent requests:
```
Authorization: Bearer <token>
```