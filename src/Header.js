import { useState } from 'react';
import './Header.css';
import LoginModal from './Authorization/LoginModal';
import SignupModal from './Authorization/SignupModal';
import ProfileDropdown from './Authorization/ProfileDropdown';

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsSignupModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <>
                <button className="login-button" onClick={() => setIsLoginModalOpen(true)}>Login</button>
                <button className="signup-button" onClick={() => setIsSignupModalOpen(true)}>Sign Up</button>
              </>
            )}
          </div>
        </nav>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
}

export default Header;
