import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, CheckCircle, TrendingUp, BarChart3, FileSpreadsheet } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
          <span className="text-primary-foreground font-bold text-xl">TH</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Dashboard TechHelp Solutions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Sistema de Análise de Chamados de Suporte
            </p>
          </div>

          {/* Description */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Análise inteligente de dados de suporte técnico para sua equipe.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Nosso dashboard permite que gestores e equipes de suporte visualizem
              métricas essenciais, identifiquem gargalos e melhorem a produtividade
              através de insights baseados em dados reais de chamados.
            </p>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <FileSpreadsheet className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Importe planilhas XLSX ou CSV</p>
                <p className="text-sm text-muted-foreground">Compatível com múltiplos formatos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Visualize indicadores em tempo real</p>
                <p className="text-sm text-muted-foreground">KPIs e métricas de desempenho</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Analise tendências e padrões</p>
                <p className="text-sm text-muted-foreground">Identifique oportunidades de melhoria</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Decisões baseadas em dados</p>
                <p className="text-sm text-muted-foreground">Insights concretos e acionáveis</p>
              </div>
            </div>
          </div>

          {/* CTA Button with Shimmer Effect */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="relative overflow-hidden text-lg px-12 py-7 h-auto rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 shimmer-button"
            >
              <span className="relative z-10">Acessar Dashboard</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Shimmer Animation CSS */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        .shimmer-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shine 3s infinite;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default Index;
