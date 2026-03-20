import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const BookingModal = () => {
  const { bookingModal, setBookingModal, selectedDoctor, bookAppointment } = useApp();
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    symptoms: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const appointment = {
      doctor: selectedDoctor,
      ...formData,
      appointmentId: `APP${Date.now()}`
    };

    bookAppointment(appointment);
    
    // Send confirmation (you can integrate with backend here)
    alert(`Appointment booked successfully! ID: ${appointment.appointmentId}`);
    
    setBookingModal(false);
    setFormData({
      patientName: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      symptoms: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!bookingModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setBookingModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={() => setBookingModal(false)}>
          &times;
        </button>

        <h2>Book Appointment</h2>
        
        {selectedDoctor && (
          <div className="doctor-info">
            <h3>Dr. {selectedDoctor.name}</h3>
            <p>{selectedDoctor.specialty}</p>
            <p>Fee: ₹{selectedDoctor.fees}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Patient Name *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;