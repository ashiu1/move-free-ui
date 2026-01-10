const SAMPLE_URL = 'http://127.0.0.1:5000';

export const getExerciseData = async (url: string) => {
  try {
    const response = await fetch(`${SAMPLE_URL}/exercises?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercise data:', error);
    throw error;
  }
};

export const postFitnessVideo = async (url: string) => {
  try {
    const response = await fetch(`${SAMPLE_URL}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercise data:', error);
    throw error;
  }
};