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
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AutoFixHigh as AutoFixHighIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

interface SimplifiedItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  estimated_weight: number;
  notes: string;
  is_cleaned: boolean;
}

const RomaneioSimplificado: React.FC = () => {
  const [items, setItems] = useState<SimplifiedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<SimplifiedItem | null>(null);
  const [autoClean, setAutoClean] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    quantity: 1,
    unit: 'UN',
    estimated_weight: 0,
    notes: ''
  });

  const categories = [
    'Eletrônicos',
    'Móveis',
    'Roupas',
    'Livros',
    'Ferramentas',
    'Alimentos',
    'Bebidas',
    'Outros'
  ];

  const units = [
    { value: 'UN', label: 'Unidade' },
    { value: 'CX', label: 'Caixa' },
    { value: 'PCT', label: 'Pacote' },
    { value: 'ROL', label: 'Rolo' },
    { value: 'KG', label: 'Quilograma' },
    { value: 'L', label: 'Litro' }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Simular dados de exemplo
      const mockItems: SimplifiedItem[] = [
        {
          id: '1',
          category: 'Eletrônicos',
          description: 'Smartphone Samsung Galaxy',
          quantity: 5,
          unit: 'UN',
          estimated_weight: 0.2,
          notes: 'Produtos novos na caixa',
          is_cleaned: true
        },
        {
          id: '2',
          category: 'Móveis',
          description: 'Mesa de escritório',
          quantity: 2,
          unit: 'UN',
          estimated_weight: 25.0,
          notes: 'Móveis desmontados',
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
      category: '',
      description: '',
      quantity: 1,
      unit: 'UN',
      estimated_weight: 0,
      notes: ''
    });
    setShowAddDialog(true);
  };

  const handleImportData = () => {
    setShowImportDialog(true);
  };

  const handleEditItem = (item: SimplifiedItem) => {
    setFormData({
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      estimated_weight: item.estimated_weight,
      notes: item.notes
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
      const newItem: SimplifiedItem = {
        id: Date.now().toString(),
        ...formData,
        is_cleaned: autoClean
      };
      setItems(prev => [...prev, newItem]);
    }
    setShowAddDialog(false);
  };

  const handleCancel = () => {
    setShowAddDialog(false);
    setShowImportDialog(false);
    setEditingItem(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkImport = (importData: string) => {
    try {
      const lines = importData.split('\n').filter(line => line.trim());
      const newItems: SimplifiedItem[] = lines.map((line, index) => {
        const parts = line.split(',').map(part => part.trim());
        return {
          id: `import_${Date.now()}_${index}`,
          category: parts[0] || 'Outros',
          description: parts[1] || '',
          quantity: parseInt(parts[2]) || 1,
          unit: parts[3] || 'UN',
          estimated_weight: parseFloat(parts[4]) || 0,
          notes: parts[5] || '',
          is_cleaned: autoClean
        };
      });
      setItems(prev => [...prev, ...newItems]);
      setShowImportDialog(false);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
    }
  };

  const calculateTotals = () => {
    return items.reduce((acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalWeight: acc.totalWeight + (item.estimated_weight * item.quantity)
    }), { totalItems: 0, totalWeight: 0 });
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
          Romaneio Simplificado
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleImportData}
            sx={{ mr: 2 }}
          >
            Importar Dados
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Adicionar Item
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          O romaneio simplificado permite uma entrada rápida de dados com categorias pré-definidas 
          e limpeza automática de dados.
        </Typography>
      </Alert>

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
                Peso Estimado
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
                Categorias
              </Typography>
              <Typography variant="h4">
                {new Set(items.map(item => item.category)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Limpeza Automática
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoClean}
                    onChange={(e) => setAutoClean(e.target.checked)}
                  />
                }
                label=""
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Itens do Romaneio Simplificado
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Unidade</TableCell>
                  <TableCell>Peso Est. (kg)</TableCell>
                  <TableCell>Observações</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Chip
                        label={item.category}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {units.find(u => u.value === item.unit)?.label || item.unit}
                    </TableCell>
                    <TableCell>{item.estimated_weight}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {item.notes}
                      </Typography>
                    </TableCell>
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
          {editingItem ? 'Editar Item' : 'Adicionar Item Simplificado'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  label="Categoria"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
                label="Peso Estimado (kg)"
                type="number"
                value={formData.estimated_weight}
                onChange={(e) => handleInputChange('estimated_weight', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
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

      {/* Dialog para importar dados */}
      <Dialog
        open={showImportDialog}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Importar Dados Simplificados
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Cole os dados no formato: Categoria, Descrição, Quantidade, Unidade, Peso Estimado, Observações
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            placeholder="Eletrônicos, Smartphone, 5, UN, 0.2, Produtos novos&#10;Móveis, Mesa, 2, UN, 25.0, Móveis desmontados"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkImport(e.target.value);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RomaneioSimplificado;


