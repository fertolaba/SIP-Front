import logo from './logo.svg';
import './App.css';
import Registro from './componentes/Registro';
import Login from './componentes/Login';
import { RouterProvider } from 'react-router-dom';
import router from './componentes/Routes';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
