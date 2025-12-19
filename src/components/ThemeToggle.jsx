import React from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip
      title={mode === 'light' ? 'Включить тёмный режим' : 'Включить светлый режим'}
      arrow
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size="large"
        aria-label={`Переключиться на ${mode === 'light' ? 'тёмный' : 'светлый'} режим`}
        aria-pressed={mode === 'dark'}
      >
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
