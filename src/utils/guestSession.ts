export function hasUsedGuestUpload(): boolean {
  return localStorage.getItem('guest_upload_used') !== null;
}

export function markGuestUploadUsed(): void {
  localStorage.setItem('guest_upload_used', 'true');
}

export function clearGuestSession(): void {
  localStorage.removeItem('guest_upload_used');
  sessionStorage.removeItem('day_groups');
}

export function storeDayGroups(dayGroups: object[]): void {
  sessionStorage.setItem('day_groups', JSON.stringify(dayGroups));
}

export function getDayGroups(): object[] {
  const raw = sessionStorage.getItem('day_groups');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
