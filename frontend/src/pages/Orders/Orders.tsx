import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Orders: React.FC = () => {
  const mockData = [
    { 
      id: 1, 
      client: 'Cliente A', 
      date: '2024-01-15', 
      status: 'Pendente', 
      total: 'R$ 150,00',
      items: 3
    },
    { 
      id: 2, 
      client: 'Cliente B', 
      date: '2024-01-14', 
      status: 'Aprovado', 
      total: 'R$ 300,00',
      items: 5
    },
    { 
      id: 3, 
      client: 'Cliente C', 
      date: '2024-01-13', 
      status: 'Entregue', 
      total: 'R$ 75,00',
      items: 2
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Aprovado':
        return 'info';
      case 'Entregue':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Pedidos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade de novo pedido será implementada')}
        >
          Novo Pedido
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Itens</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.items}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    Ver Detalhes
                  </Button>
                  <Button size="small" color="secondary">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
