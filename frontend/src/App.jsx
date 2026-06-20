import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout/AdminLayout.jsx';
import Home from './pages/Home/Home.jsx';
import StyleGallery from './pages/StyleGallery/StyleGallery.jsx';
import AdminGallery from './pages/Admin/AdminGallery.jsx';
import AdminCategories from './pages/Admin/AdminCategories.jsx';
import AdminContact from './pages/Admin/AdminContact.jsx';
import AdminServices from './pages/Admin/AdminServices.jsx';
import AdminCourses from './pages/Admin/AdminCourses.jsx';
import MakeupPricing from './pages/Pricing/MakeupPricing.jsx';
import CoursePricing from './pages/Pricing/CoursePricing.jsx';
import CourseDetail from './pages/Courses/CourseDetail.jsx';
import Contact from './pages/Contact/Contact.jsx';

/**
 * The root application component configuring client and admin routing.
 *
 * @returns {JSX.Element} The main application router.
 */
function App() {
  return (
    <BrowserRouter>
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

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminGallery />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="contact" element={<AdminContact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
