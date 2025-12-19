import React, { useMemo, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    LinearProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTech } from '../contexts/TechContext';
import { useNotification } from '../contexts/NotificationContext';



// Status Histogram Component with SVG
const StatusHistogram = ({ stats }) => {
    const theme = useTheme();
    const total = stats.completed + stats['in-progress'] + stats['not-started'];
    
    if (total === 0) {
        return (
            <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                Нет данных для отображения
            </Typography>
        );
    }

    const data = [
        { label: 'Выполнено', value: stats.completed, color: theme.palette.success.main },
        { label: 'В процессе', value: stats['in-progress'], color: theme.palette.warning.main },
        { label: 'Не начато', value: stats['not-started'], color: theme.palette.error.main }
    ];

    const maxValue = Math.max(...data.map(item => item.value));
    const maxHeight = 180;

    return (
        <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <svg width="100%" height="250" style={{ overflow: 'visible', minWidth: '300px' }}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <line
                        key={`grid-${i}`}
                        x1="0"
                        y1={50 + i * 40}
                        x2="100%"
                        y2={50 + i * 40}
                        stroke={theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'}
                        strokeWidth="1"
                        strokeDasharray="5,5"
                    />
                ))}

                {data.map((item, index) => {
                    const barWidth = 60;
                    const gap = 40;
                    const x = 50 + index * (barWidth + gap);
                    const height = maxValue > 0 ? (item.value / maxValue) * maxHeight : 0;
                    const y = 200 - height;

                    return (
                        <g key={item.label}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={height}
                                fill={item.color}
                                rx="4"
                                ry="4"
                                style={{ transition: 'height 0.8s ease' }}
                            />
                            
                            <text
                                x={x + barWidth / 2}
                                y={y - 10}
                                textAnchor="middle"
                                fill={theme.palette.text.primary}
                                fontWeight="bold"
                                fontSize="14"
                            >
                                {item.value}
                            </text>
                            
                            <text
                                x={x + barWidth / 2}
                                y={225}
                                textAnchor="middle"
                                fill={theme.palette.text.secondary}
                                fontSize="12"
                            >
                                {item.label}
                            </text>
                        </g>
                    );
                })}

                <line
                    x1="40"
                    y1="50"
                    x2="40"
                    y2="200"
                    stroke={theme.palette.mode === 'dark' ? '#666' : '#333'}
                    strokeWidth="2"
                />

                <line
                    x1="40"
                    y1="200"
                    x2="100%"
                    y2="200"
                    stroke={theme.palette.mode === 'dark' ? '#666' : '#333'}
                    strokeWidth="2"
                />
            </svg>
        </Box>
    );
};

// Category Histogram Component with SVG
const CategoryHistogram = ({ categoryStats }) => {
    const theme = useTheme();
    const categories = Object.entries(categoryStats);
    
    if (categories.length === 0) return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Категории не определены</Typography>;

    const sortedData = categories
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    const maxValue = Math.max(...sortedData.map(item => item.count));
    const maxHeight = 180;

    const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.info.main,
        '#ff9800',
        '#009688'
    ];

    return (
        <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <svg width="100%" height="300" style={{ overflow: 'visible', minWidth: '400px' }}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <line
                        key={`cat-grid-${i}`}
                        x1="0"
                        y1={50 + i * 40}
                        x2="100%"
                        y2={50 + i * 40}
                        stroke={theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'}
                        strokeWidth="1"
                        strokeDasharray="5,5"
                    />
                ))}

                {sortedData.map((item, index) => {
                    const barWidth = 50;
                    const gap = 20;
                    const x = 60 + index * (barWidth + gap);
                    const height = maxValue > 0 ? (item.count / maxValue) * maxHeight : 0;
                    const y = 200 - height;
                    const color = colors[index % colors.length];

                    return (
                        <g key={item.name}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={height}
                                fill={color}
                                rx="4"
                                ry="4"
                                style={{ transition: 'height 0.8s ease' }}
                            />
                            
                            <text
                                x={x + barWidth / 2}
                                y={y - 10}
                                textAnchor="middle"
                                fill={theme.palette.text.primary}
                                fontWeight="bold"
                                fontSize="14"
                            >
                                {item.count}
                            </text>
                            
                            <text
                                x={x + barWidth / 2}
                                y={225}
                                textAnchor="end"
                                fill={theme.palette.text.secondary}
                                fontSize="11"
                                transform={`rotate(-45, ${x + barWidth / 2}, 225)`}
                            >
                                {item.name}
                            </text>
                        </g>
                    );
                })}

                <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="200"
                    stroke={theme.palette.mode === 'dark' ? '#666' : '#333'}
                    strokeWidth="2"
                />

                <line
                    x1="50"
                    y1="200"
                    x2="100%"
                    y2="200"
                    stroke={theme.palette.mode === 'dark' ? '#666' : '#333'}
                    strokeWidth="2"
                />
            </svg>
        </Box>
    );
};



