import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

// Провайдер контекста
export function UserProvider({ children }) {
    const [userRole, setUserRole] = useState(() => {
        const savedRole = localStorage.getItem('userRole');
        return savedRole || 'user'; 
    });

    // Сохраняем роль в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('userRole', userRole);
        
        // Можно также логировать смену роли для отладки
        console.log(`Роль пользователя изменена на: ${userRole}`);
    }, [userRole]);

    // Функция для изменения роли
    const changeUserRole = (newRole) => {
        setUserRole(newRole);
        return newRole;
    };

    // Значение контекста
    const value = {
        userRole,
        setUserRole: changeUserRole,
        isAdmin: userRole === 'admin'
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// Хук для использования контекста
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser должен использоваться внутри UserProvider');
    }
    return context;
}

export default UserContext;