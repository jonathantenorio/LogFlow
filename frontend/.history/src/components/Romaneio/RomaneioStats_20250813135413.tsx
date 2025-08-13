import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface RomaneioStatsProps {
  open: boolean;
  onClose: () => void;
}

interface StatsData {
  total_romaneios: number;
  romaneios_by_type: Record<string, number>;
  romaneios_by_status: Record<string, number>;
  total_items: number;
  total_weight: number;
  total_volume: number;
  average_completion_time: string | null;
}

const RomaneioStats: React.FC<RomaneioStatsProps> = ({ open, onClose }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (open) {
      fetchStats();
    }
  }, [open]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Simular dados de estatísticas
      const mockStats: StatsData = {
        total_romaneios: 156,
        romaneios_by_type: {
          manual: 45,
          simplified: 67,
          automated: 44
        },
        romaneios_by_status: {
          draft: 12,
          in_progress: 23,
          completed: 115,
          cancelled: 6
        },
        total_items: 2847,
        total_weight: 1250.5,
        total_volume: 45.8,
        average_completion_time: '2.5 horas'
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      manual: '#1976d2',
      simplified: '#9c27b0',
      automated: '#2e7d32'
    };
    return colors[type] || '#757575';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: '#757575',
      in_progress: '#ff9800',
      completed: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#757575';
  };

  const typeChartData = stats ? Object.entries(stats.romaneios_by_type).map(([type, count]) => ({
    name: type === 'manual' ? 'Manual' : type === 'simplified' ? 'Simplificado' : 'Automatizado',
    value: count,
    color: getTypeColor(type)
  })) : [];

  const statusChartData = stats ? Object.entries(stats.romaneios_by_status).map(([status, count]) => ({
    name: status === 'draft' ? 'Rascunho' : 
          status === 'in_progress' ? 'Em Andamento' : 
          status === 'completed' ? 'Concluído' : 'Cancelado',
    value: count,
    color: getStatusColor(status)
  })) : [];

  const monthlyData = [
    { month: 'Jan', manual: 12, simplified: 18, automated: 8 },
    { month: 'Fev', manual: 15, simplified: 22, automated: 12 },
    { month: 'Mar', manual: 18, simplified: 27, automated: 24 },
    { month: 'Abr', manual: 22, simplified: 31, automated: 28 },
    { month: 'Mai', manual: 25, simplified: 35, automated: 32 },
    { month: 'Jun', manual: 28, simplified: 38, automated: 36 }
  ];

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Estatísticas do Romaneio</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Estatísticas do Romaneio</Typography>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Visão Geral" />
          <Tab label="Gráficos" />
          <Tab label="Detalhado" />
        </Tabs>

        {tabValue === 0 && stats && (
          <Box>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total de Romaneios
                    </Typography>
                    <Typography variant="h3" component="div">
                      {stats.total_romaneios}
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
                    <Typography variant="h3" component="div">
                      {stats.total_items.toLocaleString()}
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
                    <Typography variant="h3" component="div">
                      {stats.total_weight.toFixed(1)} kg
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Volume Total
                    </Typography>
                    <Typography variant="h3" component="div">
                      {stats.total_volume.toFixed(1)} m³
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Romaneios por Tipo
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={typeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {typeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Romaneios por Status
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Evolução Mensal por Tipo
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="manual" stroke="#1976d2" name="Manual" />
                        <Line type="monotone" dataKey="simplified" stroke="#9c27b0" name="Simplificado" />
                        <Line type="monotone" dataKey="automated" stroke="#2e7d32" name="Automatizado" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Comparativo por Tipo
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="manual" fill="#1976d2" name="Manual" />
                        <Bar dataKey="simplified" fill="#9c27b0" name="Simplificado" />
                        <Bar dataKey="automated" fill="#2e7d32" name="Automatizado" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Detalhamento por Tipo
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Percentual</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {typeChartData.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell>
                                <Chip
                                  label={row.name}
                                  style={{ backgroundColor: row.color, color: 'white' }}
                                />
                              </TableCell>
                              <TableCell>{row.value}</TableCell>
                              <TableCell>
                                {((row.value / stats!.total_romaneios) * 100).toFixed(1)}%
                              </TableCell>
                              <TableCell>
                                <Box display="flex" gap={1}>
                                  <Chip label="Ativo" color="success" size="small" />
                                  <Chip label="Em Uso" color="primary" size="small" />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Métricas de Performance
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary">
                            {stats?.average_completion_time || 'N/A'}
                          </Typography>
                          <Typography color="textSecondary">
                            Tempo Médio de Conclusão
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success.main">
                            {stats ? ((stats.romaneios_by_status.completed / stats.total_romaneios) * 100).toFixed(1) : '0'}%
                          </Typography>
                          <Typography color="textSecondary">
                            Taxa de Conclusão
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="warning.main">
                            {stats ? Math.round(stats.total_items / stats.total_romaneios) : 0}
                          </Typography>
                          <Typography color="textSecondary">
                            Itens por Romaneio
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RomaneioStats;


