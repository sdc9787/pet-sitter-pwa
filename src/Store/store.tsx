import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialTabbarState: { state: number } = { state: 0 };

let tabbar = createSlice({
  name: "tabbar",
  initialState: initialTabbarState,
  reducers: {
    selectedTab(state, action: PayloadAction<number>) {
      state.state = action.payload;
    },
  },
});

let store = configureStore({
  reducer: {
    tabbar: tabbar.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let { selectedTab } = tabbar.actions;

export default store;
