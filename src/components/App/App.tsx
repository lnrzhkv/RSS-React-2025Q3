import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../AppLayout/AppLayout';
import AboutPage from '../../pages/AboutPage/AboutPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import PokemonList from '../PokemonList/PokemonList';
import { Provider } from 'react-redux';
import { store } from '../../shared/store/store';
import { ThemeProvider } from '../../context/ThemeContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<PokemonList />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
