// src/context/AppProvider.jsx
import React from 'react';
import {MenuProvider} from './MenuContext';
import {EmployeeProvider} from './EmployeeContext';
import {MenuStateProvider} from '../state/MenuState';
// Import any other future contexts here (e.g., AuthProvider, ThemeProvider)

export function AppProvider ({children}) {
    return (
        <MenuProvider>
            <MenuStateProvider>
                <EmployeeProvider>
                    {children}
                </EmployeeProvider>
            </MenuStateProvider>
        </MenuProvider>
    );
}
