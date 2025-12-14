import type { Journey } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function extractJourneysFromPdf(file: File | null): Promise<Journey[]> {
  if (!file) {
    throw new Error('No file provided for PDF parsing');
  }
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/pdf-parser`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to parse PDF');
    }

    const data = await response.json();

    return data.journeys;
  } catch (error) {
    console.error('Error calling PDF parsing API:', error);
    throw error;
  }
}