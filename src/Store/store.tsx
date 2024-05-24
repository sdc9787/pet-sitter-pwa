import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialTabbarState: { state: number } = { state: 0 };
const initialAlertboxState: { state: boolean; text: string } = { state: false, text: "" };
const initialReservationState: { petId: number; walkTime: number; latitude: number; longitude: number; address: string; detailAddress: string; title: string; content: string; id?: number } = {
  petId: 0,
  walkTime: 30,
  latitude: 0,
  longitude: 0,
  address: "",
  detailAddress: "",
  title: "",
  content: "",
};

//탭바
let tabbar = createSlice({
  name: "tabbar",
  initialState: initialTabbarState,
  reducers: {
    selectedTab(state, action: PayloadAction<number>) {
      state.state = action.payload;
    },
  },
});

//알림창
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

//산책 예약 정보
let reservation = createSlice({
  name: "reservation",
  initialState: initialReservationState,
  reducers: {
    setWalkTime: (state, action) => {
      state.walkTime = action.payload;
    },
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.address = action.payload.address;
      state.detailAddress = action.payload.detailAddress;
    },
    setPetId: (state, action) => {
      state.petId = action.payload;
    },
    setTitleAndContent: (state, action) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    setWalkDataAll: (state, action) => {
      state.petId = action.payload.petId;
      state.walkTime = action.payload.walkTime;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.address = action.payload.address;
      state.detailAddress = action.payload.detailAddress;
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
  },
});

let store = configureStore({
  reducer: {
    tabbar: tabbar.reducer,
    alertbox: alertbox.reducer,
    reservation: reservation.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let { selectedTab } = tabbar.actions;
export let { alertOn, alertOff } = alertbox.actions;
export let { setWalkTime, setLocation, setPetId, setTitleAndContent, setWalkDataAll } = reservation.actions;

export default store;
