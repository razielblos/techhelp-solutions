const satisfactionColors: Record<string, string> = {
  'ruim': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'regular': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'médio': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'bom': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'excelente': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export const SatisfactionBadge = ({ satisfaction }: { satisfaction: string }) => {
  const colorClass = satisfactionColors[satisfaction.toLowerCase()] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
      {satisfaction}
    </span>
  );
};
