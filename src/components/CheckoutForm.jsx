// CheckoutForm.jsx — TravelOne Premium
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#f0f4ff',
      fontFamily: '"DM Sans", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': { color: '#3d4f70' },
      iconColor: '#3b82f6',
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
  },
};

export const CheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    } catch (err) {
      setError('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
        Acceso premium
      </p>
      <h2 className="checkout-title">Activa tu cuenta</h2>
      <p className="checkout-subtitle">Pago único para acceder a todas las funciones de TravelOne</p>

      {/* Price display */}
      <div className="price-display">
        <div>
          <div className="price-label">Plan Premium</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Acceso de por vida · Soporte incluido
          </div>
        </div>
        <div className="price-amount">$20</div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {['✈️ Búsqueda de vuelos', '🏨 Reserva de hoteles', '🗺️ Mapa en tiempo real', '📋 Historial completo'].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '0.5rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            {f}
          </div>
        ))}
      </div>

      {/* Stripe card */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Datos de tarjeta</label>
          <div className="stripe-wrapper">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {error && (
          <div className="alert alert-error">❌ {error}</div>
        )}

        <button type="submit" className="btn-primary" disabled={!stripe || loading} style={{ marginTop: '1.25rem' }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, margin: 0 }}></span>
              Procesando...
            </span>
          ) : '🔒 Pagar $20.00 USD'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Pago seguro con cifrado SSL · Powered by Stripe
        </p>
      </form>

      {/* Flip card decorativa */}
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="card-chip"></div>
              <div className="card-brand">MASTERCARD</div>
            </div>
            <div className="card-number">•••• •••• •••• ••••</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Titular</span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Válida hasta</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>TravelOne User</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>••/••</span>
            </div>
          </div>
          <div className="flip-card-back">
            <div className="card-stripe"></div>
            <div className="card-sig">
              <span className="card-cvv">•••</span>
            </div>
            <p style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              Este es un entorno de prueba · No ingreses datos reales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};