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