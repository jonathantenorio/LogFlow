import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const ExcelUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      // Simulação de upload
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      const fileNames = acceptedFiles.map(file => file.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Erro ao fazer upload dos arquivos');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload de Excel
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive
              ? 'Solte os arquivos aqui...'
              : 'Arraste e solte arquivos Excel aqui, ou clique para selecionar'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Suporta arquivos .xlsx, .xls e .csv
          </Typography>
        </Box>
      </Paper>

      {uploadStatus === 'uploading' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fazendo upload...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {uploadProgress}% concluído
          </Typography>
        </Paper>
      )}

      {uploadStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Upload concluído com sucesso!
        </Alert>
      )}

      {uploadStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Arquivos Enviados
          </Typography>
          <List>
            {uploadedFiles.map((fileName, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={fileName} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={() => {
            setUploadedFiles([]);
            setUploadStatus('idle');
            setUploadProgress(0);
          }}
        >
          Limpar Lista
        </Button>
      </Box>
    </Box>
  );
};

export default ExcelUpload;
