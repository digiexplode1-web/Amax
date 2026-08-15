import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirebaseErrorCard } from './components/FirebaseErrorCard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartToastNotification } from './components/CartToastNotification';
import { SplashScreen } from './components/SplashScreen';

// Main Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Categories } from './pages/Categories';
import { CategoryDetail } from './pages/CategoryDetail';
import { ProductDetail } from './pages/ProductDetail';
import { SearchPage } from './pages/SearchPage';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { Orders } from './pages/Orders';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Policies } from './pages/Policies';
import { Diagnostics } from './pages/Diagnostics';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminGuard } from './pages/admin/AdminGuard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminErrorBoundary } from './components/AdminErrorBoundary';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Categories as AdminCategories } from './pages/admin/Categories';
import { Enquiries as AdminEnquiries } from './pages/admin/Enquiries';
import { Settings as AdminSettings } from './pages/admin/Settings';
import { HomepageEditor } from './pages/admin/HomepageEditor';
import { MediaLibrary, Orders as AdminOrders, VisualEditor } from './pages/admin/DummyPages';

import { initCapacitorUi } from './utils/capacitorUtils';
import { useAndroidBackButton } from './hooks/useAndroidBackButton';

const ScrollToTopAndCapacitor: React.FC = () => {
  const { pathname } = useLocation();
  useAndroidBackButton();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  React.useEffect(() => {
    initCapacitorUi();
  }, []);

  return null;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#FFF9F0] text-[#25201E] flex flex-col font-sans selection:bg-[#751C2F] selection:text-white">
    <FirebaseErrorCard />
    <CartToastNotification />
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
    <MobileBottomNav />
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <ErrorBoundary>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AuthProvider>
        <ShopProvider>
          <Router>
            <ScrollToTopAndCapacitor />
            <Routes>
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={
                <AdminErrorBoundary>
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                </AdminErrorBoundary>
              }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="homepage" element={<HomepageEditor />} />
                <Route path="editor" element={<VisualEditor />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              {/* Customer Routes */}
              <Route path="/*" element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:categoryId" element={<CategoryDetail />} />
                    <Route path="/product/:productId" element={<ProductDetail />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Auth />} />
                    <Route path="/forgot-password" element={<Auth />} />
                    <Route path="/account" element={<Auth />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderId" element={<Orders />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<Policies />} />
                    <Route path="/terms" element={<Policies />} />
                    <Route path="/shipping-policy" element={<Policies />} />
                    <Route path="/return-refund-policy" element={<Policies />} />
                    <Route path="/diagnostics" element={<Diagnostics />} />
                    {/* Fallback wildcard to Home */}
                    <Route path="*" element={<Home />} />
                  </Routes>
                </MainLayout>
              } />
            </Routes>
          </Router>
        </ShopProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
