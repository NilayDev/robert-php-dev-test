import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFrameState {
  user: object;
}

const initialState: IFrameState = {
  user: {},
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
  },
});

export const { setUserInfo } = AuthSlice.actions;

export default AuthSlice.reducer;
