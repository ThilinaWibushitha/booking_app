import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('/api/appointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booked Appointments</h1>
      <ul className="space-y-2">
        {appointments.map(appointment => (
          <li key={appointment.id} className="p-4 bg-gray-100 rounded-lg">
            {appointment.user_name} - {appointment.email} - {appointment.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;