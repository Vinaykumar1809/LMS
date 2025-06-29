import {configureStore} from '@reduxjs/toolkit';
import authSliceReducer from './Slices/AuthSlice.js';
import courseSliceReducer from './Slices/CourseSlice.js';
import stripeSliceReducer from './Slices/StripeSlice.js';
import lectureSliceReducer from './Slices/LectureSlice.js';
import statSliceReducer from './Slices/StatSlice.js';
import librarySliceReducer from './Slices/LibrarySlice.js';
import bookSliceReducer from './Slices/BookSlice.js';

const store = configureStore({
    reducer:{
        auth: authSliceReducer,
        course: courseSliceReducer,
        stripe:stripeSliceReducer,
        lecture:lectureSliceReducer,
        library:librarySliceReducer,
        book:bookSliceReducer,
        stat: statSliceReducer
    },
    devTools:true
});

export default store;