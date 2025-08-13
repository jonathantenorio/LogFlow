import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ptBR } from '@mui/material/locale';

// Componentes
import Layout from './components/Layout/Layout';
import AuthProvider from './components/Auth/AuthProvider';

// Páginas
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Inventory from './pages/Inventory/Inventory';
import Orders from './pages/Orders/Orders';
import Clients from './pages/Clients/Clients';
import Users from './pages/Users/Users';
import ExcelUpload from './pages/ExcelUpload/ExcelUpload';
import Profile from './pages/Profile/Profile';
import RomaneioDashboard from './components/Romaneio/RomaneioDashboard';

// Tema personalizado
const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  },
  ptBR
);

// Cliente React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rota pública */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
                <Route path="clients" element={<Clients />} />
                <Route path="users" element={<Users />} />
                <Route path="excel-upload" element={<ExcelUpload />} />
                <Route path="romaneio" element={<RomaneioDashboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
