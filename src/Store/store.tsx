import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// 초기 상태 정의
const initialTabbarState: { state: number } = { state: 0 };
const initialAlertboxState: { state: boolean; text: string } = { state: false, text: "" };
const initialReservationWalkState: { petId: number; walkTime: number; latitude: number; longitude: number; address: string; detailAddress: string; title: string; content: string; id?: number; amount: number } = {
  petId: 0,
  walkTime: 30,
  latitude: 0,
  longitude: 0,
  address: "",
  detailAddress: "",
  title: "",
  content: "",
  amount: 15000,
};

// 새로운 예약 케어 상태 정의
const initialReservationCareState = {
  title: "",
  content: "",
  administrativeAddress1: "",
  administrativeAddress2: "",
  streetNameAddress: "",
  detailAddress: "",
  images: [] as File[], // 이미지 파일을 배열로 정의
  unavailableDates: [] as string[],
  latitude: 0,
  longitude: 0,
};

// 탭바
let tabbar = createSlice({
  name: "tabbar",
  initialState: initialTabbarState,
  reducers: {
    selectedTab(state, action: PayloadAction<number>) {
      state.state = action.payload;
    },
  },
});

// 알림창
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

// 산책 예약 정보
let reservationWalk = createSlice({
  name: "reservationWalk",
  initialState: initialReservationWalkState,
  reducers: {
    setWalkTime: (state, action) => {
      state.walkTime = action.payload.walkTime;
      state.amount = action.payload.amount;
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

// 예약 케어 정보
let reservationCare = createSlice({
  name: "reservationCare",
  initialState: initialReservationCareState,
  reducers: {
    setTitleAndContent: (state, action: PayloadAction<{ title: string; content: string }>) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    setAddress: (
      state,
      action: PayloadAction<{
        administrativeAddress1: string;
        administrativeAddress2: string;
        streetNameAddress: string;
        detailAddress: string;
        latitude: number;
        longitude: number;
      }>
    ) => {
      state.administrativeAddress1 = action.payload.administrativeAddress1;
      state.administrativeAddress2 = action.payload.administrativeAddress2;
      state.streetNameAddress = action.payload.streetNameAddress;
      state.detailAddress = action.payload.detailAddress;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setImages: (state, action: PayloadAction<File[]>) => {
      state.images = action.payload;
    },
    setUnavailableDate: (state, action: PayloadAction<string[]>) => {
      state.unavailableDates = action.payload;
    },
  },
});

let store = configureStore({
  reducer: {
    tabbar: tabbar.reducer,
    alertbox: alertbox.reducer,
    reservationWalk: reservationWalk.reducer,
    reservationCare: reservationCare.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let { selectedTab } = tabbar.actions;
export let { alertOn, alertOff } = alertbox.actions;
export let { setWalkTime, setLocation, setPetId, setTitleAndContent: setWalkTitleAndContent, setWalkDataAll } = reservationWalk.actions;
export let { setTitleAndContent, setAddress, setImages, setUnavailableDate } = reservationCare.actions;

export default store;
