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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface RomaneioItem {
  id: string;
  product_code: string;
  product_name: string;
  quantity: number;
  unit: string;
  weight: number;
  volume: number;
  description: string;
  location: string;
  is_cleaned: boolean;
}

const RomaneioManual: React.FC = () => {
  const [items, setItems] = useState<RomaneioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<RomaneioItem | null>(null);
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    quantity: 1,
    unit: 'UN',
    weight: 0,
    volume: 0,
    description: '',
    location: ''
  });

  const units = [
    { value: 'UN', label: 'Unidade' },
    { value: 'KG', label: 'Quilograma' },
    { value: 'L', label: 'Litro' },
    { value: 'M', label: 'Metro' },
    { value: 'M2', label: 'Metro Quadrado' },
    { value: 'M3', label: 'Metro Cúbico' },
    { value: 'CX', label: 'Caixa' },
    { value: 'PCT', label: 'Pacote' },
    { value: 'ROL', label: 'Rolo' }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Simular dados de exemplo
      const mockItems: RomaneioItem[] = [
        {
          id: '1',
          product_code: 'PROD001',
          product_name: 'Produto A',
          quantity: 10,
          unit: 'UN',
          weight: 5.5,
          volume: 0.1,
          description: 'Produto de teste',
          location: 'Prateleira 1',
          is_cleaned: true
        },
        {
          id: '2',
          product_code: 'PROD002',
          product_name: 'Produto B',
          quantity: 5,
          unit: 'KG',
          weight: 2.3,
          volume: 0.05,
          description: 'Produto de teste 2',
          location: 'Prateleira 2',
          is_cleaned: false
        }
      ];
      setItems(mockItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      product_code: '',
      product_name: '',
      quantity: 1,
      unit: 'UN',
      weight: 0,
      volume: 0,
      description: '',
      location: ''
    });
    setShowAddDialog(true);
  };

  const handleEditItem = (item: RomaneioItem) => {
    setFormData({
      product_code: item.product_code,
      product_name: item.product_name,
      quantity: item.quantity,
      unit: item.unit,
      weight: item.weight,
      volume: item.volume,
      description: item.description,
      location: item.location
    });
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveItem = () => {
    if (editingItem) {
      // Editar item existente
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      setEditingItem(null);
    } else {
      // Adicionar novo item
      const newItem: RomaneioItem = {
        id: Date.now().toString(),
        ...formData,
        is_cleaned: false
      };
      setItems(prev => [...prev, newItem]);
    }
    setShowAddDialog(false);
  };

  const handleCancel = () => {
    setShowAddDialog(false);
    setEditingItem(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotals = () => {
    return items.reduce((acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalWeight: acc.totalWeight + (item.weight * item.quantity),
      totalVolume: acc.totalVolume + (item.volume * item.quantity)
    }), { totalItems: 0, totalWeight: 0, totalVolume: 0 });
  };

  const totals = calculateTotals();

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
          Romaneio Manual
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Adicionar Item
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Volume Total
              </Typography>
              <Typography variant="h4">
                {totals.totalVolume.toFixed(3)} m³
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Itens do Romaneio
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Unidade</TableCell>
                  <TableCell>Peso (kg)</TableCell>
                  <TableCell>Volume (m³)</TableCell>
                  <TableCell>Localização</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_code}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {item.product_name}
                        </Typography>
                        {item.description && (
                          <Typography variant="caption" color="textSecondary">
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {units.find(u => u.value === item.unit)?.label || item.unit}
                    </TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>{item.volume}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.is_cleaned ? 'Limpo' : 'Pendente'}
                        color={item.is_cleaned ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditItem(item)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <DeleteIcon />
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

      {/* Dialog para adicionar/editar item */}
      <Dialog
        open={showAddDialog}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Editar Item' : 'Adicionar Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código do Produto"
                value={formData.product_code}
                onChange={(e) => handleInputChange('product_code', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Produto"
                value={formData.product_name}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Unidade</InputLabel>
                <Select
                  value={formData.unit}
                  label="Unidade"
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Peso (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Volume (m³)"
                type="number"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localização"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {editingItem ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RomaneioManual;


