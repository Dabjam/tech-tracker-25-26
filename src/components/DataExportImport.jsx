import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  Download,
  Upload,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext';
import {
  exportToJSON,
  readJSONFile,
  validateImportData,
  normalizeImportedData,
} from '../utils/dataValidator';

const DataExportImport = ({ technologies, onImportSuccess }) => {
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { showNotification } = useNotification();

  const handleExport = useCallback(() => {
    try {
      if (!technologies || technologies.length === 0) {
        showNotification('Нет данных для экспорта', 'warning');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      exportToJSON(technologies, `technologies-${timestamp}.json`);
      showNotification(
        `Экспортировано ${technologies.length} технологий`,
        'success'
      );
    } catch (error) {
      showNotification(`Ошибка экспорта: ${error.message}`, 'error');
    }
  }, [technologies, showNotification]);

  const handleImportClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка расширения файла
    if (!file.name.endsWith('.json')) {
      showNotification('Пожалуйста, выберите JSON файл', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Проверка размера (не более 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Файл слишком большой (максимум 5MB)', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setImportLoading(true);
    setImportErrors([]);

    try {
      const data = await readJSONFile(file);
      const validationErrors = validateImportData(data);

      if (validationErrors.length > 0) {
        setImportErrors(validationErrors);
        setOpenImportDialog(true);
        setImportLoading(false);
        return;
      }

      const normalizedData = normalizeImportedData(data);
      onImportSuccess(normalizedData);
      showNotification(
        `Импортировано ${normalizedData.length} технологий`,
        'success'
      );
      setImportErrors([]);
      setOpenImportDialog(false);
    } catch (error) {
      showNotification(`Ошибка импорта: ${error.message}`, 'error');
      setImportErrors([error.message]);
      setOpenImportDialog(true);
    } finally {
      setImportLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [showNotification, onImportSuccess]);

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Кнопка экспорта */}
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={handleExport}
        disabled={!technologies || technologies.length === 0}
        aria-label="Экспортировать технологии в JSON"
      >
        Экспорт
      </Button>

      {/* Кнопка импорта */}
      <Button
        variant="contained"
        startIcon={importLoading ? <CircularProgress size={20} /> : <Upload />}
        onClick={handleImportClick}
        disabled={importLoading}
        aria-label="Импортировать технологии из JSON"
      >
        Импорт
      </Button>

      {/* Диалог ошибок импорта */}
      <Dialog
        open={openImportDialog && importErrors.length > 0}
        onClose={() => setOpenImportDialog(false)}
        fullWidth
        maxWidth="sm"
        role="alertdialog"
        aria-labelledby="import-error-title"
      >
        <DialogTitle id="import-error-title">
          Ошибки при импорте
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Обнаружено {importErrors.length} ошибок валидации
          </Alert>

          <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {importErrors.map((error, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={`Ошибка ${index + 1}`}
                  secondary={error}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
            Пожалуйста, проверьте структуру JSON и повторите попытку.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenImportDialog(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataExportImport;
