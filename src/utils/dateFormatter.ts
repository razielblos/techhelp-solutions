export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  
  // Parse ISO date format: 2024-06-11 22:01:27
  const [datePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  
  return `${day}/${month}/${year}`;
};
