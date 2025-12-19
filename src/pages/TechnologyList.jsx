import React, { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, CheckCircle as CheckCircleIcon, RestartAlt as RestartAltIcon } from '@mui/icons-material';
import { useTech } from '../contexts/TechContext';
import { useNotification } from '../contexts/NotificationContext';
import TechnologyCard from '../components/TechnologyCard';
import DeadlineForm from '../components/DeadlineForm';
import BulkStatusEditor from '../components/BulkStatusEditor';
import DataExportImport from '../components/DataExportImport';

function TechnologyList() {
  const { technologies, deleteTechnology, updateTechnology, updateMultipleTechnologies, importTechnologies, addDemoTechnologies } = useTech();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editingTech, setEditingTech] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: '', link: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [deadlineFormOpen, setDeadlineFormOpen] = useState(false);
  const [bulkEditorOpen, setBulkEditorOpen] = useState(false);
  const [completeAllDialog, setCompleteAllDialog] = useState(false);
  const [resetAllDialog, setResetAllDialog] = useState(false);

  const filteredTechnologies = technologies.filter(tech =>
    (tech.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tech.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTechnologies = [...filteredTechnologies].sort((a, b) => {
    const priority = { 'in-progress': 1, 'not-started': 2, 'completed': 3, 'abandoned': 4 };
    return (priority[a.status] || 5) - (priority[b.status] || 5);
  });

  const handleDeadlineSubmit = useCallback((formData) => {
    const existingTech = technologies.find(t => t.name === formData.name);
    if (existingTech) {
      updateTechnology(existingTech.id, formData);
      showNotification('Сроки обновлены', 'success');
    } else {
      showNotification('Технология не найдена', 'warning');
    }
  }, [technologies, updateTechnology, showNotification]);

  const handleBulkStatusApply = useCallback((selectedIds, newStatus) => {
    updateMultipleTechnologies(selectedIds, { status: newStatus });
    showNotification(`Статус обновлен для ${selectedIds.length} технологий`, 'success');
  }, [updateMultipleTechnologies, showNotification]);

  const handleImportSuccess = useCallback((importedTechs) => {
    importTechnologies(importedTechs, true);
    showNotification(`Импортировано ${importedTechs.length} технологий`, 'success');
  }, [importTechnologies, showNotification]);

  const handleMarkAllComplete = useCallback(() => {
    const allIds = technologies.map(t => t.id);
    updateMultipleTechnologies(allIds, { status: 'completed' });
    showNotification(`Все технологии отмечены как завершённые`, 'success');
    setCompleteAllDialog(false);
  }, [technologies, updateMultipleTechnologies, showNotification]);

  const handleResetAllStatuses = useCallback(() => {
    const allIds = technologies.map(t => t.id);
    updateMultipleTechnologies(allIds, { status: 'not-started' });
    showNotification(`Все статусы сброшены`, 'success');
    setResetAllDialog(false);
  }, [technologies, updateMultipleTechnologies, showNotification]);

  const handleEditTech = useCallback((tech) => {
    setEditingTech(tech);
    setEditForm({
      name: tech.name || '',
      description: tech.description || '',
      status: tech.status || 'not-started',
      link: tech.link || ''
    });
    setEditDialogOpen(true);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editForm.name.trim()) {
      showNotification('Название не может быть пусто', 'warning');
      return;
    }
    updateTechnology(editingTech.id, editForm);
    showNotification('Технология обновлена', 'success');
    setEditDialogOpen(false);
    setEditingTech(null);
  }, [editForm, editingTech, updateTechnology, showNotification]);

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Мои технологии
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Button
            component={RouterLink}
            to="/add"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size={isMobile ? 'small' : 'medium'}
            fullWidth={isMobile}
          >
            Добавить
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              addDemoTechnologies();
              showNotification('Демо-технологии добавлены', 'success');
            }}
            size={isMobile ? 'small' : 'medium'}
            fullWidth={isMobile}
          >
            📊 Демо
          </Button>
        </Stack>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Поиск по названию или описанию..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 3 }}
        inputProps={{
          'aria-label': 'Поиск технологий',
        }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setDeadlineFormOpen(true)}
          size={isMobile ? 'small' : 'medium'}
        >
          ⏰ Сроки
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setBulkEditorOpen(true)}
          disabled={technologies.length === 0}
          size={isMobile ? 'small' : 'medium'}
        >
          📊 Массовое редактирование
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={() => setCompleteAllDialog(true)}
          disabled={technologies.length === 0}
          size={isMobile ? 'small' : 'medium'}
        >
          ✓ Все выполнено
        </Button>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<RestartAltIcon />}
          onClick={() => setResetAllDialog(true)}
          disabled={technologies.length === 0}
          size={isMobile ? 'small' : 'medium'}
        >
          ↻ Сбросить
        </Button>
        <DataExportImport
          technologies={technologies}
          onImportSuccess={handleImportSuccess}
        />
      </Box>

      {/* Technologies Grid */}
      {sortedTechnologies.length > 0 ? (
        <Grid container spacing={2}>
          {sortedTechnologies.map(tech => (
            <Grid item xs={12} sm={6} md={4} key={tech.id}>
              <Box onClick={() => handleEditTech(tech)} sx={{ cursor: 'pointer' }}>
                <TechnologyCard
                  tech={tech}
                  onDelete={deleteTechnology}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <Typography color="textSecondary">
            {searchQuery ? 'Технологии не найдены' : 'У вас пока нет технологий. Добавьте первую!'}
          </Typography>
        </Paper>
      )}

      {/* Dialogs */}
      <DeadlineForm
        open={deadlineFormOpen}
        onClose={() => setDeadlineFormOpen(false)}
        onSubmit={handleDeadlineSubmit}
      />

      <BulkStatusEditor
        open={bulkEditorOpen}
        onClose={() => setBulkEditorOpen(false)}
        technologies={technologies}
        onApply={handleBulkStatusApply}
      />

      {/* Mark All Complete Dialog */}
      <Dialog open={completeAllDialog} onClose={() => setCompleteAllDialog(false)}>
        <DialogTitle>Отметить все выполненным?</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2">
            Все технологии будут отмечены как завершённые. Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteAllDialog(false)}>Отмена</Button>
          <Button
            onClick={handleMarkAllComplete}
            variant="contained"
            color="success"
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset All Statuses Dialog */}
      <Dialog open={resetAllDialog} onClose={() => setResetAllDialog(false)}>
        <DialogTitle>Сбросить все статусы?</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2">
            Все технологии вернут статус "Не начинал". Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetAllDialog(false)}>Отмена</Button>
          <Button
            onClick={handleResetAllStatuses}
            variant="contained"
            color="warning"
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Technology Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать технологию</DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Название"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              label="Статус"
            >
              <MenuItem value="not-started">Не начато</MenuItem>
              <MenuItem value="in-progress">В процессе</MenuItem>
              <MenuItem value="completed">Завершено</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Описание"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
          <TextField
            label="Ссылка"
            value={editForm.link}
            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
            fullWidth
            variant="outlined"
            placeholder="https://..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TechnologyList;