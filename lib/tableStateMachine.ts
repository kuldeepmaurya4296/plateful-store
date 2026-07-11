import { TableStatus } from './types';

const VALID_TRANSITIONS: Record<TableStatus, TableStatus[]> = {
  available: ['occupied'],
  occupied: ['billing', 'available'], // 'available' is for reset/cancellation
  billing: ['settling', 'occupied'], // 'occupied' is to go back and add more items
  settling: ['available', 'billing'] // 'billing' is if payment fails/cancels
};

export function validateTableTransition(
  fromStatus: TableStatus,
  toStatus: TableStatus
): { isValid: boolean; errorMessage?: string } {
  if (fromStatus === toStatus) {
    return { isValid: true };
  }

  const allowed = VALID_TRANSITIONS[fromStatus] || [];
  if (allowed.includes(toStatus)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errorMessage: `Invalid table state transition from '${fromStatus}' to '${toStatus}'.`
  };
}
