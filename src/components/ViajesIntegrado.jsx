// ViajesIntegrado.jsx — Glass cards + loader avión + mapa de ruta
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapaTiempoReal } from './MapaTiempoReal';

// ── Loader avión (Uiverse) ────────────────────
const PlaneLoader = ({ texto = 'Cargando...' }) => (
  <div className="loader-overlay">
    <div className="loader-scene">
      <div className="longfazers">
        <span></span><span></span><span></span><span></span>
      </div>
      <div className="loader">
        <span>
          <span></span><span></span><span></span><span></span>
        </span>
        <div className="base">
          <span></span>
          <div className="face"></div>
        </div>
      </div>
    </div>
    <p className="loader-text">{texto}</p>
  </div>
);

// ── Estrellas ─────────────────────────────────
const Stars = ({ n = 3 }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`star ${i <= n ? '' : 'empty'}`}>★</span>
    ))}
  </div>
);

// ── Ícono flecha ──────────────────────────────
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
    <path d="M4.646 2.146a.5.5 0 0 0 0 .708L7.793 6L4.646 9.146a.5.5 0 1 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" fill="currentColor"/>
  </svg>
);

// ── Glass Card Vuelo ──────────────────────────
const VueloCard = ({ vuelo, seleccionado, onClick }) => (
  <div
    className={`glass-card ${seleccionado ? 'seleccionado' : ''}`}
    onClick={onClick}
  >
    {seleccionado && <div className="glass-card-selected-badge">✓ Seleccionado</div>}

    {/* Imagen de fondo */}
    <div className="glass-card-bg">
      <img
        src={vuelo.imagen || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80'}
        alt={vuelo.aerolinea}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80'; }}
      />
    </div>
    <div className="glass-card-color"></div>
    <div className="glass-card-orb"></div>

    {/* Panel izquierdo */}
    <div className="glass-card-left">
      <div>
        <div className="glass-card-name">{vuelo.aerolinea}</div>
        <div className="glass-card-sub">{vuelo.numeroVuelo}</div>
        <div className="vuelo-route-inline" style={{ marginTop: '0.5rem' }}>
          <span className="ap">{vuelo.origen}</span>
          <span className="line"></span>
          <span className="ap">{vuelo.destino}</span>
        </div>
        <div className="glass-card-sub" style={{ marginTop: '0.25rem' }}>
          🕐 {vuelo.duracion || '—'} · {new Date(vuelo.fechaSalida).toLocaleDateString('es-MX', { day:'2-digit', month:'short' })}
        </div>
        <div className="glass-card-sub" style={{ marginTop: '0.2rem' }}>
          💺 {vuelo.asientos} asientos
        </div>
      </div>
      <div className="glass-card-footer">
        <div>
          <div className="glass-card-price">${vuelo.precio?.toLocaleString()}</div>
          <span className="glass-card-price-label">MXN / persona</span>
        </div>
      </div>
    </div>

    {/* Panel derecho */}
    <div className="glass-card-right">
      <span className="glass-card-label">Vuelo<br/>directo</span>
      <button className="glass-card-btn" onClick={e => { e.stopPropagation(); onClick(); }}>
        <ArrowIcon />
      </button>
    </div>
  </div>
);

// ── Glass Card Hotel ──────────────────────────
const HotelCard = ({ hotel, seleccionado, onClick }) => (
  <div
    className={`glass-card ${seleccionado ? 'seleccionado' : ''}`}
    onClick={onClick}
  >
    {seleccionado && <div className="glass-card-selected-badge">✓ Seleccionado</div>}

    <div className="glass-card-bg">
      <img
        src={hotel.imagen || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'}
        alt={hotel.nombre}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'; }}
      />
    </div>
    <div className="glass-card-color" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.65) 0%, rgba(124,58,237,0.5) 100%)' }}></div>
    <div className="glass-card-orb"></div>

    <div className="glass-card-left">
      <div>
        <Stars n={hotel.estrellas || 3} />
        <div className="glass-card-name">{hotel.nombre}</div>
        <div className="glass-card-sub">📍 {hotel.ciudad} · {hotel.habitacion}</div>
        <div className="glass-amenities">
          {hotel.amenities?.slice(0, 3).map((a, i) => (
            <span key={i} className="glass-amenity-tag">{a}</span>
          ))}
        </div>
      </div>
      <div className="glass-card-footer">
        <div>
          <div className="glass-card-price">${hotel.precioPorNoche?.toLocaleString()}</div>
          <span className="glass-card-price-label">MXN / noche</span>
        </div>
      </div>
    </div>

    <div className="glass-card-right">
      <span className="glass-card-label">Hotel<br/>{hotel.estrellas || 3}★</span>
      <button className="glass-card-btn" onClick={e => { e.stopPropagation(); onClick(); }}>
        <ArrowIcon />
      </button>
    </div>
  </div>
);

