import React, { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { useTech } from '../contexts/TechContext';
import { useNotification } from '../contexts/NotificationContext';
import DataExportImport from '../components/DataExportImport';

function AdminPanel({ userRole }) {
  const { technologies, deleteTechnology, importTechnologies } = useTech();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTechForDelete, setSelectedTechForDelete] = useState(null);

  // Защита роута
  if (userRole !== 'admin') return <Navigate to="/" replace />;

  const handleDeleteClick = useCallback((tech) => {
    setSelectedTechForDelete(tech);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (selectedTechForDelete) {
      deleteTechnology(selectedTechForDelete.id);
      showNotification(`${selectedTechForDelete.name} удалена`, 'success');
      setDeleteConfirmOpen(false);
      setSelectedTechForDelete(null);
    }
  }, [selectedTechForDelete, deleteTechnology, showNotification]);

  const handleFullReset = useCallback(() => {
    if (
      window.confirm(
        '⚠️ ВНИМАНИЕ! Это действие удалит ВСЕ данные безвозвратно. Вы уверены?'
      )
    ) {
      importTechnologies([]);
      showNotification('Все данные удалены', 'success');
    }
  }, [importTechnologies, showNotification]);

  const handleImportSuccess = useCallback((importedTechs) => {
    importTechnologies(importedTechs, true);
    showNotification(`Импортировано ${importedTechs.length} технологий`, 'success');
  }, [importTechnologies, showNotification]);

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        🛠️ Администраторская панель
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' }, gap: 3 }}>
        {/* Main Content */}
        <Box>
          {/* Statistics */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {technologies.length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Всего технологий
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {technologies.filter(t => t.status === 'completed').length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Завершено
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {technologies.filter(t => t.status === 'in-progress').length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  В процессе
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Technologies Table */}
          <TableContainer component={Paper}>
            <Table
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& th': {
                  fontWeight: 600,
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Статус</TableCell>
                  {!isMobile && <TableCell>Описание</TableCell>}
                  <TableCell align="center">Действие</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {technologies.length > 0 ? (
                  technologies.map(tech => (
                    <TableRow
                      key={tech.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {tech.name || 'Без названия'}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor:
                              tech.status === 'completed'
                                ? 'success.lighter'
                                : tech.status === 'in-progress'
                                ? 'warning.lighter'
                                : 'info.lighter',
                            color:
                              tech.status === 'completed'
                                ? 'success.main'
                                : tech.status === 'in-progress'
                                ? 'warning.main'
                                : 'info.main',
                          }}
                        >
                          {tech.status}
                        </Typography>
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tech.description || '-'}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(tech)}
                        >
                          {!isMobile ? 'Удалить' : ''}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 3 : 4} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        Нет технологий в базе
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Sidebar */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Export/Import */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              📊 Данные
            </Typography>
            <DataExportImport
              technologies={technologies}
              onImportSuccess={handleImportSuccess}
            />
          </Paper>

          {/* Danger Zone */}
          <Paper sx={{ p: 2, backgroundColor: 'error.lighter', borderColor: 'error.main', border: '2px solid' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'error.main' }}>
              🔥 Опасная зона
            </Typography>
            <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
              Удалить все данные без восстановления
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleFullReset}
              size="small"
            >
              Стереть всё
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Вы действительно хотите удалить "{selectedTechForDelete?.name}"?
          </Alert>
          <Typography color="textSecondary">
            Это действие не может быть отменено.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отменить</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;