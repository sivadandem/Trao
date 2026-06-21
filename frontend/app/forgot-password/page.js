'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../lib/validations';
import { authService } from '../../services/authService';
import { useState } from 'react';
import { Map, Sparkles, ArrowRight, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Map size={20} color="white" />
            </div>
            <span
              style={{
                fontSize: '24px', fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              Trao
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: '20px', padding: '36px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Forgot Password
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              ⚠ {error}
            </div>
          )}

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div className="alert alert-success" style={{ marginBottom: '24px', textAlign: 'left' }}>
                ✓ If that email is registered in our system, we have generated a password reset link. Please check your developer console logs to access the reset link.
              </div>
              <Link
                href="/login"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', textDecoration: 'none' }}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="forgot-email"
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    style={{ paddingLeft: '40px' }}
                    {...register('email')}
                    aria-describedby="forgot-email-error"
                  />
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
                {errors.email && (
                  <div id="forgot-email-error" className="form-error">⚠ {errors.email.message}</div>
                )}
              </div>

              <button
                type="submit"
                id="forgot-submit-btn"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '12px' }}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : <Mail size={16} />}
                {loading ? 'Sending Request...' : 'Send Reset Link'}
                {!loading && <ArrowRight size={14} />}
              </button>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
                <Link href="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Features note */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <Sparkles size={14} color="#818cf8" />
          Secure JWT authentication · Reset expires in 10 minutes
        </div>
      </div>
    </div>
  );
}
