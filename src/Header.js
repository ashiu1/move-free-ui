import './Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <button className="login-button">Login</button>
      </nav>
    </header>
  );
}

export default Header;
