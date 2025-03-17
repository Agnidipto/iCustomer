import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

function ProductDetail() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            logout();
            throw new Error('Session expired. Please login again.');
          }
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, token, logout]);

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
  
  if (!product) return (
    <div className="container mt-3">
      <div className="alert alert-warning" role="alert">
        Product not found
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      
      <div className="container mt-4">
        <div className="mb-3">
          <Link to="/" className="btn btn-link px-0">
            ← Back to Products
          </Link>
        </div>
        
        <div className="card">
          <div className="card-header bg-light">
            <h1 className="h3 mb-0">{product.data_category}</h1>
          </div>
          
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Record Count</h5>
                    <p className="card-text h4">{product.record_count.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h4>Available Fields</h4>
            <div className="mb-3">
              {product.fields.map((field, index) => (
                <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2">
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;