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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Clients: React.FC = () => {
  const mockData = [
    { 
      id: 1, 
      name: 'Cliente A', 
      email: 'clientea@email.com', 
      phone: '(11) 99999-9999',
      city: 'São Paulo',
      status: 'Ativo'
    },
    { 
      id: 2, 
      name: 'Cliente B', 
      email: 'clienteb@email.com', 
      phone: '(11) 88888-8888',
      city: 'Rio de Janeiro',
      status: 'Ativo'
    },
    { 
      id: 3, 
      name: 'Cliente C', 
      email: 'clientec@email.com', 
      phone: '(11) 77777-7777',
      city: 'Belo Horizonte',
      status: 'Inativo'
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade de adicionar cliente será implementada')}
        >
          Adicionar Cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    Editar
                  </Button>
                  <Button size="small" color="error">
                    Excluir
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

export default Clients;
