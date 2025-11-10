/**
 * Format a date-time string to a human-readable format
 */
export const formatDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Calculate duration between two date-time strings
 */
export const calculateDuration = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export interface LicenseProgress {
  isEligible: boolean;
  daysRemaining: number;
  age: number;
}

/**
 * Calculate days until user turns 16 and license eligibility
 */
export const calculateLicenseProgress = (
  birthdate?: string
): LicenseProgress | null => {
  if (!birthdate) {
    return null;
  }

  const today = new Date();
  const birthDate = new Date(birthdate);

  // Calculate 16th birthday
  const sixteenthBirthday = new Date(birthDate);
  sixteenthBirthday.setFullYear(birthDate.getFullYear() + 16);

  // Calculate age in years
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // If already 16 or older
  if (age >= 16) {
    return {
      isEligible: true,
      daysRemaining: 0,
      age,
    };
  }

  // Calculate days remaining until 16th birthday
  const diffTime = sixteenthBirthday.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isEligible: false,
    daysRemaining,
    age,
  };
};
