'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validations';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Map, Eye, EyeOff, LogIn, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
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
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Sign in to continue planning your adventures
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-describedby="login-email-error"
              />
              {errors.email && (
                <div id="login-email-error" className="form-error">⚠ {errors.email.message}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  style={{ paddingRight: '44px' }}
                  {...register('password')}
                  aria-describedby="login-password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div id="login-password-error" className="form-error">⚠ {errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : <LogIn size={16} />}
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
              Create one free
            </Link>
          </div>
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
          AI-powered travel planning · Secure JWT authentication
        </div>
      </div>
    </div>
  );
}
