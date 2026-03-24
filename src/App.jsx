// App.jsx — TravelOne Completo
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { Header } from './components/Header';
import { Login } from './components/Login';
import { RegistroManual } from './components/RegistroManual';
import { CheckoutForm } from './components/CheckoutForm';
import { ViajesIntegrado } from './components/ViajesIntegrado';
import { TablaHistorial } from './components/TablaHstorial';
import { DashboardMapa } from './components/DashboardMapa';
import { MisReservas } from './components/MisReservas';
import { PerfilUsuario } from './components/PerfilUsuario';
import { ArquitecturaSOA } from './components/ArquitecturaSOA';

import { auth, onAuthStateChanged } from './firebase';
import './App.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const FondoAnimado = () => (
  <div className="card-bg">
    <div className="bg"></div>
    <div className="blob"></div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [modo, setModo] = useState('login');       // 'login' | 'registro'
  const [vista, setVista] = useState('viajes');    // vista del dashboard

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  // ── LOGIN / REGISTRO ─────────────────────────
  if (!user) {
    return (
      <>
        <FondoAnimado />
        <Header user={null} />
        <main style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="login-card">
            {modo === 'login' ? (
              <Login onLogin={setUser} />
            ) : (
              <RegistroManual onRegistroExitoso={setUser} />
            )}
            <div className="divider"><span>o</span></div>
            <button
              className="switch-mode-btn"
              onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            >
              {modo === 'login'
                ? '¿No tienes cuenta? Créala aquí'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </main>
      </>
    );
  }

  // ── PAGO ─────────────────────────────────────
  if (!isPaid) {
    return (
      <>
        <FondoAnimado />
        <Header user={user} />
        <main style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="checkout-card">
            <Elements stripe={stripePromise}>
              <CheckoutForm onPaymentSuccess={() => setIsPaid(true)} />
            </Elements>
          </div>
        </main>
      </>
    );
  }

  // ── DASHBOARD ────────────────────────────────
  const renderVista = () => {
    switch (vista) {
      case 'viajes':
        return (
          <ViajesIntegrado
            usuario={user}
            onReservaExitosa={(r) => console.log('Reserva:', r)}
          />
        );
      case 'mapa':
        return (
          <div className="page-container">
            <h1 className="page-title">Mapa en tiempo real</h1>
            <p className="page-subtitle">Tu ubicación y el rastreo de tus rutas</p>
            <div className="card-modern">
              <DashboardMapa user={user} />
            </div>
          </div>
        );
      case 'reservas':
        return <MisReservas usuario={user} />;
      case 'historial':
        return (
          <div className="page-container">
            <h1 className="page-title">Historial de ubicaciones</h1>
            <p className="page-subtitle">Registro de los lugares donde has estado</p>
            <div className="card-modern">
              <TablaHistorial usuarioId={user.uid || user.id} />
            </div>
          </div>
        );
      case 'perfil':
        return <PerfilUsuario usuario={user} />;
      case 'soa':
        return <ArquitecturaSOA />;
      default:
        return null;
    }
  };

  return (
    <>
      <FondoAnimado />
      <Header user={user} vistaActual={vista} setVista={setVista} />
      <main className="main-content">
        {renderVista()}
      </main>
    </>
  );
}

export default App;