import type { Journey } from '../types';
import { apiClient } from '../utils/apiClient';

export async function extractJourneysFromPdf(file: File | null): Promise<Journey[]> {
  if (!file) {
    throw new Error('No file provided for PDF parsing');
  }
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const data = await apiClient.post('/pdf-parser', formData);
    return data.journeys;
  } catch (error) {
    console.error('Error calling PDF parsing API:', error);
    throw error;
  }
}