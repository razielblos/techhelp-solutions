import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { calculateStats, getChartData } from '@/utils/ticketProcessor';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Clock, Star, TrendingUp, Activity } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { tickets } = useData();
  const navigate = useNavigate();

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

  const tecnicosLabels = Object.keys(chartData.chamadosPorTecnico);
  const tecnicosData = Object.values(chartData.chamadosPorTecnico);

  const motivosLabels = Object.keys(chartData.chamadosPorMotivo);
  const motivosData = Object.values(chartData.chamadosPorMotivo);

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

  const pieChartData = {
    labels: motivosLabels,
    datasets: [
      {
        data: motivosData,
        backgroundColor: [
          'hsl(214, 95%, 36%)',
          'hsl(214, 85%, 50%)',
          'hsl(142, 71%, 45%)',
          'hsl(38, 92%, 50%)',
          'hsl(0, 84%, 60%)',
          'hsl(280, 70%, 50%)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
          />
          <StatsCard
            title="Tempo Médio de Resolução"
            value={`${stats.tempoMedioResolucao} min`}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Satisfação Média"
            value={stats.satisfacaoMedia}
            icon={Star}
            variant="success"
            subtitle="Escala de 1 a 10"
          />
          <StatsCard
            title="Técnico Mais Produtivo"
            value={stats.tecnicoMaisProdutivo}
            icon={Users}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                TMA Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.mediaTMA} min
              </div>
              <p className="text-sm text-muted-foreground">
                Tempo Médio de Atendimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Motivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie data={pieChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
