import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout/AdminLayout.jsx';
import Home from './pages/Home/Home.jsx';
import StyleGallery from './pages/StyleGallery/StyleGallery.jsx';
import AdminGallery from './pages/Admin/AdminGallery.jsx';
import AdminCategories from './pages/Admin/AdminCategories.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Client-facing routes ── */}
        <Route element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/styles/:categorySlug" element={<StyleGallery />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Route>

        {/* ── Admin routes ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminGallery />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
