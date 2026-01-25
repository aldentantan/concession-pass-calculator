import dayjs, { Dayjs } from 'dayjs';
import type { Statement } from '../types';

export interface CoverageGap {
  start: string;
  end: string;
  daysCount: number;
}

export interface CoverageResult {
  hasGaps: boolean;
  missingDateRanges: CoverageGap[];
  confidenceLevel: 'complete' | 'partial' | 'unknown';
  coverageMessage?: string;
  totalMissingDays: number;
}

/**
 * Detects if the selected 30-day window extends beyond uploaded statement coverage.
 * This identifies when statements are missing (e.g., no November PDF uploaded),
 * NOT internal gaps within statement coverage (user may simply not have traveled).
 *
 * @param statements - Array of uploaded statements with their date ranges
 * @param startDate - Selected window start date (Dayjs)
 * @param endDate - Selected window end date (Dayjs)
 * @returns Coverage detection result with gaps and confidence level
 */
export function detectCoverageGaps(
  statements: Statement[],
  startDate: Dayjs | null,
  endDate: Dayjs | null
): CoverageResult {
  // If no dates selected or no statements, return unknown
  if (!startDate || !endDate || statements.length === 0) {
    return {
      hasGaps: false,
      missingDateRanges: [],
      confidenceLevel: 'unknown',
      totalMissingDays: 0,
    };
  }

  // Parse statement months to determine coverage
  // SimplyGo statements typically cover a full calendar month
  const statementCoverage = statements.map(stmt => {
    // statement_month is like "January", "February", etc.
    // statement_year is the year number
    const month = stmt.statement_month;
    const year = stmt.statement_year;

    // Create first and last day of the statement month
    const monthDate = dayjs(`${year}-${getMonthNumber(month)}-01`);
    const firstDay = monthDate.startOf('month');
    const lastDay = monthDate.endOf('month');

    return {
      firstDay,
      lastDay,
      statementMonth: month,
      statementYear: year,
    };
  });

  // Sort coverage periods by date
  statementCoverage.sort((a, b) => a.firstDay.diff(b.firstDay));

  const missingRanges: CoverageGap[] = [];

  // Check if window start is before first statement coverage
  const firstStatementStart = statementCoverage[0].firstDay;
  if (startDate.isBefore(firstStatementStart, 'day')) {
    const gapEnd = firstStatementStart.subtract(1, 'day');
    missingRanges.push({
      start: startDate.format('YYYY-MM-DD'),
      end: gapEnd.format('YYYY-MM-DD'),
      daysCount: gapEnd.diff(startDate, 'day') + 1,
    });
  }

  // Check for gaps between statements within the selected window
  for (let i = 0; i < statementCoverage.length - 1; i++) {
    const currentEnd = statementCoverage[i].lastDay;
    const nextStart = statementCoverage[i + 1].firstDay;

    // If there's a gap between statements (more than 1 day)
    if (nextStart.diff(currentEnd, 'day') > 1) {
      const gapStart = currentEnd.add(1, 'day');
      const gapEnd = nextStart.subtract(1, 'day');

      // Only include gap if it overlaps with our selected window
      if (gapStart.isBefore(endDate, 'day') && gapEnd.isAfter(startDate, 'day')) {
        const effectiveGapStart = gapStart.isAfter(startDate) ? gapStart : startDate;
        const effectiveGapEnd = gapEnd.isBefore(endDate) ? gapEnd : endDate;

        missingRanges.push({
          start: effectiveGapStart.format('YYYY-MM-DD'),
          end: effectiveGapEnd.format('YYYY-MM-DD'),
          daysCount: effectiveGapEnd.diff(effectiveGapStart, 'day') + 1,
        });
      }
    }
  }

  // Check if window end is after last statement coverage
  const lastStatementEnd = statementCoverage[statementCoverage.length - 1].lastDay;
  if (endDate.isAfter(lastStatementEnd, 'day')) {
    // Gap starts either from the day after last statement, or from window start if it's later
    const gapStart = startDate.isAfter(lastStatementEnd, 'day')
      ? startDate
      : lastStatementEnd.add(1, 'day');

    missingRanges.push({
      start: gapStart.format('YYYY-MM-DD'),
      end: endDate.format('YYYY-MM-DD'),
      daysCount: endDate.diff(gapStart, 'day') + 1,
    });
  }

  const totalMissingDays = missingRanges.reduce((sum, gap) => sum + gap.daysCount, 0);
  const hasGaps = missingRanges.length > 0;

  // Determine confidence level
  let confidenceLevel: 'complete' | 'partial' | 'unknown';
  if (!hasGaps) {
    confidenceLevel = 'complete';
  } else if (totalMissingDays < 30) {
    confidenceLevel = 'partial';
  } else {
    confidenceLevel = 'unknown';
  }

  // Generate coverage message
  let coverageMessage = '';
  if (hasGaps) {
    if (missingRanges.length === 1) {
      const gap = missingRanges[0];
      coverageMessage = `Your selected window includes ${gap.daysCount} day${gap.daysCount > 1 ? 's' : ''} with missing statement coverage (${gap.start} to ${gap.end}).`;
    } else {
      coverageMessage = `Your selected window includes ${totalMissingDays} days across ${missingRanges.length} gaps with missing statement coverage.`;
    }
  }

  return {
    hasGaps,
    missingDateRanges: missingRanges,
    confidenceLevel,
    coverageMessage,
    totalMissingDays,
  };
}

/**
 * Convert month name to month number (1-12)
 */
function getMonthNumber(monthName: string): number {
  const months: Record<string, number> = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12,
  };

  return months[monthName] || 1;
}
