import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { deletePageLocal, addPageLocal, savePages, fetchPages, type Page } from '../store/pagesSlice';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

export default function HomePage() {
  const { pages, loading, error } = useSelector((state: RootState) => state.pages) as { pages: Page[], loading: boolean, error: string | null };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleAdd = () => {
    const id = uuidv4();
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this page?')) {
      dispatch(deletePageLocal(id));
      setTimeout(() => {
        dispatch(savePages(pages.filter(p => p.id !== id)));
      }, 0);
    }
  };

  const handleDuplicate = (page: Page) => {
    const newPage: Page = {
      ...page,
      id: uuidv4(),
      name: page.name + ' (Copy)',
    };
    dispatch(addPageLocal(newPage));
    setTimeout(() => {
      dispatch(savePages([...pages, newPage]));
    }, 0);
  };

  console.log(pages)

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
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4">
        {/* {pages.length === 0 && !loading && <div className="text-gray-500">No pages yet.</div>} */}
        {pages?.map(page => (
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
                className="text-yellow-600 hover:underline"
                onClick={() => handleDuplicate(page)}
              >
                Duplicate
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