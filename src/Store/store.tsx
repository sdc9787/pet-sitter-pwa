import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import exp from "constants";

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
  images: [] as string[], // 이미지 URL 배열로 정의
  unavailableDates: [] as string[],
  latitude: 0,
  longitude: 0,
};

const careSelectedAvailableDatesState = {
  reservationStartDate: "",
  reservationEndDate: "",
};

// [
//   {
//       "sender": "ahavvsvw",
//       "content": "채팅 메세지 테스트",
//       "sendTime": "2024-06-04T23:31:16"
//   },
//   {
//       "sender": "test9",
//       "content": "채팅 메세지 테스트",
//       "sendTime": "2024-06-04T23:32:03"
//   },
//   {
//       "sender": "test9",
//       "content": "테스트",
//       "sendTime": "2024-06-05T00:41:48"
//   },
//   {
//       "sender": "test9",
//       "content": "테스트",
//       "sendTime": "2024-06-05T00:43:39"
//   }
// ]

const chatState: { content: string; sendTime: string; sender: string } = {
  content: "",
  sendTime: "",
  sender: "",
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

// 돌봄 예약 정보
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
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    setUnavailableDate: (state, action: PayloadAction<string[]>) => {
      state.unavailableDates = action.payload;
    },
    setCarePostData: (
      state,
      action: PayloadAction<{
        title: string;
        content: string;
        administrativeAddress1: string;
        administrativeAddress2: string;
        streetNameAddress: string;
        detailAddress: string;
        latitude: number;
        longitude: number;
        images: string[];
        unavailableDates: string[];
      }>
    ) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.administrativeAddress1 = action.payload.administrativeAddress1;
      state.administrativeAddress2 = action.payload.administrativeAddress2;
      state.streetNameAddress = action.payload.streetNameAddress;
      state.detailAddress = action.payload.detailAddress;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.images = action.payload.images;
      state.unavailableDates = action.payload.unavailableDates;
    },
  },
});

let careImageState = createSlice({
  name: "careImageState",
  initialState: false,
  reducers: {
    setCareImageState: (state, action: PayloadAction<boolean>) => {
      return action.payload; // Ensure state is updated with the payload value
    },
  },
});

let careDateState = createSlice({
  name: "careDateState",
  initialState: false,
  reducers: {
    setCareDateState: (state, action: PayloadAction<boolean>) => {
      return action.payload; // Ensure state is updated with the payload value
    },
  },
});

let careSelectedAvailableDates = createSlice({
  name: "careSelectedAvailableDates",
  initialState: careSelectedAvailableDatesState,
  reducers: {
    setCareSelectedAvailableDates: (state, action: PayloadAction<{ reservationStartDate: string; reservationEndDate: string }>) => {
      state.reservationStartDate = action.payload.reservationStartDate;
      state.reservationEndDate = action.payload.reservationEndDate;
    },
  },
});

let careSelectedAvailablePet = createSlice({
  name: "careSelectedAvailablePet",
  initialState: 1,
  reducers: {
    setCareSelectedAvailablePet: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

let profileImage = createSlice({
  name: "profileImage",
  initialState: "",
  reducers: {
    setProfileImage: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

let chat = createSlice({
  name: "chat",
  initialState: [chatState],
  reducers: {
    setChat: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

let partnerState = createSlice({
  name: "partnerState",
  initialState: 0,
  reducers: {
    setPartnerState: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

let store = configureStore({
  reducer: {
    tabbar: tabbar.reducer,
    alertbox: alertbox.reducer,
    reservationWalk: reservationWalk.reducer,
    reservationCare: reservationCare.reducer,
    careImageState: careImageState.reducer,
    careDateState: careDateState.reducer,
    careSelectedAvailableDates: careSelectedAvailableDates.reducer,
    careSelectedAvailablePet: careSelectedAvailablePet.reducer,
    profileImage: profileImage.reducer,
    chat: chat.reducer,
    partnerState: partnerState.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let { selectedTab } = tabbar.actions;
export let { alertOn, alertOff } = alertbox.actions;
export let { setWalkTime, setLocation, setPetId, setTitleAndContent: setWalkTitleAndContent, setWalkDataAll } = reservationWalk.actions;
export let { setTitleAndContent, setAddress, setImages, setUnavailableDate, setCarePostData } = reservationCare.actions;
export let { setCareImageState } = careImageState.actions;
export let { setCareDateState } = careDateState.actions;
export let { setCareSelectedAvailableDates } = careSelectedAvailableDates.actions;
export let { setCareSelectedAvailablePet } = careSelectedAvailablePet.actions;
export let { setProfileImage } = profileImage.actions;
export let { setChat } = chat.actions;
export let { setPartnerState } = partnerState.actions;

export default store;
