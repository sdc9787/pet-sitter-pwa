import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialTabbarState: { state: number } = { state: 0 };
const initialAlertboxState: { state: boolean; text: string } = { state: false, text: "" };

let tabbar = createSlice({
  name: "tabbar",
  initialState: initialTabbarState,
  reducers: {
    selectedTab(state, action: PayloadAction<number>) {
      state.state = action.payload;
    },
  },
});

let alertbox = createSlice({
  name: "alertbox",
  initialState: initialAlertboxState,
  reducers: {
    alertOn(state, action: PayloadAction<string>) {
      state.state = true;
      state.text = action.payload;
    },
    alertOff(state) {
      state.state = false;
    },
  },
});

let store = configureStore({
  reducer: {
    tabbar: tabbar.reducer,
    alertbox: alertbox.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let { selectedTab } = tabbar.actions;
export let { alertOn, alertOff } = alertbox.actions;

export default store;
