const statusColors: Record<string, string> = {
  'aberto': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'em andamento': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'pendente': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'fechado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'encerrado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

export const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};
