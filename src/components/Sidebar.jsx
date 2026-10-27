import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const menuItems = [
  { to: '/', label: '메인 페이지', icon: 'bi-house-door' },
  { to: '/search', label: '검색 결과', icon: 'bi-search' },
  { to: '/favorites', label: '즐겨찾기', icon: 'bi-bookmark' },
  { to: '/mypage', label: '마이페이지', icon: 'bi-person' },
];

export default function Sidebar() {
  
  return (
    <aside className="side-area" aria-label="사이드바">
      <div className="side-bar">
        <h2 className="h6 fw-bold mb-3">바로가기</h2>
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <i className={`bi ${item.icon} me-2`} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <hr />
        <p className="small text-secondary mb-0">
          자주 사용하는 메뉴를 빠르게 이동할 수 있습니다.
        </p>
      </div>
    </aside>
  );
}