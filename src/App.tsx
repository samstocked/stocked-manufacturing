import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from './components/Layout';
import GoodsInPage from './pages/GoodsInPage';
import ProductionPage from './pages/ProductionPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/goods-in" element={<GoodsInPage />} />
              <Route path="/production" element={<ProductionPage />} />
              <Route path="/" element={<GoodsInPage />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
