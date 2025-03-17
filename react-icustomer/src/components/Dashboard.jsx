import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

function Dashboard() {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = 'https://icustomer.onrender.com/products';
        
        // Add query params for filtering
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            logout();
            throw new Error('Session expired. Please login again.');
          }
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://icustomer.onrender.com/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [token, logout, searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-3">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      
      <div className="container mt-4">
        <h1 className="mb-4">Product Catalog</h1>
        
        <div className="row mb-4">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by category..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="col-md-4 mb-2">
            <select 
              className="form-select"
              value={selectedCategory} 
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-4 mb-2">
            <button 
              onClick={handleClearFilters}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            No products found
          </div>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div className="col-md-6 col-lg-4 mb-4" key={product.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{product.data_category}</h5>
                    <p className="card-text">
                      <strong>Records:</strong> {product.record_count.toLocaleString()}
                    </p>
                    <div>
                      <strong>Fields:</strong>
                      <ul className="list-unstyled mt-2">
                        {product.fields.slice(0, 3).map((field, index) => (
                          <li key={index}><small>• {field}</small></li>
                        ))}
                        {product.fields.length > 3 && (
                          <li><small>• + {product.fields.length - 3} more...</small></li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <Link 
                      to={`/products/${product.id}`} 
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;