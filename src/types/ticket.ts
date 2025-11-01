export interface Ticket {
  id: string;
  dataAbertura: string;
  dataFechamento: string;
  status: string;
  prioridade: string;
  motivo: string;
  solucao: string;
  solicitante: string;
  agenteResponsavel: string;
  departamento: string;
  tma: number;
  frt: number;
  satisfacao: string; // Categoria: Ruim, Regular, Médio, Bom, Excelente
}

export interface DashboardStats {
  totalChamados: number;
  chamadosAbertos: number;
  chamadosEncerrados: number;
  tempoMedioResolucao: number;
  satisfacaoDistribuicao: {
    Ruim: number;
    Regular: number;
    Médio: number;
    Bom: number;
    Excelente: number;
  };
  tecnicoMaisProdutivo: string;
  chamadosTecnicoTop: number;
  prioridadeAltaUrgente: number;
  taxaResolucao: number;
  mediaTMA: number;
  mediaFRT: number;
}

export interface ChartData {
  chamadosPorTecnico: { [key: string]: number };
  chamadosPorMotivo: { [key: string]: number };
  chamadosPorPrioridade: { [key: string]: number };
  chamadosPorDepartamento: { [key: string]: number };
  evolucaoMensal: { mes: string; total: number }[];
}
