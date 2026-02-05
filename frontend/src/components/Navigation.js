import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">Bitsbit</span>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              홈
            </Link>
          </li>
          <li>
            <Link
              to="/prices"
              className={`nav-link ${isActive('/prices') ? 'active' : ''}`}
            >
              실시간 가격
            </Link>
          </li>
          <li>
            <Link
              to="/trends"
              className={`nav-link ${isActive('/trends') ? 'active' : ''}`}
            >
              시장 트렌드
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className={`nav-link ${isActive('/news') ? 'active' : ''}`}
            >
              뉴스 피드
            </Link>
          </li>
        </ul>

        <div className="nav-cta">
          <Link to="/prices" className="btn-primary">
            시작하기
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
