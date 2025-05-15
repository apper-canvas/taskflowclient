import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tasksReducer from './tasksSlice';
import streakReducer from './streakSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    streak: streakReducer
  }
});

export default store;