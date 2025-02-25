import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "../slicers/video-slicer";

const store = configureStore({
    reducer: {
        videos: videoReducer, // Make sure the videos slice is registered
    },
});

export default store;
