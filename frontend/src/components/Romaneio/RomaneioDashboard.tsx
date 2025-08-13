import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FileUpload as FileUploadIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RomaneioManual from './RomaneioManual';
import RomaneioSimplificado from './RomaneioSimplificado';
import RomaneioAutomatizado from './RomaneioAutomatizado';
import DataCleaningPanel from './DataCleaningPanel';
import RomaneioStats from './RomaneioStats';

interface Romaneio {
  id: string;
  romaneio_number: string;
  title: string;
  romaneio_type: 'manual' | 'simplified' | 'automated';
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  total_items: number;
  total_weight: number;
  created_at: string;
  created_by_name: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`romaneio-tabpanel-${index}`}
      aria-labelledby={`romaneio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RomaneioDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [romaneios, setRomaneios] = useState<Romaneio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDataCleaning, setShowDataCleaning] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'romaneio_number',
      headerName: 'Número',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'title',
      headerName: 'Título',
      width: 250,
    },
    {
      field: 'romaneio_type',
      headerName: 'Tipo',
      width: 120,
      renderCell: (params) => {
        const typeColors: Record<string, 'primary' | 'secondary' | 'success'> = {
          manual: 'primary',
          simplified: 'secondary',
          automated: 'success',
        };
        const typeLabels: Record<string, string> = {
          manual: 'Manual',
          simplified: 'Simplificado',
          automated: 'Automatizado',
        };
        return (
          <Chip
            label={typeLabels[params.value as string] || params.value}
            color={typeColors[params.value as string] || 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const statusColors: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
          draft: 'default',
          in_progress: 'warning',
          completed: 'success',
          cancelled: 'error',
        };
        const statusLabels: Record<string, string> = {
          draft: 'Rascunho',
          in_progress: 'Em Andamento',
          completed: 'Concluído',
          cancelled: 'Cancelado',
        };
        return (
          <Chip
            label={statusLabels[params.value as string] || params.value}
            color={statusColors[params.value as string] || 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'total_items',
      headerName: 'Itens',
      width: 80,
      type: 'number',
    },
    {
      field: 'total_weight',
      headerName: 'Peso (kg)',
      width: 100,
      type: 'number',
      valueFormatter: (params) => `${params.value.toFixed(2)} kg`,
    },
    {
      field: 'created_by_name',
      headerName: 'Criado por',
      width: 150,
    },
    {
      field: 'created_at',
      headerName: 'Data',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString('pt-BR'),
    },
  ];

  useEffect(() => {
    fetchRomaneios();
  }, []);

  const fetchRomaneios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/romaneio/romaneios/');
      if (!response.ok) {
        throw new Error('Erro ao carregar romaneios');
      }
      const data = await response.json();
      setRomaneios(data.results || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewRomaneio = () => {
    // Implementar criação de novo romaneio baseado no tipo selecionado
    console.log('Novo romaneio:', tabValue === 0 ? 'manual' : tabValue === 1 ? 'simplified' : 'automated');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: '#757575',
      in_progress: '#ff9800',
      completed: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#757575';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      manual: '#1976d2',
      simplified: '#9c27b0',
      automated: '#2e7d32',
    };
    return colors[type] || '#757575';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Sistema de Romaneio
        </Typography>
        <Box>
          <Tooltip title="Limpeza de Dados">
            <IconButton
              onClick={() => setShowDataCleaning(true)}
              color="primary"
              sx={{ mr: 1 }}
            >
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Estatísticas">
            <IconButton
              onClick={() => setShowStats(true)}
              color="primary"
              sx={{ mr: 1 }}
            >
              <AnalyticsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Configurações">
            <IconButton color="primary" sx={{ mr: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewRomaneio}
          >
            Novo Romaneio
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Romaneios
              </Typography>
              <Typography variant="h4" component="div">
                {romaneios.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Em Andamento
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {romaneios.filter(r => r.status === 'in_progress').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Concluídos
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {romaneios.filter(r => r.status === 'completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Itens
              </Typography>
              <Typography variant="h4" component="div">
                {romaneios.reduce((sum, r) => sum + r.total_items, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="romaneio tabs">
            <Tab label="Manual" />
            <Tab label="Simplificado" />
            <Tab label="Automatizado" />
            <Tab label="Todos os Romaneios" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <RomaneioManual />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RomaneioSimplificado />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RomaneioAutomatizado />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={romaneios}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              loading={loading}
              components={{
                Toolbar: () => (
                  <Box sx={{ p: 2 }}>
                    <Button
                      startIcon={<RefreshIcon />}
                      onClick={fetchRomaneios}
                      variant="outlined"
                    >
                      Atualizar
                    </Button>
                  </Box>
                ),
              }}
            />
          </Box>
        </TabPanel>
      </Card>

      {/* Modais */}
      {showDataCleaning && (
        <DataCleaningPanel
          open={showDataCleaning}
          onClose={() => setShowDataCleaning(false)}
        />
      )}

      {showStats && (
        <RomaneioStats
          open={showStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </Box>
  );
};

export default RomaneioDashboard;


