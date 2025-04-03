import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationForm.css'; 
import api from '../api/api';


const ReservationForm = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    reservation_datetime: new Date(),
    party_size: 2,
    special_requests: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/restaurants/${restaurantId}/`);
        setRestaurant(response.data);
      } catch (err) {
        setError('Failed to load restaurant details.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, reservation_datetime: date });
  };

  const validateForm = () => {
    const errors = {};
    if (formData.reservation_datetime <= new Date()) {
      errors.reservation_datetime = 'Reservation time must be in the future';
    }
    if (!formData.party_size || formData.party_size < 1) {
      errors.party_size = 'Party size must be at least 1';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setSubmitting(true);
      setSuccessMessage('');

      try {
        await api.createReservation({
          restaurant: restaurantId,
          reservation_datetime: formData.reservation_datetime.toISOString(),
          party_size: parseInt(formData.party_size, 10),
          special_requests: formData.special_requests,
        });

        setSuccessMessage('Reservation successful! Redirecting...');
        setTimeout(() => navigate('/reservation-success'), 2000);
      } catch (err) {
        setError('Failed to create reservation. Please try again.', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) return <div className="text-center text-xl font-semibold mt-8">Loading restaurant details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <h1 className="text-2xl font-bold mb-4">Make a Reservation</h1>

        <div className="restaurant-info">
          <img 
            src={restaurant.image_url || '/placeholder.jpg'} 
            alt={restaurant.name} 
            className="restaurant-image"
          />
          <h2 className="text-lg font-semibold">{restaurant.name}</h2>
          <p className="text-gray-500">{restaurant.cuisine}</p>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date and Time:</label>
            <DatePicker
              selected={formData.reservation_datetime}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="border rounded-lg w-full py-2 px-4 text-gray-700 shadow-sm"
              minDate={new Date()}
            />
            {formErrors.reservation_datetime && <p className="error-message">{formErrors.reservation_datetime}</p>}
          </div>

          <div className="form-group">
            <label>Party Size:</label>
            <input
              type="number"
              name="party_size"
              value={formData.party_size}
              onChange={handleChange}
              min="1"
            />
            {formErrors.party_size && <p className="error-message">{formErrors.party_size}</p>}
          </div>

          <div className="form-group">
            <label>Special Requests:</label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Submitting...' : 'Book Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
