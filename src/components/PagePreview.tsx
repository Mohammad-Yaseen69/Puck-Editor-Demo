import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Render, type Config, type Data } from '@measured/puck';
import PuckConfig from '../config/PuckConfig.tsx';


export default function PagePreview() {
  const { id } = useParams();
  const page = useSelector((state: RootState) => state.pages.pages.find(p => p.id === id));

  if (!page) {
    return <div className="text-red-500">Page not found.</div>;
  }

  console.log(page)
  return (
        <Render
          config={PuckConfig as Config}
          data={page.content as Data}
        />

  );
} 