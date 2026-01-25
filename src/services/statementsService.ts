import { apiClient } from "../utils/apiClient";
import { supabase } from "../supabase";

export async function fetchStatements() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const response = await apiClient.get("/statements", { userId });
  return response.statements;
}

export async function deleteStatement(statementId: string) {
  const response = await apiClient.delete(`/statements/${statementId}`);
  return response;
}

export async function viewStatementTripSummary(statementId: string) {
  const response = await apiClient.get(`/statements/${statementId}/trip-summary`);
  return response;
}

export async function createSignedLink(statementId: string) {
  const response = await apiClient.get(`/statements/${statementId}/create-signed-link`);
  return response;
}

export async function reanalyseStatement(statementId: string) {
  const response = await apiClient.post(`/statements/${statementId}/reanalyse`, {});
  return response;
}

export async function fetchTripsInDateRange(startDate: string, endDate: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  console.log('📡 Calling API with:', { userId, startDate, endDate });

  const response = await apiClient.get("/statements/trips/range", {
    userId,
    startDate,
    endDate,
  });

  console.log('📦 Raw API response:', response);

  return response;
}