import type { Journey } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function extractJourneysFromPdf(file: File): Promise<Journey[]> {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/pdf-parser`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to parse PDF: ${response.statusText}`);
    }

    const data = await response.json();

    return data.journeys;
  } catch (error) {
    console.error('Error calling PDF parsing API:', error);
    throw error;
  }
}