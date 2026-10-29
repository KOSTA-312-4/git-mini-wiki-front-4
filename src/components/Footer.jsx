import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">
          <Link className="footer-brand" to="/">깃냥이</Link>
        </p>
        <small>© 2026 깃냥이 · 데이터 출처: GitHub REST API</small>
      </div>
    </footer>
  );
}