import type { Journey, ConcessionFareResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function calculateFaresOnConcession(
  journeys: Journey[]
): Promise<ConcessionFareResponse> {
  try {
    const response = await fetch(
      `${API_URL}/concession-fare-calculator/calculate-fares`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ journeys }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to calculate fares");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error calculating fares: ${error}`);
  }
}
