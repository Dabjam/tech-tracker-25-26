import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTech } from '../contexts/TechContext';
import { useNotification } from '../contexts/NotificationContext';

function AddTechnology() {
    const { addTechnology } = useTech();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Состояние формы
    const [formData, setFormData] = useState({ 
        name: '', 
        status: 'not-started',
        description: ''
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showNotification('Пожалуйста, введите название', 'warning');
            return;
        }
        addTechnology(formData);
        showNotification(`${formData.name} добавлена в список`, 'success');
        navigate('/technologies'); 
    }, [formData, addTechnology, navigate, showNotification]);

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
                    🆕 Новая технология
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Заполните данные, чтобы начать отслеживать прогресс
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Название"
                        placeholder="Например: React Router"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        inputProps={{
                            'aria-label': 'Название технологии',
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Описание"
                        placeholder="Для чего нужна эта технология?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        multiline
                        rows={4}
                        inputProps={{
                            'aria-label': 'Описание технологии',
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size={isMobile ? 'small' : 'medium'}
                        >
                            ✅ Добавить
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate('/technologies')}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            ✕ Отмена
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default AddTechnology;