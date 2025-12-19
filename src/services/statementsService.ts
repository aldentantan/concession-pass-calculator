import { apiClient } from "../utils/apiClient";
import { supabase } from "../supabase";

export async function fetchStatements() {
    const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

    const response = await apiClient.get("/statements", { userId });
    console.log(response)
    return response.statements;
}

export async function deleteStatement(statementId: string) {
    const response = await apiClient.delete(`/statements/${statementId}`);
    return response;
}