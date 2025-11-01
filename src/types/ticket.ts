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
  satisfacao: number;
}

export interface DashboardStats {
  totalChamados: number;
  tempoMedioResolucao: number;
  satisfacaoMedia: number;
  tecnicoMaisProdutivo: string;
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
