import React, { createContext, useContext, useReducer, useState } from 'react';

const AppContext = createContext();

const initialState = {
  appointments: [],
  user: null,
  cart: [],
  selectedDoctor: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, action.payload]
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    case 'SET_DOCTOR':
      return {
        ...state,
        selectedDoctor: action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [bookingModal, setBookingModal] = useState(false);

  const bookAppointment = (appointmentData) => {
    const appointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    return appointment;
  };

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const value = {
    ...state,
    dispatch,
    bookAppointment,
    addToCart,
    bookingModal,
    setBookingModal
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};