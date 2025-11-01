import React, { createContext, useContext, useState } from 'react';
import { Ticket } from '@/types/ticket';

interface DataContextType {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  clearTickets: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const clearTickets = () => {
    setTickets([]);
  };

  return (
    <DataContext.Provider value={{ tickets, setTickets, clearTickets }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
