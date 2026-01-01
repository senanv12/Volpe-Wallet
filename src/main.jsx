import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SettingsProvider } from './Context/SettingsContext';
import { DataProvider } from './Context/DataContext';
import { ChatProvider } from './Context/ChatContext'; // <-- YENİ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <DataProvider>
        <ChatProvider> {/* <-- YENİ: App-i əhatə etməlidir */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChatProvider>
      </DataProvider>
    </SettingsProvider>
  </React.StrictMode>
);