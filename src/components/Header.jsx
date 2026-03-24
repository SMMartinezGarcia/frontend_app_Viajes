// Header.jsx — TravelOne Premium
import React from 'react';
import { logout } from '../firebase';

export const Header = ({ user, vistaActual, setVista }) => {
  const handleLogout = async () => {
    try { await logout(); } catch (e) { console.error(e); }
  };

  const inicial = (user?.displayName || user?.email || '?')[0].toUpperCase();

  const tabs = [
    { id: 'viajes',   icon: '✈️', label: 'Viajes' },
    { id: 'mapa',     icon: '🗺️', label: 'Mapa' },
    { id: 'reservas', icon: '📋', label: 'Mis Reservas' },
    { id: 'historial',icon: '📍', label: 'Historial' },
    { id: 'perfil',   icon: '👤', label: 'Perfil' },
    { id: 'soa',      icon: '⚙️', label: 'Arquitectura' },
  ];

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <div className="logo-icon">✈</div>
        TravelOne
      </div>

      {/* Tabs de navegación (solo si hay usuario) */}
      {user && (
        <nav className="header-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${vistaActual === tab.id ? 'active' : ''}`}
              onClick={() => setVista(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      {/* Usuario y logout */}
      {user && (
        <div className="header-user">
          <div className="user-avatar">
            {user.photoURL
              ? <img src={user.photoURL} alt="avatar" />
              : inicial
            }
          </div>
          <span className="user-name">{user.displayName || user.email}</span>
          <button className="btn-logout" onClick={handleLogout}>Salir</button>
        </div>
      )}
    </header>
  );
};