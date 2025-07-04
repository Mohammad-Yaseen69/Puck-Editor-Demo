import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PageEditor from './components/PageEditor';
import PagePreview from './components/PagePreview';

export default function App() {
  return (
    <div className=" bg-gray-50 text-gray-900">
      <div className="">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/edit/:id" element={<PageEditor />} />
          <Route path="/preview/:id" element={<PagePreview />} />
        </Routes>
      </div>
    </div>
  );
}
