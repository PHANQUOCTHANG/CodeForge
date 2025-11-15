import { createSlice } from "@reduxjs/toolkit";

interface LessonUpdateState {
  isToggleUpdate: boolean;
}

const initialState: LessonUpdateState = {
  isToggleUpdate: false,
};

const lessonUpdateSlice = createSlice({
  name: "lessonUpdate",
  initialState,
  reducers: {
    setLessonUpdated: (state) => {
      state.isToggleUpdate = !state.isToggleUpdate;
    },
    resetLessonUpdate: (state) => {
      state.isToggleUpdate = false;
    },
  },
});

export const { setLessonUpdated, resetLessonUpdate } =
  lessonUpdateSlice.actions;
export default lessonUpdateSlice.reducer;
