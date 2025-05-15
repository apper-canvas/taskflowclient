import { createSlice } from '@reduxjs/toolkit';
import { initializeStreakData } from '../utils/streakUtils';

const initialState = {
  streakData: initializeStreakData(),
  loading: false,
  error: null
};

export const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    setStreakLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStreakError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setStreakData: (state, action) => {
      state.streakData = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateStreakData: (state, action) => {
      state.streakData = {
        ...state.streakData,
        ...action.payload
      };
    }
  }
});

export const { setStreakLoading, setStreakError, setStreakData, updateStreakData } = streakSlice.actions;
export default streakSlice.reducer;