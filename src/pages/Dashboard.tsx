import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { calculateStats, getChartData } from '@/utils/ticketProcessor';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/dashboard/StatsCard';
import SatisfactionChart from '@/components/dashboard/SatisfactionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Dashboard = () => {
  const { tickets } = useData();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (tickets.length === 0) {
      navigate('/upload');
    }
  }, [tickets, navigate]);

  const stats = useMemo(() => {
    if (tickets.length === 0) return null;
    return calculateStats(tickets);
  }, [tickets]);

  const chartData = useMemo(() => {
    if (tickets.length === 0) return null;
    return getChartData(tickets);
  }, [tickets]);

  if (!stats || !chartData) {
    return null;
  }

  // Preparar dados para gráfico de técnicos - Top 10, ordenado decrescente
  const tecnicosEntries = Object.entries(chartData.chamadosPorTecnico)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const tecnicosLabels = tecnicosEntries.map(([name]) => name);
  const tecnicosData = tecnicosEntries.map(([, count]) => count);

  const barChartData = {
    labels: tecnicosLabels,
    datasets: [
      {
        label: 'Chamados',
        data: tecnicosData,
        backgroundColor: 'hsl(214, 95%, 36%)',
        borderRadius: 8,
      },
    ],
  };

  // Descrição automática do gráfico de técnicos
  const tecnicoDescricao = tecnicosEntries.length > 0
    ? `${tecnicosEntries[0][0]} lidera com ${tecnicosEntries[0][1]} chamados resolvidos${
        tecnicosEntries.length > 1 ? `, seguido por ${tecnicosEntries[1][0]} com ${tecnicosEntries[1][1]}.` : '.'
      }`
    : '';

  // Gerar paleta monocromática de azuis
  const generateBluesPalette = (count: number) => {
    const baseHue = 214;
    const colors: string[] = [];
    const steps = Math.max(1, count);
    for (let i = 0; i < count; i++) {
      const lightness = 30 + (i * (60 / steps)); // De mais escuro para mais claro
      colors.push(`hsl(${baseHue}, 85%, ${lightness}%)`);
    }
    return colors;
  };

  // Preparar dados para gráfico de pizza - paleta monocromática azul
  const motivosEntries = Object.entries(chartData.chamadosPorMotivo);
  const motivosLabels = motivosEntries.map(([name]) => name);
  const motivosData = motivosEntries.map(([, count]) => count);

  const pieChartData = {
    labels: motivosLabels,
    datasets: [
      {
        data: motivosData,
        backgroundColor: generateBluesPalette(motivosLabels.length),
        borderWidth: 2,
        borderColor: 'hsl(var(--card))',
      },
    ],
  };

  // Descrição automática do gráfico de pizza
  const motivoTop = motivosEntries.length > 0 ? motivosEntries.sort((a, b) => b[1] - a[1])[0] : null;
  const motivoDescricao = motivoTop
    ? `${motivoTop[0]} é o motivo mais comum (${motivoTop[1]} ocorrências), representando ${Math.round((motivoTop[1] / stats.totalChamados) * 100)}% dos chamados.`
    : '';

  // Gráfico de evolução mensal
  const evolucaoLabels = chartData.evolucaoMensal.map(d => d.mes);
  const evolucaoData = chartData.evolucaoMensal.map(d => d.total);

  const evolucaoChartData = {
    labels: evolucaoLabels,
    datasets: [
      {
        label: 'Chamados',
        data: evolucaoData,
        borderColor: 'hsl(214, 85%, 50%)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'hsla(214, 85%, 50%, 0.3)');
          gradient.addColorStop(1, 'hsla(214, 85%, 50%, 0.05)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'hsl(214, 85%, 50%)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Descrição da evolução
  const maxMes = evolucaoData.length > 0 ? Math.max(...evolucaoData) : 0;
  const maxMesIndex = evolucaoData.indexOf(maxMes);
  const mediaMensal = evolucaoData.length > 0 
    ? Math.round(evolucaoData.reduce((a, b) => a + b, 0) / evolucaoData.length)
    : 0;
  const evolucaoDescricao = maxMes > 0
    ? `Pico de chamados em ${evolucaoLabels[maxMesIndex]} (${maxMes}), com média mensal de ${mediaMensal} chamados.`
    : '';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // disable native legend - we'll render a custom HTML legend for full control
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
        titleColor: theme === 'dark' ? '#e4e4e4' : '#333333',
        bodyColor: theme === 'dark' ? '#a0a0a0' : '#666666',
        borderColor: theme === 'dark' ? '#444444' : '#e0e0e0',
        borderWidth: 1,
        callbacks: {
          // Remove the default title and show "Label: value" in the body.
          title: function() { return ''; },
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          }
        }
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        formatter: (value: number) => value,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Análise</h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Chamados"
            value={stats.totalChamados}
            icon={BarChart3}
            variant="primary"
            subtitle={`${stats.chamadosAbertos} abertos | ${stats.chamadosEncerrados} fechados`}
          />
          <StatsCard
            title="Tempo Médio de Resolução"
            value={`${stats.tempoMedioResolucao} min / ${(stats.tempoMedioResolucao / 60).toFixed(1)}h`}
            icon={Clock}
            variant="warning"
          />
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Prioridade Alta/Urgente
                  </p>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {stats.prioridadeAltaUrgente}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.prioridadeAltaUrgente === 1 
                      ? 'Requer atenção'
                      : stats.prioridadeAltaUrgente === 0
                        ? 'Nenhum urgente'
                        : 'Requerem atenção'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <StatsCard
            title="Técnico Mais Produtivo"
            value={stats.tecnicoMaisProdutivo}
            icon={Users}
            variant="default"
            subtitle={`${stats.chamadosTecnicoTop} chamados resolvidos`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SatisfactionChart data={stats.satisfacaoDistribuicao} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Taxa de Resolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.taxaResolucao}%
              </div>
              <p className="text-sm text-muted-foreground">
                Chamados encerrados do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                FRT Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.mediaFRT} min
              </div>
              <p className="text-sm text-muted-foreground">
                First Response Time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Técnico (Top 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-3">
                <Bar data={barChartData} options={chartOptions} />
              </div>
              {tecnicoDescricao && (
                <p className="text-xs text-muted-foreground italic text-center">
                  {tecnicoDescricao}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Motivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-3 flex gap-6">
                <div className="flex-1">
                  <div className="h-80">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </div>
                <div className="w-44 overflow-auto">
                  <ul className="space-y-3">
                    {pieChartData.labels.map((label: any, i: number) => {
                      const bg = (pieChartData.datasets as any)[0].backgroundColor[i];
                      const value = (pieChartData.datasets as any)[0].data[i];
                      return (
                        <li key={label} className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ background: bg }}
                          />
                          <span className={`${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'} text-sm`}>
                            {label} ({value})
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {motivoDescricao && (
                <p className="text-xs text-muted-foreground italic text-center">
                  {motivoDescricao}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {chartData.evolucaoMensal.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Chamados por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-3">
                <Line data={evolucaoChartData} options={lineChartOptions} />
              </div>
              {evolucaoDescricao && (
                <p className="text-xs text-muted-foreground italic text-center">
                  {evolucaoDescricao}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
