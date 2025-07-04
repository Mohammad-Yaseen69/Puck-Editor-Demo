import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { deletePage, type Page } from '../store/pagesSlice';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const pages = useSelector((state: RootState) => state.pages.pages) as Page[];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdd = () => {
    const id = uuidv4();
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this page?')) {
      dispatch(deletePage(id));
    }
  };

  return (
    <div className='max-w-3xl mx-auto py-8 px-4'>
      <div className="flex justify-between  items-center mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          + Add New Page
        </button>
      </div>
      <div className="space-y-4">
        {pages.length === 0 && <div className="text-gray-500">No pages yet.</div>}
        {pages.map(page => (
          <div key={page.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
             {/* @ts-ignore */}
            <div className="font-medium">{page.content?.root?.props?.title || 'Untitled Page'}</div>
            
            <div className="space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => navigate(`/preview/${page.id}`)}
              >
                Preview
              </button>
              <button
                className="text-green-600 hover:underline"
                onClick={() => navigate(`/edit/${page.id}`)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(page.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 