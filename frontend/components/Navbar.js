'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Map, LayoutDashboard, Plane, LogOut, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('trao_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('trao_theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/trips', label: 'My Trips', icon: Plane },
  ];

  return (
    <nav
      style={{
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="content-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link href={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Map size={18} color="white" />
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Trao
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname === href ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          {mounted ? (
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#818cf8' }} />}
            </button>
          ) : (
            <div style={{ width: '38px', height: '38px' }} />
          )}

          {isAuthenticated ? (
            <>
              {/* User avatar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}
                  className="hidden-mobile"
                >
                  {user?.name || user?.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                aria-label="Logout"
              >
                <LogOut size={14} />
                <span className="hidden-mobile">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
                <Sparkles size={14} />
                Get Started
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-secondary show-mobile"
              style={{ padding: '8px', minWidth: 'unset' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isAuthenticated && mobileOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(99,102,241,0.15)',
            padding: '12px 24px',
          }}
        >
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`nav-link ${pathname === href ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                marginBottom: '4px',
                textDecoration: 'none',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
