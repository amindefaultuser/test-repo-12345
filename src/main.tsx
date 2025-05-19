import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './admin/AdminPanel'; 
import Layout from './page/layout'; 
import { HomePage, ProfilePage, ReferralPage, SupportPage,  LoginPage, PaymentPage, TransferPage, HistoryPage } from './page'; 
import PrivateRoute from './components/PrivateRoute';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<LoginPage />} />

      <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
      <Route path="/refferals" element={<PrivateRoute><Layout><ReferralPage /></Layout></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><Layout><SupportPage /></Layout></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute><Layout><PaymentPage /></Layout></PrivateRoute>} />
      <Route path="/transfer" element={<PrivateRoute><Layout><TransferPage /></Layout></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><Layout><HistoryPage /></Layout></PrivateRoute>} />
      <Route path="/admin/*" element={<AdminPanel/>} />
    </Routes>
  </BrowserRouter>
);
