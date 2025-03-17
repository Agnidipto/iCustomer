import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          B2B Data Catalog
        </Link>
        
        <div className="ms-auto d-flex align-items-center">
          {user && (
            <>
              <span className="text-light me-3">
                <i className="bi bi-person-circle me-2"></i>
                {user}
              </span>
              <button onClick={logout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;