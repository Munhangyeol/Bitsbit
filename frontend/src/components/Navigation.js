import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  const { isDark, toggleDarkMode } = useTheme();

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
          <li>
            <Link
              to="/features"
              className={`nav-link ${isActive('/features') ? 'active' : ''}`}
            >
              투표/알림
            </Link>
          </li>
        </ul>

        <div className="nav-cta">
          <button
            onClick={toggleDarkMode}
            className="btn-theme-toggle"
            title={isDark ? '라이트 모드' : '다크 모드'}
            aria-label="테마 전환"
          >
            {isDark ? '라이트' : '다크'}
          </button>
          <Link to="/prices" className="btn-primary">
            시작하기
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
