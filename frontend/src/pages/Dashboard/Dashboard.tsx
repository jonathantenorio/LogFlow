import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  People as ClientsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total de Produtos',
      value: '1,234',
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
    },
    {
      title: 'Pedidos Pendentes',
      value: '56',
      icon: <OrdersIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ed6c02',
    },
    {
      title: 'Clientes Ativos',
      value: '89',
      icon: <ClientsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#2e7d32',
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 45.678',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: '#0288d1',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Atividades Recentes
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Nenhuma atividade recente para exibir.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Sistema
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sistema LogFlow funcionando normalmente.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
