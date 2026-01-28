import { useState, useEffect, useRef } from 'react';
import './ProfileDropdown.css';

function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button className="profile-button" onClick={toggleDropdown}>
        {user?.picture ? (
          <img src={user.picture} alt="Profile" className="profile-image" />
        ) : (
          <div className="profile-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="person-icon">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              {user?.email && <div className="user-email">{user.email}</div>}
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-items">
            <a href="#profile" className="dropdown-item">
              <span>Profile</span>
            </a>
            <a href="#settings" className="dropdown-item">
              <span>Settings</span>
            </a>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
