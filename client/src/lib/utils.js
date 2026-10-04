/**
 * Class Names Helper Utility
 * Combines clsx and tailwind-merge to safely concatenate Tailwind CSS classes.
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
