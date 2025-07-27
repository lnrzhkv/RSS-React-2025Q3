import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../AppLayout/AppLayout';
import { GlobalProvider } from '../../context/GlobalContext';
import AboutPage from '../../pages/AboutPage/AboutPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import PokemonList from '../PokemonList/PokemonList';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<PokemonList />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default App;
