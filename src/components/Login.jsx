// Login.jsx — TravelOne Premium Dark
import React from 'react';
import { signInWithGoogle } from '../firebase';

export const Login = ({ onLogin }) => {
  const handleGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      onLogin(result.user);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Hero text */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
          Bienvenido a
        </p>
        <h1 className="login-title">TravelOne</h1>
        <p className="login-subtitle">
          Tu plataforma de viajes inteligente. Reserva vuelos y hoteles en minutos.
        </p>
      </div>

      {/* Botón Google */}
      <button className="btn-google" onClick={handleGoogle}>
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continuar con Google
      </button>

      {/* Features highlight */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        {[
          { icon: '✈️', text: 'Vuelos en tiempo real' },
          { icon: '🏨', text: 'Hoteles con las mejores tarifas' },
          { icon: '🗺️', text: 'Rastreo de rutas en el mapa' },
          { icon: '🔒', text: 'Pagos seguros con Stripe' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1rem' }}>{f.icon}</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};