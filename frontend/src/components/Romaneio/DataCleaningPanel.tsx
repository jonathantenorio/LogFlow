import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Download as DownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface DataCleaningPanelProps {
  open: boolean;
  onClose: () => void;
}

interface CleaningRule {
  id: string;
  name: string;
  rule_type: string;
  description: string;
  is_active: boolean;
  priority: number;
  configuration: any;
}

interface CleaningResult {
  original_count: number;
  cleaned_count: number;
  removed_count: number;
  errors: any[];
  warnings: any[];
  cleaned_data: any[];
}

const DataCleaningPanel: React.FC<DataCleaningPanelProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cleaningRules, setCleaningRules] = useState<CleaningRule[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CleaningResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');

  const steps = [
    'Upload do Arquivo',
    'Configurar Regras',
    'Processar Dados',
    'Resultados'
  ];

  useEffect(() => {
    if (open) {
      fetchCleaningRules();
    }
  }, [open]);

  const fetchCleaningRules = async () => {
    try {
      const response = await fetch('/api/romaneio/cleaning-rules/');
      if (response.ok) {
        const data = await response.json();
        setCleaningRules(data.results || data);
      }
    } catch (error) {
      console.error('Erro ao carregar regras de limpeza:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setUploadedFile(file);
      // Simular preview dos dados
      setPreviewData([
        { id: 1, produto: 'Produto A', quantidade: 10, peso: 5.5, localizacao: 'Prateleira 1' },
        { id: 2, produto: 'Produto B', quantidade: 5, peso: 2.3, localizacao: 'Prateleira 2' },
        { id: 3, produto: 'Produto C', quantidade: 15, peso: 8.1, localizacao: 'Prateleira 3' },
      ]);
    }
  };

  const handleRuleToggle = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleProcessData = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('excel_file', uploadedFile);
      formData.append('name', sessionName);
      formData.append('description', sessionDescription);

      // Criar sessão de limpeza
      const sessionResponse = await fetch('/api/romaneio/cleaning-sessions/', {
        method: 'POST',
        body: formData,
      });

      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        
        // Processar dados
        const processResponse = await fetch(`/api/romaneio/cleaning-sessions/${session.id}/process_data/`, {
          method: 'POST',
        });

        if (processResponse.ok) {
          const processResult = await processResponse.json();
          setResult(processResult);
          setActiveStep(3);
        }
      }
    } catch (error) {
      console.error('Erro ao processar dados:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadCleanedData = () => {
    if (!result) return;
    
    // Simular download dos dados limpos
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Produto,Quantidade,Peso,Localização\n" +
      result.cleaned_data.map(row => 
        `${row.produto},${row.quantidade},${row.peso},${row.localizacao}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dados_limpos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStepLabel = (type: string) => {
    const labels: Record<string, string> = {
      'remove_duplicates': 'Remover Duplicatas',
      'trim_whitespace': 'Remover Espaços',
      'standardize_case': 'Padronizar Maiúsculas/Minúsculas',
      'remove_special_chars': 'Remover Caracteres Especiais',
      'validate_format': 'Validar Formato',
      'replace_values': 'Substituir Valores',
      'merge_columns': 'Mesclar Colunas',
    };
    return labels[type] || type;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload do Arquivo Excel
            </Typography>
            <Typography color="textSecondary" paragraph>
              Faça upload do arquivo Excel contendo os dados que deseja limpar.
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Clique para fazer upload
                  </Typography>
                  <Typography color="textSecondary">
                    ou arraste e solte o arquivo aqui
                  </Typography>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    aria-label="Upload arquivo Excel"
                  />
                </Box>
              </CardContent>
            </Card>

            {uploadedFile && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Arquivo Selecionado
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircleIcon color="success" />
                    <Typography>{uploadedFile.name}</Typography>
                    <Typography color="textSecondary">
                      ({(uploadedFile.size / 1024).toFixed(2)} KB)
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Preview dos Dados
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Produto</TableCell>
                          <TableCell>Quantidade</TableCell>
                          <TableCell>Peso</TableCell>
                          <TableCell>Localização</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.produto}</TableCell>
                            <TableCell>{row.quantidade}</TableCell>
                            <TableCell>{row.peso}</TableCell>
                            <TableCell>{row.localizacao}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configurar Regras de Limpeza
            </Typography>
            <Typography color="textSecondary" paragraph>
              Selecione as regras que deseja aplicar aos dados.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome da Sessão"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Regras Disponíveis
            </Typography>
            
            <Grid container spacing={2}>
              {cleaningRules.map((rule) => (
                <Grid item xs={12} md={6} key={rule.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6">{rule.name}</Typography>
                          <Typography color="textSecondary" variant="body2">
                            {getStepLabel(rule.rule_type)}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {rule.description}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={selectedRules.includes(rule.id)}
                              onChange={() => handleRuleToggle(rule.id)}
                            />
                          }
                          label=""
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Processar Dados
            </Typography>
            <Typography color="textSecondary" paragraph>
              Aplicando as regras de limpeza selecionadas aos dados...
            </Typography>

            <Card>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                  {processing ? (
                    <>
                      <CircularProgress size={60} sx={{ mb: 2 }} />
                      <Typography variant="h6">Processando dados...</Typography>
                      <Typography color="textSecondary">
                        Isso pode levar alguns minutos dependendo do tamanho do arquivo.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <PlayArrowIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Pronto para processar
                      </Typography>
                      <Typography color="textSecondary" textAlign="center">
                        Clique em "Processar" para aplicar as regras de limpeza aos dados.
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resultados da Limpeza
            </Typography>

            {result && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Linhas Originais
                      </Typography>
                      <Typography variant="h4">{result.original_count}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Linhas Limpas
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {result.cleaned_count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Removidas
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {result.removed_count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Taxa de Sucesso
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {((result.cleaned_count / result.original_count) * 100).toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {result.errors.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="error" icon={<ErrorIcon />}>
                      <Typography variant="h6" gutterBottom>
                        Erros ({result.errors.length})
                      </Typography>
                      {result.errors.map((error, index) => (
                        <Typography key={index} variant="body2">
                          • {error.rule}: {error.error}
                        </Typography>
                      ))}
                    </Alert>
                  </Grid>
                )}

                {result.warnings.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="warning" icon={<WarningIcon />}>
                      <Typography variant="h6" gutterBottom>
                        Avisos ({result.warnings.length})
                      </Typography>
                      {result.warnings.map((warning, index) => (
                        <Typography key={index} variant="body2">
                          • {warning.rule}: {warning.column} - {warning.invalid_rows} linhas inválidas
                        </Typography>
                      ))}
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                          Dados Limpos (Primeiras 10 linhas)
                        </Typography>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={handleDownloadCleanedData}
                          variant="outlined"
                        >
                          Download CSV
                        </Button>
                      </Box>
                      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {result.cleaned_data.length > 0 && 
                                Object.keys(result.cleaned_data[0]).map((key) => (
                                  <TableCell key={key}>{key}</TableCell>
                                ))
                              }
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {result.cleaned_data.slice(0, 10).map((row, index) => (
                              <TableRow key={index}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell key={cellIndex}>{String(value)}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            Limpeza de Dados
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Voltar
          </Button>
        )}
        
        {activeStep === 0 && uploadedFile && (
          <Button onClick={handleNext} variant="contained">
            Próximo
          </Button>
        )}
        
        {activeStep === 1 && selectedRules.length > 0 && (
          <Button onClick={handleNext} variant="contained">
            Próximo
          </Button>
        )}
        
        {activeStep === 2 && (
          <Button 
            onClick={handleProcessData} 
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          >
            {processing ? 'Processando...' : 'Processar'}
          </Button>
        )}
        
        {activeStep === 3 && (
          <Button onClick={onClose} variant="contained">
            Concluir
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DataCleaningPanel;
