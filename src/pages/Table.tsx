import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { exportToCSV, exportToXLSX } from '@/utils/ticketProcessor';
import { formatDateBR } from '@/utils/dateFormatter';
import Navbar from '@/components/Navbar';
import { StatusBadge } from '@/components/table/StatusBadge';
import { PriorityBadge } from '@/components/table/PriorityBadge';
import { SatisfactionBadge } from '@/components/table/SatisfactionBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table as TableUI, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, X, FileSpreadsheet, ArrowUpDown } from 'lucide-react';

const Table = () => {
  const { tickets } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [prioridadeFilter, setPrioridadeFilter] = useState('all');
  const [tecnicoFilter, setTecnicoFilter] = useState('all');
  const [departamentoFilter, setDepartamentoFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (tickets.length === 0) {
      navigate('/upload');
    }
  }, [tickets, navigate]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(tickets.map(t => t.status)));
  }, [tickets]);

  const prioridadeOptions = useMemo(() => {
    return Array.from(new Set(tickets.map(t => t.prioridade)));
  }, [tickets]);

  const tecnicoOptions = useMemo(() => {
    return Array.from(new Set(tickets.map(t => t.agenteResponsavel)));
  }, [tickets]);

  const departamentoOptions = useMemo(() => {
    return Array.from(new Set(tickets.map(t => t.departamento)));
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = searchTerm === '' || 
        Object.values(ticket).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPrioridade = prioridadeFilter === 'all' || ticket.prioridade === prioridadeFilter;
      const matchesTecnico = tecnicoFilter === 'all' || ticket.agenteResponsavel === tecnicoFilter;
      const matchesDepartamento = departamentoFilter === 'all' || ticket.departamento === departamentoFilter;

      return matchesSearch && matchesStatus && matchesPrioridade && matchesTecnico && matchesDepartamento;
    });
  }, [tickets, searchTerm, statusFilter, prioridadeFilter, tecnicoFilter, departamentoFilter]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPrioridadeFilter('all');
    setTecnicoFilter('all');
    setDepartamentoFilter('all');
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTickets, 'chamados_filtrados.csv');
  };

  const handleExportXLSX = () => {
    exportToXLSX(filteredTickets, 'chamados_filtrados.xlsx');
  };

  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tabela Completa</h1>
          <p className="text-muted-foreground">
            {filteredTickets.length} de {tickets.length} chamados
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filtros</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportXLSX}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  XLSX
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  {prioridadeOptions.map(prioridade => (
                    <SelectItem key={prioridade} value={prioridade}>{prioridade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tecnicoFilter} onValueChange={setTecnicoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Técnicos</SelectItem>
                  {tecnicoOptions.map(tecnico => (
                    <SelectItem key={tecnico} value={tecnico}>{tecnico}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Departamentos</SelectItem>
                  {departamentoOptions.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <TableUI>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Abertura</TableHead>
                    <TableHead>Fechamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>TMA</TableHead>
                    <TableHead>FRT</TableHead>
                    <TableHead>Satisfação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.dataAbertura}</TableCell>
                      <TableCell>{ticket.dataFechamento}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.prioridade}</TableCell>
                      <TableCell>{ticket.motivo}</TableCell>
                      <TableCell>{ticket.solicitante}</TableCell>
                      <TableCell>{ticket.agenteResponsavel}</TableCell>
                      <TableCell>{ticket.departamento}</TableCell>
                      <TableCell>{ticket.tma}</TableCell>
                      <TableCell>{ticket.frt}</TableCell>
                      <TableCell>{ticket.satisfacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableUI>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Table;
