import React from 'react';
import { Link } from 'react-router-dom';
import { doctorsData, servicesData } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
  const featuredDoctors = doctorsData.slice(0, 3);
  const featuredServices = servicesData.slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Your Health is Our Priority</h1>
            <p>24/7 healthcare services at your fingertips. Consult with top doctors, order medicines, and get lab tests from the comfort of your home.</p>
            <div className="hero-buttons">
              <Link to="/doctors" className="btn btn-primary">
                <i className="fas fa-user-md"></i>
                Find Doctors
              </Link>
              <Link to="/services" className="btn btn-secondary">
                <i className="fas fa-video"></i>
                Video Consult
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=600&fit=crop" alt="Healthcare" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/services" className="btn btn-outline">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors-section">
        <div className="container">
          <h2>Featured Doctors</h2>
          <div className="doctors-grid">
            {featuredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/doctors" className="btn btn-outline">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Service</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;