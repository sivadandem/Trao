'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { tripService } from '../services/tripService';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchTrips = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getTrips(params);
      setTrips(data.data.trips);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTripById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getTripById(id);
      setCurrentTrip(data.data.trip);
      return data.data.trip;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trip');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTrip = useCallback(async (formData) => {
    setGenerating(true);
    setError(null);
    try {
      const data = await tripService.generateTrip(formData);
      const newTrip = data.data.trip;
      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate trip');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  const deleteTrip = useCallback(async (id) => {
    try {
      await tripService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      if (currentTrip?._id === id) setCurrentTrip(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trip');
    }
  }, [currentTrip]);

  const updateCurrentTrip = useCallback((updatedTrip) => {
    setCurrentTrip(updatedTrip);
    setTrips((prev) =>
      prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t))
    );
  }, []);

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        loading,
        generating,
        error,
        pagination,
        setError,
        fetchTrips,
        fetchTripById,
        generateTrip,
        deleteTrip,
        updateCurrentTrip,
        setCurrentTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
