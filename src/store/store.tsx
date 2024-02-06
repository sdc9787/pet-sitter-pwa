import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const 초기값: { count: number; user: string } = { count: 1, user: "kim" };

let user = createSlice({
  name: "user",
  initialState: 초기값,
  reducers: {
    rt(state, action: PayloadAction<number>) {
      state.count += action.payload;
    },
  },
});

let store = configureStore({
  reducer: {
    user: user.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let { rt } = user.actions;

export default store;
