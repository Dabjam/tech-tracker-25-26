/**
 * Валидация и обработка данных для экспорта/импорта
 */

const REQUIRED_FIELDS = ['id', 'name', 'status'];

const VALID_STATUSES = ['not-started', 'in-progress', 'completed', 'abandoned'];

/**
 * Валидирует структуру технологии
 */
export const validateTechnology = (tech, index) => {
  const errors = [];

  if (!tech || typeof tech !== 'object') {
    return [`Элемент ${index}: должен быть объектом`];
  }

  // Проверка обязательных полей
  REQUIRED_FIELDS.forEach(field => {
    if (!(field in tech)) {
      errors.push(`Элемент ${index}: отсутствует обязательное поле "${field}"`);
    }
  });

  // Проверка типов
  if (tech.id && typeof tech.id !== 'number' && typeof tech.id !== 'string') {
    errors.push(`Элемент ${index}: поле "id" должно быть числом или строкой`);
  }

  if (tech.name && typeof tech.name !== 'string') {
    errors.push(`Элемент ${index}: поле "name" должно быть строкой`);
  }

  if (!tech.name || tech.name.trim() === '') {
    errors.push(`Элемент ${index}: поле "name" не может быть пустым`);
  }

  if (tech.status && !VALID_STATUSES.includes(tech.status)) {
    errors.push(
      `Элемент ${index}: неверный статус "${tech.status}". Допустимые значения: ${VALID_STATUSES.join(', ')}`
    );
  }

  // Опциональные поля
  if (tech.description && typeof tech.description !== 'string') {
    errors.push(`Элемент ${index}: поле "description" должно быть строкой`);
  }

  if (tech.startDate && typeof tech.startDate !== 'string') {
    errors.push(`Элемент ${index}: поле "startDate" должно быть строкой`);
  }

  if (tech.deadline && typeof tech.deadline !== 'string') {
    errors.push(`Элемент ${index}: поле "deadline" должно быть строкой`);
  }

  if (tech.progress !== undefined && typeof tech.progress !== 'number') {
    errors.push(`Элемент ${index}: поле "progress" должно быть числом`);
  }

  return errors;
};

/**
 * Валидирует JSON данные
 */
export const validateImportData = (data) => {
  const errors = [];

  if (!Array.isArray(data)) {
    errors.push('Данные должны быть массивом технологий');
    return errors;
  }

  if (data.length === 0) {
    errors.push('Массив технологий пуст');
    return errors;
  }

  if (data.length > 1000) {
    errors.push('Слишком много технологий (максимум 1000)');
    return errors;
  }

  // Проверка каждой технологии
  data.forEach((tech, index) => {
    const techErrors = validateTechnology(tech, index);
    errors.push(...techErrors);
  });

  return errors;
};

/**
 * Экспортирует данные в JSON файл
 */
export const exportToJSON = (technologies, filename = 'technologies.json') => {
  const dataStr = JSON.stringify(technologies, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Читает JSON файл
 */
export const readJSONFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error(`Ошибка парсинга JSON: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsText(file);
  });
};

/**
 * Нормализует импортированные данные
 */
export const normalizeImportedData = (data) => {
  return data.map(tech => ({
    id: tech.id || Date.now() + Math.random(),
    name: tech.name?.trim() || 'Без названия',
    status: tech.status || 'not-started',
    description: tech.description?.trim() || '',
    startDate: tech.startDate || '',
    deadline: tech.deadline || '',
    progress: tech.progress || 0,
  }));
};

/**
 * Проверяет валидность JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
