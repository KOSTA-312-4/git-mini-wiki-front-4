import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">
          <Link className="footer-brand" to="/">Git Nyang</Link>
        </p>
        <small>© 2026 Git Nyang. All rights reserved.</small>
      </div>
    </footer>
  );
}