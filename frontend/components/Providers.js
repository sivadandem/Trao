'use client';

import { AuthProvider } from '../context/AuthContext';
import { TripProvider } from '../context/TripContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <TripProvider>
        {children}
      </TripProvider>
    </AuthProvider>
  );
}
