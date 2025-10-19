import type { ParsedTrip } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function extractTripsFromPdf(file: File): Promise<ParsedTrip[]> {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/upload-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to parse PDF: ${response.statusText}`);
    }

    const data = await response.json();
    const fullText = data.text;

    console.log('Received PDF text from backend');

    // Parse the text to extract trips
    return parseSimplyGoText(fullText);
  } catch (error) {
    console.error('Error calling PDF parsing API:', error);
    throw error;
  }
}

function parseSimplyGoText(text: string): ParsedTrip[] {
  const trips: ParsedTrip[] = [];

  if (!text || text.trim().length === 0) {
    console.warn('No text extracted from PDF');
    return trips;
  }

  // Split text into lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  console.log('Processing', lines.length, 'lines from PDF');

  // SimplyGo format patterns:
  // Line 1: Date (e.g., "03 Oct 2025")
  // Line 2: (Day) e.g., "(Fri)"
  // Line 3: Journey description (e.g., "S'goon Stn Exit C/Blk 201 - Blk 115")
  // Line 4: Time + Type + Service + Route + Fare (e.g., "07:22 PM Bus 53 S'goon Stn Exit C/Blk 201 - Blk 115 $ 1.19")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Pattern for Bus trips: "HH:MM AM/PM Bus [NUMBER] [START] - [END] $ [FARE]"
    const busMatch = line.match(/^(\d{1,2}:\d{2}\s+(?:AM|PM))\s+Bus\s+(\d+[A-Z]*)\s+(.+?)\s+-\s+(.+?)\s+\$\s*([\d.]+)$/i);

    if (busMatch) {
      // Look back to find the date (should be 2-3 lines above)
      let date = '';
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const dateMatch = lines[j].match(/^(\d{1,2}\s+\w+\s+\d{4})$/);
        if (dateMatch) {
          date = dateMatch[1];
          break;
        }
      }

      trips.push({
        date: date || 'Unknown',
        type: 'bus',
        startLocation: busMatch[3].trim(),
        endLocation: busMatch[4].trim(),
        fare: parseFloat(busMatch[5]),
        busService: busMatch[2]
      });
      continue;
    }

    // Pattern for Train/MRT trips: "HH:MM AM/PM Train [START] - [END] $ [FARE]"
    const trainMatch = line.match(/^(\d{1,2}:\d{2}\s+(?:AM|PM))\s+Train\s+(.+?)\s+-\s+(.+?)\s+\$\s*([\d.]+)$/i);

    if (trainMatch) {
      // Look back to find the date (should be 2-3 lines above)
      let date = '';
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const dateMatch = lines[j].match(/^(\d{1,2}\s+\w+\s+\d{4})$/);
        if (dateMatch) {
          date = dateMatch[1];
          break;
        }
      }

      trips.push({
        date: date || 'Unknown',
        type: 'mrt',
        startLocation: trainMatch[2].trim(),
        endLocation: trainMatch[3].trim(),
        fare: parseFloat(trainMatch[4])
      });
    }
  }

  console.log(`✅ Extracted ${trips.length} trips from PDF`);

  return trips;
}