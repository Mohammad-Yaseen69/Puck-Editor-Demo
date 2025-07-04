import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addPage, editPage } from '../store/pagesSlice';
import type { Page } from '../store/pagesSlice'
import { useState, useEffect, } from 'react';
import { Puck } from '@measured/puck';
import type { Config, Data } from '@measured/puck';
import "@measured/puck/puck.css"
import PuckConfig from '../config/PuckConfig.tsx';



export default function PageEditor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector((state: RootState) => state.pages.pages.find(p => p.id === id));
  const [name, setName] = useState(page?.name || '');
  const [content, setContent] = useState<unknown>(page?.content || {});

  useEffect(() => {
    if (page) {
      setName(page.name);
      setContent(page?.content);
    }
  }, [page]);

  const handleSave = () => {
    const safeContent = content;
    const newPage: Page = { id: id!, name, content: safeContent };
    if (page) {
      dispatch(editPage(newPage));
    } else {
      dispatch(addPage(newPage));
    }
    navigate('/');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
      </div>
      <div className="bg-white w-full rounded shadow p-4">
        <Puck
          config={PuckConfig as unknown as Config}
          data={content as Data}
          onChange={setContent}
          onPublish={handleSave}
        />

      </div>
    </div>
  );
} 