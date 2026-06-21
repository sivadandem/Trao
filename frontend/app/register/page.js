'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../lib/validations';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Map, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data.email, data.password, data.name);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      {/* Background */}
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

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={20} color="white" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Trao
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: '20px', padding: '36px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Start planning AI-powered trips today
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="form-input"
                type="text"
                placeholder="John Doe"
                {...register('name')}
                aria-describedby="name-error"
              />
              {errors.name && <div id="name-error" className="form-error">⚠ {errors.name.message}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-describedby="email-error"
              />
              {errors.email && <div id="email-error" className="form-error">⚠ {errors.email.message}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 chars with a number"
                  style={{ paddingRight: '44px' }}
                  {...register('password')}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div id="password-error" className="form-error">⚠ {errors.password.message}</div>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm"
                  className="form-input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  style={{ paddingRight: '44px' }}
                  {...register('confirmPassword')}
                  aria-describedby="confirm-error"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                  }}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <div id="confirm-error" className="form-error">⚠ {errors.confirmPassword.message}</div>}
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : <UserPlus size={16} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* Features preview */}
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
          Free to use · AI-powered itineraries · Secure & private
        </div>
      </div>
    </div>
  );
}
