import { Route, Routes } from 'react-router-dom';
import Builder from './pages/Builder';
import Admin from './pages/Admin';
import Account from './pages/Account';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Builder />} />
      <Route path="/account" exact element={<Account />} />
      <Route path="/account/login" element={<Account action='login' />} />
      <Route path="/account/register" element={<Account action='register' />} />
      <Route path="/account/logout" element={<Account action='logout' />} />
      <Route path="/admin" exact element={<Admin />} />
    </Routes>
  );
};

export default AppRouter;