// ── Componente principal ──────────────────────
export const ViajesIntegrado = ({ usuario, onReservaExitosa }) => {
  const [vuelos, setVuelos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [hotelSeleccionado, setHotelSeleccionado] = useState(null);
  const [noches, setNoches] = useState(3);
  const [cargando, setCargando] = useState(true);
  const [reservando, setReservando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [busqueda, setBusqueda] = useState({ origen: 'CDMX', destino: 'CUN', ciudad: 'CUN' });

  useEffect(() => {
    cargarTodo();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos =>
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      );
    }
  }, []);

  const cargarTodo = async () => {
    setCargando(true);
    await Promise.all([buscarVuelos(), buscarHoteles()]);
    setCargando(false);
  };

  const buscarVuelos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/viajes/vuelos', {
        params: { origen: busqueda.origen, destino: busqueda.destino }
      });
      setVuelos(res.data);
    } catch (e) { console.error(e); }
  };

  const buscarHoteles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/viajes/hoteles', {
        params: { ciudad: busqueda.ciudad }
      });
      setHoteles(res.data);
    } catch (e) { console.error(e); }
  };

  const handleBuscar = async () => {
    setCargando(true);
    await Promise.all([buscarVuelos(), buscarHoteles()]);
    setVueloSeleccionado(null);
    setHotelSeleccionado(null);
    setCargando(false);
  };

  const handleReservar = async () => {
    if (!vueloSeleccionado || !hotelSeleccionado) {
      setMensaje('⚠️ Selecciona un vuelo y un hotel para continuar');
      setTimeout(() => setMensaje(''), 4000);
      return;
    }
    setReservando(true);
    try {
      const res = await axios.post('http://localhost:5000/api/viajes/reservas', {
        usuario, vuelo: vueloSeleccionado, hotel: hotelSeleccionado, noches
      });
      setMensaje('✅ ¡Reserva creada exitosamente!');
      if (onReservaExitosa) onReservaExitosa(res.data);
      setTimeout(() => {
        setVueloSeleccionado(null);
        setHotelSeleccionado(null);
        setMensaje('');
      }, 4000);
    } catch {
      setMensaje('❌ Error al crear la reserva');
    } finally {
      setReservando(false);
    }
  };

  const total = (vueloSeleccionado?.precio || 0) + ((hotelSeleccionado?.precioPorNoche || 0) * noches);

  if (cargando) return <PlaneLoader texto="Buscando vuelos y hoteles..." />;

  return (
    <div className="page-container">
      <h1 className="page-title">Busca tu viaje</h1>
      <p className="page-subtitle">Elige tu vuelo y hotel favorito para crear el paquete perfecto</p>

      {/* Buscador */}
      <div className="card-modern">
        <h3>Filtrar búsqueda</h3>
        <div className="search-bar">
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Origen</label>
            <input className="form-input" value={busqueda.origen}
              onChange={e => setBusqueda({ ...busqueda, origen: e.target.value.toUpperCase() })}
              placeholder="Ej: CDMX, GDL, MTY" />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Destino / Ciudad</label>
            <input className="form-input" value={busqueda.destino}
              onChange={e => setBusqueda({ ...busqueda, destino: e.target.value.toUpperCase(), ciudad: e.target.value.toUpperCase() })}
              placeholder="Ej: CUN, PVR, OAX" />
          </div>
          <button className="btn-search" onClick={handleBuscar}>🔍 Buscar</button>
        </div>
      </div>

      {/* VUELOS */}
      <div className="card-modern">
        <h3>1 · Selecciona tu vuelo — {vuelos.length} disponible{vuelos.length !== 1 ? 's' : ''}</h3>
        {vuelos.length === 0 ? (
          <p style={{ color:'var(--text-muted)', textAlign:'center', padding:'2rem 0' }}>
            No hay vuelos para esa ruta. Prueba con otro origen/destino.
          </p>
        ) : (
          <div className="items-grid">
            {vuelos.map(v => (
              <VueloCard key={v._id} vuelo={v}
                seleccionado={vueloSeleccionado?._id === v._id}
                onClick={() => setVueloSeleccionado(v)} />
            ))}
          </div>
        )}
      </div>

      {/* HOTELES */}
      <div className="card-modern">
        <h3>2 · Selecciona tu hotel — {hoteles.length} disponible{hoteles.length !== 1 ? 's' : ''}</h3>
        {hoteles.length === 0 ? (
          <p style={{ color:'var(--text-muted)', textAlign:'center', padding:'2rem 0' }}>
            No hay hoteles para esa ciudad.
          </p>
        ) : (
          <div className="items-grid">
            {hoteles.map(h => (
              <HotelCard key={h._id} hotel={h}
                seleccionado={hotelSeleccionado?._id === h._id}
                onClick={() => setHotelSeleccionado(h)} />
            ))}
          </div>
        )}
      </div>

      {/* MAPA */}
      <div className="card-modern">
        <h3>
          {vueloSeleccionado
            ? `✈️ Ruta: ${vueloSeleccionado.origen} → ${vueloSeleccionado.destino}`
            : '🗺️ Mapa — selecciona un vuelo para ver su ruta'}
        </h3>
        <MapaTiempoReal lat={userCoords.lat} lng={userCoords.lng} vuelo={vueloSeleccionado} />
      </div>

      {/* RESUMEN */}
      {(vueloSeleccionado || hotelSeleccionado) && (
        <div className="card-modern">
          <h3>3 · Resumen de tu paquete</h3>
          <div style={{ marginTop:'0.75rem' }}>
            {vueloSeleccionado && (
              <div className="resumen-row">
                <span>✈️ {vueloSeleccionado.aerolinea} · {vueloSeleccionado.numeroVuelo} ({vueloSeleccionado.origen}→{vueloSeleccionado.destino})</span>
                <strong>${vueloSeleccionado.precio?.toLocaleString()}</strong>
              </div>
            )}
            {hotelSeleccionado && (
              <div className="resumen-row">
                <span>🏨 {hotelSeleccionado.nombre} · {noches} noche{noches > 1 ? 's' : ''}</span>
                <strong>${(hotelSeleccionado.precioPorNoche * noches).toLocaleString()}</strong>
              </div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.75rem 0', borderBottom:'1px solid var(--border)' }}>
              <label className="form-label" style={{ margin:0, whiteSpace:'nowrap' }}>Noches:</label>
              <select className="form-select" value={noches}
                onChange={e => setNoches(Number(e.target.value))}
                style={{ width:'120px', margin:0 }}>
                {[1,2,3,4,5,6,7,10,14].map(n => <option key={n} value={n}>{n} noche{n>1?'s':''}</option>)}
              </select>
            </div>

            <div className="resumen-total">
              <span style={{ fontSize:'1rem', color:'var(--text-muted)', fontWeight:400 }}>Total </span>
              ${total.toLocaleString()}
              <span style={{ fontSize:'0.9rem', color:'var(--text-muted)', fontWeight:400 }}> MXN</span>
            </div>

            <button className="btn-primary" onClick={handleReservar} disabled={reservando}>
              {reservando ? '⏳ Procesando...' : '🎫 Confirmar Reserva'}
            </button>

            {mensaje && (
              <div className={`alert ${mensaje.startsWith('✅') ? 'alert-success' : mensaje.startsWith('⚠️') ? 'alert-info' : 'alert-error'}`}>
                {mensaje}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};