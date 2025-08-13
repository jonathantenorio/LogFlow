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

const Inventory: React.FC = () => {
  const mockData = [
    { id: 1, name: 'Produto A', category: 'Categoria 1', stock: 100, price: 'R$ 10,00' },
    { id: 2, name: 'Produto B', category: 'Categoria 2', stock: 50, price: 'R$ 25,00' },
    { id: 3, name: 'Produto C', category: 'Categoria 1', stock: 200, price: 'R$ 15,00' },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Inventário
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade de adicionar produto será implementada')}
        >
          Adicionar Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.stock}</TableCell>
                <TableCell>{row.price}</TableCell>
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

export default Inventory;
