import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/slots')
      .then(response => setSlots(response.data))
      .catch(error => {
        console.error('Error fetching slots:', error);
        setError('Failed to fetch slots. Please try again later.');
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Time Slots</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {slots.length > 0 ? (
            slots.map(slot => (
              <li key={slot.id} className="p-4 bg-gray-100 rounded-lg">
                {slot.date} at {slot.time}
              </li>
            ))
          ) : (
            <p>No available slots at the moment.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Home;