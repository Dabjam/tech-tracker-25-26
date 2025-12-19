import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext';
import { useTech } from '../contexts/TechContext';

function TechnologyCard({ tech, onDelete }) {
  const { showNotification } = useNotification();
  const { updateTechnology } = useTech();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(tech.status);

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(tech.id);
    showNotification(`${tech.name} удалена`, 'success');
    setDeleteConfirmOpen(false);
  };

  const handleEditStatusClick = () => {
    setNewStatus(tech.status);
    setEditStatusOpen(true);
  };

  const handleEditStatusConfirm = () => {
    if (newStatus !== tech.status) {
      updateTechnology(tech.id, { status: newStatus });
      showNotification(`Статус обновлён`, 'success');
    }
    setEditStatusOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'not-started':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'completed': 'Завершено',
      'in-progress': 'В процессе',
      'not-started': 'Не начато',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🟡';
      default:
        return '📁';
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '1.5rem' }}>
              {getStatusIcon(tech.status)}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Typography
                component="div"
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {tech.name || 'Без названия'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: `${getStatusColor(tech.status)}.lighter`,
                color: `${getStatusColor(tech.status)}.main`,
              }}
            >
              {getStatusLabel(tech.status)}
            </Typography>
          </Box>

          {tech.description && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {tech.description}
            </Typography>
          )}

          {tech.startDate && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              📅 Начало: {new Date(tech.startDate).toLocaleDateString('ru-RU')}
            </Typography>
          )}

          {tech.deadline && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              📅 Срок: {new Date(tech.deadline).toLocaleDateString('ru-RU')}
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ pt: 0 }}>
          <Button
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditStatusClick}
          >
            Статус
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Удалить
          </Button>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Вы действительно хотите удалить "{tech.name}"?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Отменить
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editStatusOpen} onClose={() => setEditStatusOpen(false)}>
        <DialogTitle>Изменить статус</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Статус"
            >
              <MenuItem value="not-started">Не начато</MenuItem>
              <MenuItem value="in-progress">В процессе</MenuItem>
              <MenuItem value="completed">Завершено</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStatusOpen(false)}>Отменить</Button>
          <Button onClick={handleEditStatusConfirm} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TechnologyCard;