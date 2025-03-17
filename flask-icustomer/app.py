from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import os
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///catalog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_category = db.Column(db.String(100), nullable=False)
    record_count = db.Column(db.Integer, nullable=False)
    fields = db.Column(db.Text, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'data_category': self.data_category,
            'record_count': self.record_count,
            'fields': self.fields.split(',')
        }

# Create database and tables
with app.app_context():
    db.create_all()
    
    # Add sample data if the product table is empty
    if not Product.query.first():
        sample_products = [
            Product(
                data_category="Firmographic",
                record_count=5250,
                fields="Company name,Company address,Website"
            ),
            Product(
                data_category="Demographic",
                record_count=8500,
                fields="Age,Gender,Income,Education"
            ),
            Product(
                data_category="Technographic",
                record_count=3200,
                fields="Technology stack,Software used,Hardware used"
            ),
            Product(
                data_category="Geographic",
                record_count=12000,
                fields="Country,City,Region,Postal code"
            ),
            Product(
                data_category="Behavioral",
                record_count=7600,
                fields="Purchase history,Website visits,Email engagement"
            )
        ]
        db.session.add_all(sample_products)
        
        # Add a test user
        if not User.query.filter_by(username="business").first():
            test_user = User(
                username="business",
                password=generate_password_hash("password123")
            )
            db.session.add(test_user)
            
        db.session.commit()

# Routes
@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@app.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    # Get query parameters for filtering
    search_term = request.args.get('search', '')
    category = request.args.get('category', '')
    
    # Base query
    query = Product.query
    
    # Apply filters if provided
    if search_term:
        query = query.filter(Product.data_category.ilike(f'%{search_term}%'))
    if category:
        query = query.filter(Product.data_category == category)
    
    products = query.all()
    return jsonify([product.to_dict() for product in products]), 200

@app.route('/products/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200

@app.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = db.session.query(Product.data_category).distinct().all()
    return jsonify([category[0] for category in categories]), 200

if __name__ == '__main__':
    app.run(debug=True)

