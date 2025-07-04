import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Page {
  id: string;
  name: string;
  content: unknown;
}

interface PagesState {
  pages: Page[];
}

const loadPages = (): Page[] => {
  try {
    const data = localStorage.getItem('pages');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const savePages = (pages: Page[]) => {
  localStorage.setItem('pages', JSON.stringify(pages));
};

const initialState: PagesState = {
  pages: loadPages(),
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    addPage: (state, action: PayloadAction<Page>) => {
      state.pages.push(action.payload);
      savePages(state.pages);
    },
    editPage: (state, action: PayloadAction<Page>) => {
      const idx = state.pages.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.pages[idx] = action.payload;
        savePages(state.pages);
      }
    },
    deletePage: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter(p => p.id !== action.payload);
      savePages(state.pages);
    },
  },
});

export const { addPage, editPage, deletePage } = pagesSlice.actions;
export default pagesSlice.reducer; 