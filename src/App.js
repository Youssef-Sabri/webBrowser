import React from 'react';
import BrowserWindow from './components/BrowserWindow';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserProvider } from './contexts/BrowserContext';

function App() {
  return (
    <AuthProvider>
      <BrowserProvider>
        <div className="App">
          <BrowserWindow />
        </div>
      </BrowserProvider>
    </AuthProvider>
  );
}

export default App;