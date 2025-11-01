import * as XLSX from 'xlsx';
import { Ticket, DashboardStats, ChartData } from '@/types/ticket';

const REQUIRED_FIELDS = [
  'ID do Chamado',
  'Data de Abertura',
  'Data de Fechamento',
  'Status',
  'Prioridade',
  'Motivo',
  'Solução',
  'Solicitante',
  'Agente Responsável',
  'Departamento',
  'TMA (minutos)',
  'FRT (minutos)',
  'Satisfação do Cliente'
];

export const validateFields = (data: any[]): { valid: boolean; missing: string[] } => {
  if (!data || data.length === 0) {
    return { valid: false, missing: REQUIRED_FIELDS };
  }

  const headers = Object.keys(data[0]);
  const missing = REQUIRED_FIELDS.filter(field => !headers.includes(field));

  return {
    valid: missing.length === 0,
    missing
  };
};

export const parseSpreadsheet = async (file: File): Promise<Ticket[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const validation = validateFields(jsonData);
        if (!validation.valid) {
          reject(new Error(`Campos obrigatórios faltando: ${validation.missing.join(', ')}`));
          return;
        }

        const tickets: Ticket[] = jsonData.map((row: any) => ({
          id: String(row['ID do Chamado']),
          dataAbertura: row['Data de Abertura'],
          dataFechamento: row['Data de Fechamento'],
          status: row['Status'],
          prioridade: row['Prioridade'],
          motivo: row['Motivo'],
          solucao: row['Solução'],
          solicitante: row['Solicitante'],
          agenteResponsavel: row['Agente Responsável'],
          departamento: row['Departamento'],
          tma: Number(row['TMA (minutos)']),
          frt: Number(row['FRT (minutos)']),
          satisfacao: Number(row['Satisfação do Cliente'])
        }));

        resolve(tickets);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

export const calculateStats = (tickets: Ticket[]): DashboardStats => {
  const totalChamados = tickets.length;
  const chamadosEncerrados = tickets.filter(t => t.status.toLowerCase() === 'encerrado' || t.status.toLowerCase() === 'fechado').length;
  
  const tempoMedioResolucao = tickets.reduce((sum, t) => sum + t.tma, 0) / totalChamados;
  const satisfacaoMedia = tickets.reduce((sum, t) => sum + t.satisfacao, 0) / totalChamados;
  const mediaTMA = tickets.reduce((sum, t) => sum + t.tma, 0) / totalChamados;
  const mediaFRT = tickets.reduce((sum, t) => sum + t.frt, 0) / totalChamados;
  
  const tecnicosChamados: { [key: string]: number } = {};
  tickets.forEach(t => {
    tecnicosChamados[t.agenteResponsavel] = (tecnicosChamados[t.agenteResponsavel] || 0) + 1;
  });
  
  const tecnicoMaisProdutivo = Object.entries(tecnicosChamados).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const taxaResolucao = (chamadosEncerrados / totalChamados) * 100;

  return {
    totalChamados,
    tempoMedioResolucao: Math.round(tempoMedioResolucao),
    satisfacaoMedia: Math.round(satisfacaoMedia * 10) / 10,
    tecnicoMaisProdutivo,
    taxaResolucao: Math.round(taxaResolucao * 10) / 10,
    mediaTMA: Math.round(mediaTMA),
    mediaFRT: Math.round(mediaFRT)
  };
};

export const getChartData = (tickets: Ticket[]): ChartData => {
  const chamadosPorTecnico: { [key: string]: number } = {};
  const chamadosPorMotivo: { [key: string]: number } = {};
  const chamadosPorPrioridade: { [key: string]: number } = {};
  const chamadosPorDepartamento: { [key: string]: number } = {};

  tickets.forEach(ticket => {
    chamadosPorTecnico[ticket.agenteResponsavel] = (chamadosPorTecnico[ticket.agenteResponsavel] || 0) + 1;
    chamadosPorMotivo[ticket.motivo] = (chamadosPorMotivo[ticket.motivo] || 0) + 1;
    chamadosPorPrioridade[ticket.prioridade] = (chamadosPorPrioridade[ticket.prioridade] || 0) + 1;
    chamadosPorDepartamento[ticket.departamento] = (chamadosPorDepartamento[ticket.departamento] || 0) + 1;
  });

  const evolucaoMensal: { mes: string; total: number }[] = [];

  return {
    chamadosPorTecnico,
    chamadosPorMotivo,
    chamadosPorPrioridade,
    chamadosPorDepartamento,
    evolucaoMensal
  };
};

export const exportToCSV = (tickets: Ticket[], filename: string = 'export.csv') => {
  const headers = REQUIRED_FIELDS;
  const rows = tickets.map(t => [
    t.id,
    t.dataAbertura,
    t.dataFechamento,
    t.status,
    t.prioridade,
    t.motivo,
    t.solucao,
    t.solicitante,
    t.agenteResponsavel,
    t.departamento,
    t.tma,
    t.frt,
    t.satisfacao
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportToXLSX = (tickets: Ticket[], filename: string = 'export.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(tickets.map(t => ({
    'ID do Chamado': t.id,
    'Data de Abertura': t.dataAbertura,
    'Data de Fechamento': t.dataFechamento,
    'Status': t.status,
    'Prioridade': t.prioridade,
    'Motivo': t.motivo,
    'Solução': t.solucao,
    'Solicitante': t.solicitante,
    'Agente Responsável': t.agenteResponsavel,
    'Departamento': t.departamento,
    'TMA (minutos)': t.tma,
    'FRT (minutos)': t.frt,
    'Satisfação do Cliente': t.satisfacao
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Chamados');
  XLSX.writeFile(wb, filename);
};
