import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <--- DƏYİŞİKLİK: HashRouter
import App from './App';
import './index.css';
import { SettingsProvider } from './Context/SettingsContext';
import { DataProvider } from './Context/DataContext';
import { ChatProvider } from './Context/ChatContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <DataProvider>
        <ChatProvider>
          {/* BrowserRouter əvəzinə HashRouter istifadə edirik */}
          <HashRouter> 
            <App />
          </HashRouter>
        </ChatProvider>
      </DataProvider>
    </SettingsProvider>
  </React.StrictMode>
);