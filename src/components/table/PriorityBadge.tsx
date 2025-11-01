const priorityColors: Record<string, string> = {
  'baixa': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'média': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'alta': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'urgente': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const colorClass = priorityColors[priority.toLowerCase()] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
      {priority}
    </span>
  );
};
