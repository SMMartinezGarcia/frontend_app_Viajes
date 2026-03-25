// RegistroManual.jsx — TravelOne Premium Dark
import { useState } from 'react';
import axios from 'axios';

export const RegistroManual = ({ onRegistroExitoso }) => {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/registro`, form);
      setMensaje({ texto: '¡Registro exitoso! Redirigiendo...', tipo: 'success' });
      setTimeout(() => onRegistroExitoso(res.data.usuario), 1500);
    } catch (error) {
      setMensaje({ texto: error.response?.data?.error || 'Error al registrarse', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
        Crear cuenta
      </p>
      <h2 className="login-title" style={{ fontSize: '1.6rem' }}>Regístrate</h2>
      <p className="login-subtitle">Únete a TravelOne y empieza a explorar el mundo</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input className="form-input" name="nombre" placeholder="Tu nombre" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input className="form-input" name="email" type="email" placeholder="correo@ejemplo.com" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input className="form-input" name="telefono" placeholder="+52 000 000 0000" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input className="form-input" name="password" type="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'error'}`} style={{ marginTop: '1rem' }}>
          {mensaje.tipo === 'success' ? '✅' : '❌'} {mensaje.texto}
        </div>
      )}
    </div>
  );
};