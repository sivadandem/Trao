'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../lib/validations';
import { authService } from '../../services/authService';
import { Map, Eye, EyeOff, Key, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      setError('Reset token is missing. Please request a new password reset link.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass" style={{ borderRadius: '20px', padding: '36px', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ marginBottom: '24px', textAlign: 'left' }}>
          ⚠ Invalid Password Reset Link. The token query parameter is missing. Please request a new link.
        </div>
        <Link
          href="/forgot-password"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="glass" style={{ borderRadius: '20px', padding: '36px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Reset Password
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Please choose your new password.
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
            ✓ Your password has been successfully reset! You can now log in with your new password.
          </div>
          <Link
            href="/login"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', textDecoration: 'none' }}
          >
            Go to Login
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reset-password">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-password"
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 chars, 1 number"
                style={{ paddingRight: '44px', paddingLeft: '40px' }}
                {...register('password')}
                aria-describedby="reset-password-error"
              />
              <Key
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
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
              <div id="reset-password-error" className="form-error">⚠ {errors.password.message}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reset-confirm-password">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-confirm-password"
                className="form-input"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                style={{ paddingRight: '44px', paddingLeft: '40px' }}
                {...register('confirmPassword')}
                aria-describedby="reset-confirm-password-error"
              />
              <Key
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                }}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div id="reset-confirm-password-error" className="form-error">⚠ {errors.confirmPassword.message}</div>
            )}
          </div>

          <button
            type="submit"
            id="reset-submit-btn"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <Key size={16} />}
            {loading ? 'Resetting Password...' : 'Reset Password'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense fallback={
          <div className="glass" style={{ borderRadius: '20px', padding: '36px', textAlign: 'center' }}>
            <span className="spinner" />
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading password reset form...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

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
