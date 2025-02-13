import React, { useState } from 'react';
import axios from 'axios';

const Booking = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [slotId, setSlotId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/appointments', { userName, email, phone, slotId })
      .then(() => alert('Appointment booked successfully'))
      .catch(() => alert('Error booking appointment'));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Your Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          onChange={(e) => setSlotId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Slot</option>
          {/* Dynamically populate slots */}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default Booking;