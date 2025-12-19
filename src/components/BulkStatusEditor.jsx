import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Не начато' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершено' },
];

const BulkStatusEditor = ({
  open,
  onClose,
  technologies = [],
  onApply,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newStatus, setNewStatus] = useState('in-progress');
  const [selectAll, setSelectAll] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
      setSelectAll(false);
      setNewStatus('in-progress');
    }
  }, [open]);

  const handleSelectTechnology = useCallback((id) => {
    setSelectedIds(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(techId => techId !== id);
      } else {
        return [...prev, id];
      }
    });
    setSelectAll(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(technologies.map(tech => tech.id));
    }
    setSelectAll(!selectAll);
  }, [selectAll, technologies]);

  const handleApply = useCallback(() => {
    if (selectedIds.length === 0) {
      showNotification('Пожалуйста, выберите технологии', 'warning');
      return;
    }

    onApply(selectedIds, newStatus);
    showNotification(
      `Статус обновлен для ${selectedIds.length} технологий`,
      'success'
    );
    onClose();
  }, [selectedIds, newStatus, onApply, onClose, showNotification]);

  const handleCancel = useCallback(() => {
    setSelectedIds([]);
    setSelectAll(false);
    setNewStatus('in-progress');
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      role="dialog"
      aria-labelledby="bulk-edit-title"
    >
      <DialogTitle
        id="bulk-edit-title"
        sx={{ fontWeight: 600, fontSize: '1.25rem' }}
      >
        Массовое редактирование статусов
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Информация о выборе */}
          <Typography variant="body2" color="textSecondary">
            Выбрано: {selectedIds.length} из {technologies.length} технологий
          </Typography>

          {/* Выбор статуса */}
          <FormControl fullWidth required>
            <InputLabel id="status-label">Новый статус</InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Новый статус"
              inputProps={{
                'aria-label': 'Выберите новый статус',
                'aria-required': true,
              }}
            >
              {STATUS_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Список технологий */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < technologies.length
                  }
                  inputProps={{
                    'aria-label': 'Выбрать все технологии',
                  }}
                />
              }
              label="Выбрать все"
              sx={{ mb: 1 }}
            />

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                maxHeight: '300px',
                overflow: 'auto',
                backgroundColor: 'background.paper',
              }}
              role="region"
              aria-label="Список технологий для выбора"
            >
              <List sx={{ width: '100%' }}>
                {technologies.map((tech, index) => (
                  <ListItem
                    key={tech.id}
                    disablePadding
                    divider={index < technologies.length - 1}
                  >
                    <ListItemButton
                      role="checkbox"
                      onClick={() => handleSelectTechnology(tech.id)}
                      aria-checked={selectedIds.includes(tech.id)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedIds.includes(tech.id)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                            'aria-label': `Выбрать ${tech.name}`,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tech.name}
                        secondary={`Статус: ${
                          STATUS_OPTIONS.find(
                            opt => opt.value === tech.status
                          )?.label || 'Неизвестен'
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          aria-label="Отменить редактирование"
        >
          Отменить
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          disabled={selectedIds.length === 0}
          aria-label={`Применить новый статус к ${selectedIds.length} технологиям`}
        >
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkStatusEditor;
