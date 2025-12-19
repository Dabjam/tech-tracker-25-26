import React, { useCallback, useState } from 'react';
import { Box, Container, Paper, Typography, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material';
import { useTech } from '../contexts/TechContext';
import { useNotification } from '../contexts/NotificationContext';

function Settings() {
    const { importTechnologies } = useTech();
    const { showNotification } = useNotification();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const handleDeleteAllConfirm = useCallback(() => {
        importTechnologies([]);
        showNotification('Все технологии удалены', 'success');
        setDeleteConfirmOpen(false);
    }, [importTechnologies, showNotification]);

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
                ⚙️ Настройки
            </Typography>

            {/* Опасная зона */}
            <Paper sx={{ p: 2, borderColor: 'error.main', border: '2px solid', backgroundColor: 'error.lighter' }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'error.main' }}>
                    🗑️ Опасная зона
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Это действие удалит все технологии без возможности восстановления.
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => setDeleteConfirmOpen(true)}
                    size={isMobile ? 'small' : 'medium'}
                >
                    🗑️ Удалить все данные
                </Button>
            </Paper>

            {/* Диалог подтверждения */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Вы действительно хотите удалить все технологии?
                    </Alert>
                    <Typography color="textSecondary">
                        Это действие не может быть отменено.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>
                        Отменить
                    </Button>
                    <Button onClick={handleDeleteAllConfirm} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Settings;