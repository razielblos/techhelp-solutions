import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { parseSpreadsheet } from '@/utils/ticketProcessor';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTickets } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (extension === 'xlsx' || extension === 'csv') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo XLSX ou CSV.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const data = await parseSpreadsheet(file);
      setTickets(data);
      
      toast({
        title: "Planilha carregada com sucesso!",
        description: `${data.length} chamados importados.`,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro ao importar planilha",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bem-vindo ao Dashboard TechHelp
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Importe suas planilhas de chamados de suporte e tenha acesso a análises detalhadas, 
            gráficos interativos e métricas de desempenho em tempo real.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Sobre o Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Este dashboard foi desenvolvido para facilitar a análise de dados de suporte técnico, 
                proporcionando visualizações claras e insights acionáveis.
              </p>
              <div>
                <p className="font-semibold text-foreground mb-2">Recursos disponíveis:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>KPIs principais de atendimento</li>
                  <li>Gráficos interativos por técnico, categoria e prioridade</li>
                  <li>Tabela completa com filtros avançados</li>
                  <li>Exportação de dados filtrados</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Formatos Aceitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                  <p className="font-semibold text-foreground">.XLSX</p>
                  <p className="text-xs text-muted-foreground">Excel</p>
                </div>
                <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                  <p className="font-semibold text-foreground">.CSV</p>
                  <p className="text-xs text-muted-foreground">Valores separados</p>
                </div>
              </div>
              
              <div>
                <p className="font-semibold text-sm text-foreground mb-2">Campos obrigatórios:</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  {REQUIRED_FIELDS.map((field, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Importar Planilha</CardTitle>
            <CardDescription>
              Selecione uma planilha contendo os dados dos chamados de suporte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UploadIcon className="w-8 h-8 text-primary" />
                </div>
                
                {file ? (
                  <Alert className="max-w-md">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm">
                      <strong>{file.name}</strong> selecionado
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Clique para selecionar um arquivo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Formatos aceitos: XLSX, CSV
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar arquivo
                  </Button>
                  
                  <Button
                    onClick={handleImport}
                    disabled={!file || loading}
                    className="gap-2"
                  >
                    {loading ? 'Importando...' : 'Importar'}
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Certifique-se de que sua planilha contém todos os 13 campos obrigatórios listados acima. 
                Planilhas com campos faltando não poderão ser importadas.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
