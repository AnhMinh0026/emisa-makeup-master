import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout.jsx';
import Home from './pages/Home/Home.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/style-galleries" element={<StyleGalleries />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
