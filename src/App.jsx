import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme, Button, TextField, Typography } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AdminPanel from './pages/AdminPanel';
import Statistics from './pages/Statistics';
import AddTechnology from './pages/AddTechnology';
import Settings from './pages/Settings';
import NotificationComponent from './components/NotificationComponent';

function App() {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Скрыть Navbar на главной странице и странице входа
  const hideNavbar = location.pathname === '/' || (location.pathname === '/technologies' && !userRole);

  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    navigate('/technologies');
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NotificationComponent />
      {userRole && !hideNavbar && <Navbar userRole={userRole} onLogout={handleLogout} />}
      
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />
          
          {/* Список технологий (защищенный роут) */}
          <Route path="/technologies" element={
            !userRole ? <LoginScreen onLogin={handleLogin} /> : <TechnologyList />
          } />
          
          {/* Деталка технологии */}
          <Route path="/technology/:techId" element={
            !userRole ? <Navigate to="/" /> : <TechnologyDetail />
          } />

          {/* Статистика */}
          <Route path="/stats" element={
            !userRole ? <Navigate to="/" /> : <Statistics />
          } />

          {/* Добавление новой технологии */}
          <Route path="/add" element={
            !userRole ? <Navigate to="/" /> : <AddTechnology />
          } />

          {/* Настройки */}
          <Route path="/settings" element={
            !userRole ? <Navigate to="/" /> : <Settings />
          } />
          
          {/* Админка (проверка на роль admin) */}
          <Route path="/admin" element={
            userRole !== 'admin' ? <Navigate to="/technologies" /> : <AdminPanel userRole={userRole} />
          } />

          {/* Редирект для несуществующих страниц */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Box>
  );
}

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('user');
  const muiTheme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '15px'
    }}>
      <Box sx={{
        background: muiTheme.palette.background.paper,
        padding: { xs: '25px', sm: '40px' },
        borderRadius: { xs: '16px', sm: '24px' },
        boxShadow: muiTheme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: { xs: '90vw', sm: '400px' },
        textAlign: 'center',
        border: `1px solid ${muiTheme.palette.divider}`
      }}>
        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: muiTheme.palette.text.primary }}>
          Вход в систему
        </Typography>
        <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary, marginBottom: '30px' }}>
          Выберите вашу роль для продолжения
        </Typography>
        
        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <Button 
            onClick={() => setRole('user')}
            fullWidth
            variant={role === 'user' ? 'contained' : 'outlined'}
            sx={{
              padding: { xs: '10px', sm: '12px' },
              fontWeight: 'bold',
            }}
          >
            👨‍💻 Пользователь
          </Button>
          <Button 
            onClick={() => setRole('admin')}
            fullWidth
            variant={role === 'admin' ? 'contained' : 'outlined'}
            sx={{
              padding: { xs: '10px', sm: '12px' },
              fontWeight: 'bold',
            }}
          >
            🛠️ Админ
          </Button>
        </Box>

        <Box component="form" onSubmit={(e) => { e.preventDefault(); onLogin(role); }} sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <TextField
            type="password"
            placeholder="Пароль (необязательно)"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputBase-input::placeholder': {
                opacity: 0.7,
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ padding: '14px', fontWeight: 'bold' }}
          >
            Войти как {role === 'admin' ? 'Админ' : 'Пользователь'}
          </Button>
        </Box>
        
        <Button 
          onClick={() => window.location.href='/'} 
          sx={{
            background: 'none',
            border: 'none',
            color: muiTheme.palette.text.secondary,
            marginTop: '20px',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: { xs: '13px', sm: '14px' },
            '&:hover': {
              color: muiTheme.palette.text.primary
            }
          }}
        >
          Вернуться на главную
        </Button>
      </Box>
    </Box>
  );
}

// СТИЛИ (удалены - используются MUI)

export default App;