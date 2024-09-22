import axios from 'axios';

export const geocodeAddress = async (address: string) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: address,
      format: 'json',
    },
  });

  if (response.data.length === 0) {
    throw new Error('Failed to fetch coordinates');
  }

  const { lat, lon } = response.data[0];
  return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
};
