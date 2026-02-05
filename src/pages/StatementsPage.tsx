import { Calendar, Eye, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useTripContext } from "../contexts/TripContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { deleteStatement, fetchStatements, viewStatementTripSummary } from "../services/statementsService";
import type { Statement } from "../types";

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [loadingStatementId, setLoadingStatementId] = useState<string>();
  const { setDayGroups, setFares, setContextStatements } = useTripContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadStatements() {
      const res = await fetchStatements();
      setStatements(res);
      setLoadingPage(false);
    }
    loadStatements();
  }, []);

  const viewTripSummary = async (statementId: string) => {
    setLoadingStatementId(statementId);
    const { dayGroups, fares } = await viewStatementTripSummary(statementId);
    setDayGroups(dayGroups);
    setFares(fares);
    setContextStatements(statements);
    navigate('/trip-summary');
    setLoadingStatementId(undefined);
  }

  const handleDelete = async (statementId: string) => {
    if (!confirm('Are you sure you want to delete this statement?')) return;
    await deleteStatement(statementId);
    const res = await fetchStatements();
    setStatements(res);
  };

  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto py-8 md:py-16">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl text-slate-900 mb-2 md:mb-3">My Transport Statements</h2>
          <p className="text-base md:text-lg text-slate-600">
            View and analyze your uploaded SimplyGo PDFs
          </p>
        </div>

        {/* Statements List */}
        <div className="space-y-4">
          {statements.length === 0 ? (
            <Card className="p-12 text-center bg-slate-50 border-slate-200">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg text-slate-600 mb-2">No statements uploaded yet</p>
              <p className="text-sm text-slate-500">Upload your first SimplyGo PDF to get started</p>
            </Card>
          ) : (
            statements.map((statement) => (
              <Card key={statement.id} className="p-4 md:p-6 bg-white border-slate-200 hover:shadow-md transition-shadow">
                {isMobile ? (
                  // Mobile Layout - Stacked
                  <div className="space-y-4">
                    {/* File Info */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base text-slate-900 font-medium truncate mb-1">
                          {statement.file_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{statement.statement_month} {statement.statement_year}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Uploaded {formatUploadDate(statement.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(statement.id.toString())}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete statement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex gap-6">
                        <div>
                          <p className="text-xs text-slate-600 mb-0.5">Total Fares</p>
                          <p className="text-base font-semibold text-slate-900">
                            ${statement.total_fare.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-0.5">Journeys</p>
                          <p className="text-base font-semibold text-slate-900">
                            {statement.journey_count}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => viewTripSummary(statement.id.toString())}
                        disabled={loadingStatementId === statement.id.toString()}
                        className="gap-1.5 px-3"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {loadingStatementId === statement.id.toString() ? 'Loading...' : 'Analyze'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Desktop Layout - Horizontal
                  <div className="flex items-center gap-4">
                    {/* PDF Icon */}
                    <div className="flex-shrink-0 p-3 bg-slate-100 rounded-lg">
                      <FileText className="w-6 h-6 text-slate-600" />
                    </div>

                    {/* Statement Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg text-slate-900 font-medium truncate">
                          {statement.file_name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 flex-shrink-0">
                          <Calendar className="w-4 h-4" />
                          <span>{statement.statement_month} {statement.statement_year}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        Uploaded {formatUploadDate(statement.created_at)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-1">Total Fares</p>
                        <p className="text-lg font-semibold text-slate-900">
                          ${statement.total_fare.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-1">Journeys</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {statement.journey_count}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => viewTripSummary(statement.id.toString())}
                        disabled={loadingStatementId === statement.id.toString()}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {loadingStatementId === statement.id.toString() ? 'Loading...' : 'Analyze'}
                      </Button>
                      <button
                        onClick={() => handleDelete(statement.id.toString())}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete statement"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}