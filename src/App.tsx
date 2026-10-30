import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AdminProvider } from './store/AdminContext';
import { ThemeProvider } from './store/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
    </ThemeProvider>
  );
};

export default App;
