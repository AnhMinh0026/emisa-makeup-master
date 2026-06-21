import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout/AdminLayout.jsx';
import Home from './pages/Home/Home.jsx';
import StyleGallery from './pages/StyleGallery/StyleGallery.jsx';
import {
  AdminGallery,
  AdminCategories,
  AdminContact,
  AdminServices,
  AdminCourses,
  ProtectedRoute
} from './features/admin';
import MakeupPricing from './pages/Pricing/MakeupPricing.jsx';
import CoursePricing from './pages/Pricing/CoursePricing.jsx';
import { CourseDetail } from './features/courses';
import { Contact } from './features/contact';
import { Login } from './features/auth';
import ScrollToTop from './components/ScrollToTop.jsx';

/**
 * The root application component configuring client and admin routing.
 *
 * @returns {JSX.Element} The main application router.
 */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* --- Client-Facing Routes --- */}
        <Route element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/styles/:categorySlug" element={<StyleGallery />} />
          <Route path="/pricing/makeup" element={<MakeupPricing />} />
          <Route path="/pricing/courses" element={<CoursePricing />} />
          <Route path="/pricing/courses/:id" element={<CourseDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* --- Auth Routes --- */}
        <Route path="/login" element={<Login />} />

        {/* --- Admin Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminGallery />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="contact" element={<AdminContact />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
