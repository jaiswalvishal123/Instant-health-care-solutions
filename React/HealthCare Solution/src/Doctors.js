import React, { useState } from 'react';
import { doctorsData } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal';
import { useApp } from '../context/AppContext';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const { setBookingModal, setSelectedDoctor } = useApp();

  const specialties = [...new Set(doctorsData.map(doctor => doctor.specialty))];

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingModal(true);
  };

  return (
    <div className="doctors-page">
      <div className="container">
        <div className="page-header">
          <h1>Find the Best Doctors</h1>
          <p>Book appointments with experienced healthcare professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          
          <select 
            value={selectedSpecialty} 
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>

        {/* Doctors Grid */}
        <div className="doctors-grid">
          {filteredDoctors.map(doctor => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor} 
              onBookAppointment={() => handleBookAppointment(doctor)}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="no-results">
            <i className="fas fa-user-md"></i>
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}

        <BookingModal />
      </div>
    </div>
  );
};

export default Doctors;