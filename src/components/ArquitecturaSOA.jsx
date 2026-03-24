// ArquitecturaSOA.jsx — Panel SOA con diagrama y health check
import { useState, useEffect } from 'react';
import axios from 'axios';

const SERVICIOS = [
  { id: 'api',       nombre: 'API Gateway',           icono: '🌐', endpoint: '/api/health',         descripcion: 'Punto único de entrada' },
  { id: 'auth',      nombre: 'AuthService',            icono: '🔐', endpoint: '/api/health',         descripcion: 'Firebase + registro manual' },
  { id: 'vuelos',    nombre: 'FlightService',          icono: '✈️', endpoint: '/api/viajes/vuelos',  descripcion: 'GDS · Disponibilidad · Reservas' },
  { id: 'hoteles',   nombre: 'HotelService',           icono: '🏨', endpoint: '/api/viajes/hoteles', descripcion: 'PMS · Inventario · Tarifas' },
  { id: 'pagos',     nombre: 'PaymentService',         icono: '💳', endpoint: '/api/health',         descripcion: 'Stripe · Validación · Seguridad' },
  { id: 'booking',   nombre: 'BookingOrchestrator',    icono: '🎯', endpoint: '/api/viajes/reservas?usuarioId=test', descripcion: 'Orquesta vuelo + hotel + pago' },
  { id: 'ubicacion', nombre: 'LocationService',        icono: '📍', endpoint: '/api/health',         descripcion: 'Geolocalización · Historial' },
  { id: 'mongo',     nombre: 'MongoDB',                icono: '🗄️', endpoint: '/api/health',         descripcion: 'Base de datos documental' },
];

export const ArquitecturaSOA = () => {
  const [estados, setEstados] = useState({});
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    verificarServicios();
    const interval = setInterval(verificarServicios, 30000);
    return () => clearInterval(interval);
  }, []);

  const verificarServicios = async () => {
    setVerificando(true);
    const BASE = 'http://localhost:5000';
    const nuevos = {};

    await Promise.all(
      SERVICIOS.map(async (srv) => {
        const inicio = Date.now();
        try {
          await axios.get(BASE + srv.endpoint, { timeout: 4000 });
          nuevos[srv.id] = { estado: 'online', ms: Date.now() - inicio };
        } catch {
          nuevos[srv.id] = { estado: 'offline', ms: null };
        }
      })
    );

    setEstados(nuevos);
    setVerificando(false);
  };

  const online = Object.values(estados).filter(e => e.estado === 'online').length;

  return (
    <div className="page-container">
      <h1 className="page-title">Arquitectura SOA</h1>
      <p className="page-subtitle">
        TravelOne implementa una Arquitectura Orientada a Servicios (SOA) con microservicios REST
      </p>

      {/* Health summary */}
      <div className="card-modern" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>Estado del sistema</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className={`service-dot ${online === SERVICIOS.length ? 'online' : online > 0 ? 'loading' : 'offline'}`}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {online}/{SERVICIOS.length} servicios activos
              </span>
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={verificarServicios}
            disabled={verificando}
          >
            {verificando ? '⟳ Verificando...' : '↺ Actualizar estado'}
          </button>
        </div>
      </div>

      {/* Service grid */}
      <div className="service-status-grid" style={{ marginBottom: '2rem' }}>
        {SERVICIOS.map(srv => {
          const est = estados[srv.id];
          return (
            <div key={srv.id} className="service-card">
              <span style={{ fontSize: '1.3rem' }}>{srv.icono}</span>
              <div className="service-info" style={{ flex: 1 }}>
                <div className="service-name">{srv.nombre}</div>
                <div className="service-status">{srv.descripcion}</div>
                {est && (
                  <div style={{ fontSize: '0.68rem', marginTop: '0.25rem', color: est.estado === 'online' ? 'var(--success)' : 'var(--danger)' }}>
                    {est.estado === 'online' ? `● Online · ${est.ms}ms` : '● Offline'}
                  </div>
                )}
              </div>
              <div className={`service-dot ${est?.estado || 'loading'}`}></div>
            </div>
          );
        })}
      </div>

      {/* Diagrama SOA textual */}
      <div className="card-modern">
        <h3>Diagrama de flujo SOA</h3>
        <div style={{ marginTop: '1.25rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '600px' }}>
            {/* Cliente */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={boxStyle('#3b82f6')}>🖥️ Cliente Web (React)</div>
            </div>
            <Arrow />
            {/* Gateway */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={boxStyle('#8b5cf6', true)}>🌐 API Gateway · Express.js</div>
            </div>
            <Arrow />
            {/* Orquestador */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={boxStyle('#06b6d4', true)}>🎯 BookingOrchestrator</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'var(--border)' }}></div>
            </div>
            {/* Servicios */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                <ArrowDown />
                <div style={boxStyle('#10b981')}>✈️ FlightService</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                <ArrowDown />
                <div style={boxStyle('#f59e0b')}>💳 PaymentService</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                <ArrowDown />
                <div style={boxStyle('#ef4444')}>🏨 HotelService</div>
              </div>
            </div>
            <Arrow />
            {/* DB */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={boxStyle('#64748b')}>🗄️ MongoDB · Base de datos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Referencia al reporte */}
      <div className="card-modern">
        <h3>Sobre este proyecto</h3>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Materia', value: 'Aplicaciones Web Orientada A Servicios' },
            { label: 'Institución', value: 'Universidad Politécnica de Tapachula' },
            { label: 'Periodo', value: '5to cuatrimestre · Enero-Abril 2026' },
            { label: 'Estilo arquitectónico', value: 'SOA · REST/JSON · Microservicios' },
            { label: 'Patrón de integración', value: 'Orquestación vía BookingOrchestrator' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.label}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const boxStyle = (color, wide) => ({
  background: `${color}18`,
  border: `1px solid ${color}44`,
  borderRadius: '10px',
  padding: '0.75rem 1.25rem',
  color: color,
  fontFamily: 'Syne, sans-serif',
  fontWeight: 600,
  fontSize: '0.85rem',
  textAlign: 'center',
  width: wide ? '280px' : '220px',
});

const Arrow = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>↓</div>
  </div>
);

const ArrowDown = () => (
  <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>↓</div>
);