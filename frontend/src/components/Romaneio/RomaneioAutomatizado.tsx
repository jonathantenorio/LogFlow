import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  AutoFixHigh as AutoFixHighIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface AutomatedItem {
  id: string;
  product_code: string;
  product_name: string;
  category: string;
  quantity: number;
  unit: string;
  weight: number;
  volume: number;
  confidence: number;
  source: string;
  is_verified: boolean;
  is_cleaned: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  priority: number;
}

const RomaneioAutomatizado: React.FC = () => {
  const [items, setItems] = useState<AutomatedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [settings, setSettings] = useState({
    autoClean: true,
    confidenceThreshold: 0.8,
    maxItems: 1000,
    enableAI: true,
    enableOCR: true
  });

  const steps = [
    'Upload de Dados',
    'Processamento AI',
    'Validação OCR',
    'Limpeza Automática',
    'Verificação Final'
  ];

  useEffect(() => {
    fetchAutomationRules();
    fetchItems();
  }, []);

  const fetchAutomationRules = async () => {
    try {
      // Simular regras de automação
      const mockRules: AutomationRule[] = [
        {
          id: '1',
          name: 'Reconhecimento de Produtos',
          description: 'Identifica produtos usando IA',
          is_active: true,
          priority: 1
        },
        {
          id: '2',
          name: 'OCR de Imagens',
          description: 'Extrai texto de imagens',
          is_active: true,
          priority: 2
        },
        {
          id: '3',
          name: 'Validação de Dados',
          description: 'Valida dados extraídos',
          is_active: true,
          priority: 3
        }
      ];
      setAutomationRules(mockRules);
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Simular dados processados automaticamente
      const mockItems: AutomatedItem[] = [
        {
          id: '1',
          product_code: 'AUTO001',
          product_name: 'Smartphone iPhone 13',
          category: 'Eletrônicos',
          quantity: 3,
          unit: 'UN',
          weight: 0.174,
          volume: 0.0001,
          confidence: 0.95,
          source: 'AI Recognition',
          is_verified: true,
          is_cleaned: true
        },
        {
          id: '2',
          product_code: 'AUTO002',
          product_name: 'Mesa de Escritório',
          category: 'Móveis',
          quantity: 1,
          unit: 'UN',
          weight: 25.0,
          volume: 0.5,
          confidence: 0.87,
          source: 'OCR + AI',
          is_verified: false,
          is_cleaned: true
        }
      ];
      setItems(mockItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAutomation = async () => {
    setProcessing(true);
    setActiveStep(0);
    setProgress(0);

    // Simular processo de automação
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      setProgress((i / steps.length) * 100);
      
      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setProgress(100);
    setProcessing(false);
    
    // Adicionar novos itens processados
    const newItems: AutomatedItem[] = [
      {
        id: Date.now().toString(),
        product_code: `AUTO${Date.now()}`,
        product_name: 'Produto Processado Automaticamente',
        category: 'Automático',
        quantity: Math.floor(Math.random() * 10) + 1,
        unit: 'UN',
        weight: Math.random() * 10,
        volume: Math.random() * 0.1,
        confidence: Math.random() * 0.3 + 0.7,
        source: 'AI Automation',
        is_verified: Math.random() > 0.3,
        is_cleaned: true
      }
    ];
    
    setItems(prev => [...prev, ...newItems]);
  };

  const handleStopAutomation = () => {
    setProcessing(false);
    setActiveStep(0);
    setProgress(0);
  };

  const handleVerifyItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, is_verified: !item.is_verified } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    return items.reduce((acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalWeight: acc.totalWeight + (item.weight * item.quantity),
      totalVolume: acc.totalVolume + (item.volume * item.quantity),
      averageConfidence: acc.averageConfidence + item.confidence
    }), { totalItems: 0, totalWeight: 0, totalVolume: 0, averageConfidence: 0 });
  };

  const totals = calculateTotals();
  const avgConfidence = items.length > 0 ? totals.averageConfidence / items.length : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Romaneio Automatizado
        </Typography>
        <Box>
          <Tooltip title="Configurações">
            <IconButton
              onClick={() => setShowSettingsDialog(true)}
              sx={{ mr: 1 }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => setShowUploadDialog(true)}
            sx={{ mr: 2 }}
          >
            Upload Dados
          </Button>
          {!processing ? (
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartAutomation}
            >
              Iniciar Automação
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              onClick={handleStopAutomation}
            >
              Parar Automação
            </Button>
          )}
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          O romaneio automatizado utiliza inteligência artificial e OCR para processar 
          automaticamente dados de imagens, documentos e planilhas.
        </Typography>
      </Alert>

      {processing && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Processamento Automatizado
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Progresso: {Math.round(progress)}%
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Itens
              </Typography>
              <Typography variant="h4">
                {totals.totalItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Peso Total
              </Typography>
              <Typography variant="h4">
                {totals.totalWeight.toFixed(2)} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Confiança Média
              </Typography>
              <Typography variant="h4">
                {(avgConfidence * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Verificados
              </Typography>
              <Typography variant="h4">
                {items.filter(item => item.is_verified).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Itens Processados Automaticamente
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Peso (kg)</TableCell>
                  <TableCell>Confiança</TableCell>
                  <TableCell>Fonte</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_code}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.product_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {(item.confidence * 100).toFixed(1)}%
                        </Typography>
                        <Box
                          sx={{
                            width: 60,
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              width: `${item.confidence * 100}%`,
                              height: '100%',
                              bgcolor: item.confidence > 0.8 ? 'success.main' : 
                                       item.confidence > 0.6 ? 'warning.main' : 'error.main'
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.source}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={item.is_verified ? 'Verificado' : 'Pendente'}
                          color={item.is_verified ? 'success' : 'warning'}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <Chip
                          label={item.is_cleaned ? 'Limpo' : 'Pendente'}
                          color={item.is_cleaned ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={item.is_verified ? 'Desmarcar Verificado' : 'Marcar Verificado'}>
                        <IconButton
                          size="small"
                          color={item.is_verified ? 'success' : 'default'}
                          onClick={() => handleVerifyItem(item.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <ErrorIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Configurações */}
      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configurações de Automação
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Regras de Automação
              </Typography>
            </Grid>
            {automationRules.map((rule) => (
              <Grid item xs={12} key={rule.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6">{rule.name}</Typography>
                        <Typography color="textSecondary" variant="body2">
                          {rule.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Prioridade: {rule.priority}
                        </Typography>
                      </Box>
                      <Switch
                        checked={rule.is_active}
                        onChange={() => {
                          setAutomationRules(prev => prev.map(r => 
                            r.id === rule.id ? { ...r, is_active: !r.is_active } : r
                          ));
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Configurações Gerais
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoClean}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoClean: e.target.checked }))}
                  />
                }
                label="Limpeza Automática"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableAI}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableAI: e.target.checked }))}
                  />
                }
                label="Habilitar IA"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableOCR}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableOCR: e.target.checked }))}
                  />
                }
                label="Habilitar OCR"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Limite de Confiança (%)"
                type="number"
                value={settings.confidenceThreshold * 100}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  confidenceThreshold: parseFloat(e.target.value) / 100 
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Upload */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Upload de Dados para Automação
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Faça upload de imagens, documentos ou planilhas para processamento automático.
          </Typography>
          
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
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Clique para fazer upload
            </Typography>
            <Typography color="textSecondary">
              ou arraste e solte arquivos aqui
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
              Formatos suportados: JPG, PNG, PDF, XLSX, CSV
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            Cancelar
          </Button>
          <Button variant="contained">
            Processar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RomaneioAutomatizado;


