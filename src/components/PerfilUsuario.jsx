// PerfilUsuario.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const PerfilUsuario = ({ usuario }) => {
  const [stats, setStats] = useState({ reservas: 0, ubicaciones: 0, total: 0 });

  useEffect(() => {
    const userId = usuario.uid || usuario.id;
    Promise.all([
      axios.get(`http://localhost:5000/api/viajes/reservas?usuarioId=${userId}`).catch(() => ({ data: [] })),
      axios.get(`http://localhost:5000/api/ubicaciones?usuarioId=${userId}`).catch(() => ({ data: [] })),
    ]).then(([reservasRes, ubicRes]) => {
      const reservas = reservasRes.data;
      const total = reservas.reduce((sum, r) => sum + (r.total || 0), 0);
      setStats({ reservas: reservas.length, ubicaciones: ubicRes.data.length, total });
    });
  }, [usuario]);

  const inicial = (usuario.displayName || usuario.email || '?')[0].toUpperCase();
  const nombre = usuario.displayName || usuario.email || 'Usuario';
  const email = usuario.email || '';
  const proveedor = usuario.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email/Contraseña';

  return (
    <div className="page-container">
      <h1 className="page-title">Mi Perfil</h1>
      <p className="page-subtitle">Información de tu cuenta y estadísticas</p>

      <div className="card-modern">
        <div className="profile-header">
          <div className="profile-avatar-lg">
            {usuario.photoURL
              ? <img src={usuario.photoURL} alt="avatar" />
              : inicial
            }
          </div>
          <div>
            <div className="profile-name">{nombre}</div>
            <div className="profile-email">{email}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="amenity-badge" style={{ fontSize: '0.72rem' }}>
                {proveedor === 'Google' ? '🔵' : '📧'} {proveedor}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{stats.reservas}</div>
            <div className="stat-label">Reservas</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.ubicaciones}</div>
            <div className="stat-label">Ubicaciones</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">${stats.total.toLocaleString()}</div>
            <div className="stat-label">Total MXN</div>
          </div>
        </div>
      </div>

      <div className="card-modern">
        <h3>Información de cuenta</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {[
            { label: 'Nombre', value: nombre, icon: '👤' },
            { label: 'Correo', value: email, icon: '📧' },
            { label: 'UID', value: (usuario.uid || usuario.id || '—').slice(0, 20) + '...', icon: '🔑' },
            { label: 'Proveedor', value: proveedor, icon: '🔐' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {item.icon} {item.label}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};