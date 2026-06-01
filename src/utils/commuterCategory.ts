import type { FareCommuterType, UploadCommuterCategory } from '../types';

export const COMMUTER_CATEGORY_OPTIONS: Array<{
  value: UploadCommuterCategory;
  label: string;
}> = [
  { value: 'adult', label: 'Adult' },
  { value: 'undergrad', label: 'Undergrad' },
  { value: 'student', label: 'Student' },
];

export function getFareCommuterType(
  commuterCategory: UploadCommuterCategory,
): FareCommuterType {
  return commuterCategory === 'student' ? 'student' : 'adult';
}

export function getDefaultPassCategory(
  commuterCategory: UploadCommuterCategory | null,
): string {
  switch (commuterCategory) {
    case 'adult':
      return 'adult';
    case 'student':
      return 'primary-sch-student';
    case 'undergrad':
      return 'undergrad';
    default:
      return 'adult'
  }
}

export function isUploadCommuterCategory(
  value: unknown,
): value is UploadCommuterCategory {
  return value === 'adult' || value === 'undergrad' || value === 'student';
}
