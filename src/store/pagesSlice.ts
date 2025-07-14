import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Demo: Replace with your actual bin ID and API key from jsonbin.io
const BIN_ID = '687510055d646f1c273f75d1';
const API_KEY = '$2a$10$JzSLNvt0K8kYCBqkzkbewePgB3y4OAUhUueZVVEA/VrZNJJdNVXDm';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export interface Page {
  id: string;
  name: string;
  content: unknown;
}

interface PagesState {
  pages: Page[];
  loading: boolean;
  error: string | null;
}

// Async thunk to load pages from jsonbin.io
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL + '/latest', {
        headers: {
          'X-Master-Key': API_KEY,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data = await res.json();
      return data.record 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to save pages to jsonbin.io
export const savePages = createAsyncThunk<
  Page[],
  Page[],
  { rejectValue: string }
>(
  'pages/savePages',
  async (pages, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(pages),
      });
      if (!res.ok) throw new Error('Failed to save pages');
      const data = await res.json();
      return data.record as Page[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState: PagesState = {
  pages: [],
  loading: false,
  error: null,
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    addPageLocal: (state, action: PayloadAction<Page>) => {
      state.pages.push(action.payload);
    },
    editPageLocal: (state, action: PayloadAction<Page>) => {
      const idx = state.pages.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.pages[idx] = action.payload;
      }
    },
    deletePageLocal: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.pages = action.payload;
        state.loading = false;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(savePages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePages.fulfilled, (state, action) => {
        state.pages = action.payload;
        state.loading = false;
      })
      .addCase(savePages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPageLocal, editPageLocal, deletePageLocal } = pagesSlice.actions;
export default pagesSlice.reducer; 