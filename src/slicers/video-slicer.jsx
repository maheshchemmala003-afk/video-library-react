import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name: "videos",
    initialState: {
        savedVideos: [], // Array to store saved videos
        VideosCount: 0,  // Count of saved videos
    },

    reducers: {
        addToViewLater(state, action) {
            const video = action.payload;
            const exists = state.savedVideos.some((v) => v.VideoId === video.VideoId);
            if (!exists) {
                state.savedVideos.push(video);
                state.VideosCount += 1; // Increment count
            }
        },

        removeFromViewLater(state, action) {
            const videoId = action.payload;
            state.savedVideos = state.savedVideos.filter((v) => v.VideoId !== videoId); // Remove video
            state.VideosCount -= 1; // Decrement count
        },

        updateVideo(state, action) { 
            const updatedVideo = action.payload;
            const index = state.savedVideos.findIndex(v => v.VideoId === updatedVideo.VideoId);
            if (index !== -1) {
                state.savedVideos[index] = { ...state.savedVideos[index], ...updatedVideo }; 
            }
        }
    },
}); 

export const { addToViewLater, removeFromViewLater, updateVideo } = videoSlice.actions;
export default videoSlice.reducer;