function Statistics() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { technologies } = useTech();
    const { showNotification } = useNotification();
    
    const [completeAllDialog, setCompleteAllDialog] = useState(false);
    const [resetAllDialog, setResetAllDialog] = useState(false);

    const statusStats = useMemo(() => {
        return technologies.reduce((acc, tech) => {
            acc[tech.status] = (acc[tech.status] || 0) + 1;
            return acc;
        }, { 'completed': 0, 'in-progress': 0, 'not-started': 0 });
    }, [technologies]);

    const categoryStats = useMemo(() => {
        return technologies.reduce((acc, tech) => {
            const cat = tech.category || 'Прочее';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
    }, [technologies]);

    const progressPercentage = useMemo(() => {
        const total = technologies.length;
        if (total === 0) return 0;
        return ((statusStats.completed + statusStats['in-progress'] * 0.5) / total) * 100;
    }, [technologies, statusStats]);

    const handleMarkAllComplete = () => {
        technologies.forEach(tech => {
            if (tech.status !== 'completed') {
                const updated = { ...tech, status: 'completed' };
                // Обновляем каждую технологию
                const allTechs = technologies.map(t => t.id === tech.id ? updated : t);
                // Используем контекст для обновления
            }
        });
        // Обновляем все сразу
        const updated = technologies.map(tech => ({
            ...tech,
            status: 'completed'
        }));
        localStorage.setItem('techTrackerData', JSON.stringify(updated));
        window.location.reload();
        setCompleteAllDialog(false);
    };

    const handleResetAllStatuses = () => {
        const updated = technologies.map(tech => ({
            ...tech,
            status: 'not-started'
        }));
        localStorage.setItem('techTrackerData', JSON.stringify(updated));
        window.location.reload();
        setResetAllDialog(false);
    };

    if (technologies.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                    Добавьте технологии для просмотра статистики
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: isMobile ? 2 : 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    📊 Аналитика
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Status Statistics Card */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                📊 По статусам
                            </Typography>
                            <StatusHistogram stats={statusStats} />

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <CheckCircleIcon
                                            sx={{
                                                color: theme.palette.success.main,
                                                fontSize: 28,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {statusStats.completed}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Завершено
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <AccessTimeIcon
                                            sx={{
                                                color: theme.palette.warning.main,
                                                fontSize: 28,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {statusStats['in-progress']}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            В процессе
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <PlayArrowIcon
                                            sx={{
                                                color: theme.palette.error.main,
                                                fontSize: 28,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {statusStats['not-started']}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Не начато
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Category Statistics Card */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                🏷️ По категориям
                            </Typography>
                            <CategoryHistogram categoryStats={categoryStats} />

                            <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                    Всего: {Object.keys(categoryStats).length} категорий
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.entries(categoryStats)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 6)
                                        .map(([name, count]) => (
                                            <Typography
                                                key={name}
                                                variant="body2"
                                                sx={{
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.contrastText,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 3,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {name}: {count}
                                            </Typography>
                                        ))}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Overall Statistics */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                📈 Общая статистика
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            {technologies.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                            Всего
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                            {progressPercentage.toFixed(0)}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                            Прогресс
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                                            {statusStats['in-progress']}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                            В работе
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                            {statusStats.completed}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                            Выполнено
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Progress Bars */}
                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            ✅ Завершено
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {statusStats.completed} / {technologies.length}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(statusStats.completed / technologies.length) * 100}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'rgba(0,0,0,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: theme.palette.success.main,
                                                borderRadius: 5,
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            🔄 В процессе
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {statusStats['in-progress']} / {technologies.length}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(statusStats['in-progress'] / technologies.length) * 100}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'rgba(0,0,0,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: theme.palette.warning.main,
                                                borderRadius: 5,
                                            }
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            📁 Не начато
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {statusStats['not-started']} / {technologies.length}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(statusStats['not-started'] / technologies.length) * 100}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'rgba(0,0,0,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: theme.palette.error.main,
                                                borderRadius: 5,
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Mark All Complete Dialog */}
            <Dialog open={completeAllDialog} onClose={() => setCompleteAllDialog(false)}>
                <DialogTitle>Отметить все выполненным?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mt: 1 }}>
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
                <DialogContent>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Все технологии вернут статус "Не начато". Это действие нельзя отменить.
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
        </Container>
    );
}

export default Statistics;