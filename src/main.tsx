import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {PortfolioDataProvider} from './context/PortfolioDataContext.tsx';
import {LanguageProvider} from './i18n/LanguageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <PortfolioDataProvider>
      <App />
    </PortfolioDataProvider>
  </LanguageProvider>,
);
