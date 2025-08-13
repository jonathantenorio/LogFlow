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

const Users: React.FC = () => {
  const mockData = [
    { 
      id: 1, 
      name: 'João Silva', 
      email: 'joao@empresa.com', 
      role: 'Administrador',
      status: 'Ativo',
      lastLogin: '2024-01-15 10:30'
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      email: 'maria@empresa.com', 
      role: 'Usuário',
      status: 'Ativo',
      lastLogin: '2024-01-14 15:45'
    },
    { 
      id: 3, 
      name: 'Pedro Costa', 
      email: 'pedro@empresa.com', 
      role: 'Gerente',
      status: 'Inativo',
      lastLogin: '2024-01-10 09:15'
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'error';
      case 'Gerente':
        return 'warning';
      case 'Usuário':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade de adicionar usuário será implementada')}
        >
          Adicionar Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Último Login</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.role} 
                    color={getRoleColor(row.role) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.lastLogin}</TableCell>
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

export default Users;
