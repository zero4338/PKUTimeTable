import React from 'react';
import { createRoot } from 'react-dom/client';
import { Login } from './login';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Login />);
}
