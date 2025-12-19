import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormHelperText,
  Alert,
} from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import { useTech } from '../contexts/TechContext';

const DeadlineForm = ({ open, onClose, onSubmit, technology = null }) => {
  const [formData, setFormData] = useState({
    name: technology?.name || '',
    startDate: technology?.startDate || '',
    deadline: technology?.deadline || '',
    description: technology?.description || '',
  });

  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();
  const { technologies } = useTech();

  const validateForm = useCallback(() => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.name.trim()) {
      newErrors.name = 'Имя технологии требуется';
    } else {
      // Проверяем существование технологии
      const techExists = technologies.some(t => 
        t.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (!techExists) {
        newErrors.name = 'Технология с таким названием не существует';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала требуется';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Срок требуется';
    }

    if (formData.startDate && formData.deadline) {
      if (formData.startDate > formData.deadline) {
        newErrors.deadline = 'Срок должен быть после даты начала';
      }
      if (formData.startDate < today) {
        newErrors.startDate = 'Дата начала не может быть в прошлом';
      }
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, technologies]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Очистить ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        startDate: '',
        deadline: '',
        description: '',
      });
      setErrors({});
      showNotification('Сроки успешно установлены', 'success');
      onClose();
    }
  }, [formData, validateForm, onSubmit, onClose, showNotification]);

  const handleCancel = useCallback(() => {
    setFormData({
      name: '',
      startDate: '',
      deadline: '',
      description: '',
    });
    setErrors({});
    onClose();
  }, [onClose]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      role="dialog"
      aria-labelledby="deadline-dialog-title"
    >
      <DialogTitle
        id="deadline-dialog-title"
        sx={{ fontWeight: 600, fontSize: '1.25rem' }}
      >
        Установить сроки изучения
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Поле для имени */}
          <TextField
            fullWidth
            label="Имя технологии"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            disabled={!!technology}
            inputProps={{
              'aria-label': 'Имя технологии',
              'aria-required': true,
              'aria-describedby': errors.name ? 'name-error' : undefined,
            }}
          />

          {/* Дата начала */}
          <Box>
            <TextField
              fullWidth
              label="Дата начала"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: today,
                'aria-label': 'Дата начала изучения',
                'aria-required': true,
                'aria-describedby': errors.startDate ? 'startDate-error' : undefined,
              }}
              required
            />
            {errors.startDate && (
              <FormHelperText id="startDate-error" error role="alert">
                {errors.startDate}
              </FormHelperText>
            )}
          </Box>

          {/* Срок (deadline) */}
          <Box>
            <TextField
              fullWidth
              label="Срок завершения"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              error={!!errors.deadline}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: formData.startDate || today,
                'aria-label': 'Срок завершения',
                'aria-required': true,
                'aria-describedby': errors.deadline ? 'deadline-error' : undefined,
              }}
              required
            />
            {errors.deadline && (
              <FormHelperText id="deadline-error" error role="alert">
                {errors.deadline}
              </FormHelperText>
            )}
          </Box>

          {/* Описание */}
          <Box>
            <TextField
              fullWidth
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              multiline
              rows={3}
              placeholder="Введите описание целей обучения (максимум 500 символов)"
              inputProps={{
                maxLength: 500,
                'aria-label': 'Описание целей обучения',
                'aria-describedby': errors.description ? 'description-error' : 'char-count',
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {errors.description ? (
                <FormHelperText id="description-error" error role="alert">
                  {errors.description}
                </FormHelperText>
              ) : null}
              <Typography
                variant="caption"
                id="char-count"
                sx={{ ml: 'auto', color: 'text.secondary' }}
              >
                {formData.description.length}/500
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          aria-label="Отменить установку сроков"
        >
          Отменить
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          aria-label="Сохранить сроки"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeadlineForm;
