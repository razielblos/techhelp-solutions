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
  const [satisfacaoFilter, setSatisfacaoFilter] = useState('all');
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

  const satisfacaoOptions = useMemo(() => {
    return Array.from(new Set(tickets.map(t => t.satisfacao)));
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = searchTerm === '' || 
        Object.values(ticket).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPrioridade = prioridadeFilter === 'all' || ticket.prioridade === prioridadeFilter;
      const matchesTecnico = tecnicoFilter === 'all' || ticket.agenteResponsavel === tecnicoFilter;
      const matchesDepartamento = departamentoFilter === 'all' || ticket.departamento === departamentoFilter;
      const matchesSatisfacao = satisfacaoFilter === 'all' || ticket.satisfacao === satisfacaoFilter;

      return matchesSearch && matchesStatus && matchesPrioridade && matchesTecnico && matchesDepartamento && matchesSatisfacao;
    });

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn as keyof typeof a];
        const bValue = b[sortColumn as keyof typeof b];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [tickets, searchTerm, statusFilter, prioridadeFilter, tecnicoFilter, departamentoFilter, satisfacaoFilter, sortColumn, sortDirection]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

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
    setSatisfacaoFilter('all');
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
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

              <Select value={satisfacaoFilter} onValueChange={setSatisfacaoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Satisfação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Satisfações</SelectItem>
                  {satisfacaoOptions.map(satisfacao => (
                    <SelectItem key={satisfacao} value={satisfacao}>{satisfacao}</SelectItem>
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
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {sortColumn === 'id' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('dataAbertura')}
                    >
                      <div className="flex items-center gap-2">
                        Abertura
                        {sortColumn === 'dataAbertura' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('dataFechamento')}
                    >
                      <div className="flex items-center gap-2">
                        Fechamento
                        {sortColumn === 'dataFechamento' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortColumn === 'status' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('prioridade')}
                    >
                      <div className="flex items-center gap-2">
                        Prioridade
                        {sortColumn === 'prioridade' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('motivo')}
                    >
                      <div className="flex items-center gap-2">
                        Motivo
                        {sortColumn === 'motivo' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('solicitante')}
                    >
                      <div className="flex items-center gap-2">
                        Solicitante
                        {sortColumn === 'solicitante' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('agenteResponsavel')}
                    >
                      <div className="flex items-center gap-2">
                        Técnico
                        {sortColumn === 'agenteResponsavel' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('departamento')}
                    >
                      <div className="flex items-center gap-2">
                        Departamento
                        {sortColumn === 'departamento' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('tma')}
                    >
                      <div className="flex items-center gap-2">
                        TMA (min)
                        {sortColumn === 'tma' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('frt')}
                    >
                      <div className="flex items-center gap-2">
                        FRT (min)
                        {sortColumn === 'frt' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('satisfacao')}
                    >
                      <div className="flex items-center gap-2">
                        Satisfação
                        {sortColumn === 'satisfacao' && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{formatDateBR(ticket.dataAbertura)}</TableCell>
                      <TableCell>{formatDateBR(ticket.dataFechamento)}</TableCell>
                      <TableCell><StatusBadge status={ticket.status} /></TableCell>
                      <TableCell><PriorityBadge priority={ticket.prioridade} /></TableCell>
                      <TableCell>{ticket.motivo}</TableCell>
                      <TableCell>{ticket.solicitante}</TableCell>
                      <TableCell>{ticket.agenteResponsavel}</TableCell>
                      <TableCell>{ticket.departamento}</TableCell>
                      <TableCell>{ticket.tma}</TableCell>
                      <TableCell>{ticket.frt}</TableCell>
                      <TableCell><SatisfactionBadge satisfaction={ticket.satisfacao} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableUI>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Resultados por página:
                </span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTickets.length)} de {filteredTickets.length} resultados
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 7) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 4) {
                        pageNumber = i < 5 ? i + 1 : i === 5 ? -1 : totalPages;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = i === 0 ? 1 : i === 1 ? -1 : totalPages - 6 + i;
                      } else {
                        if (i === 0) pageNumber = 1;
                        else if (i === 1) pageNumber = -1;
                        else if (i === 5) pageNumber = -1;
                        else if (i === 6) pageNumber = totalPages;
                        else pageNumber = currentPage - 3 + i;
                      }

                      if (pageNumber === -1) {
                        return <span key={`ellipsis-${i}`} className="px-2">...</span>;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-9"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Table;
