import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { AccountCircle as AccountIcon } from '@mui/icons-material';
import { useAuth } from '@/components/Auth/AuthProvider';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Usuário Teste',
    email: user?.email || 'usuario@teste.com',
    phone: '(11) 99999-9999',
    company: 'Empresa Teste',
    position: 'Desenvolvedor',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'Usuário Teste',
      email: user?.email || 'usuario@teste.com',
      phone: '(11) 99999-9999',
      company: 'Empresa Teste',
      position: 'Desenvolvedor',
    });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Perfil do Usuário
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
              }}
            >
              <AccountIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {formData.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {formData.position}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formData.company}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={logout}
            >
              Sair
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Informações Pessoais
              </Typography>
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ mr: 1 }}
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Empresa"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
