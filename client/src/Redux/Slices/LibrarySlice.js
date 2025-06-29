import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    libraryData: []
}

export const getAllLibraries = createAsyncThunk("/library/get", async () => {
    try {
        const response = axiosInstance.get("/library");
        toast.promise(response, {
            loading: "loading library data...",
            success: "Collections loaded successfully",
            error: "Failed to get the library",
        });

        return (await response).data.libraries;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
}); 

export const deleteLibrary = createAsyncThunk("/library/delete", async (id) => {
    try {
        const response = axiosInstance.delete(`/library/${id}`);
        toast.promise(response, {
            loading: "deleting collection ...",
            success: "Collection deleted successfully",
            error: "Failed to delete the collection",
        });

        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
}); 

export const createNewLibrary = createAsyncThunk("/library/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
         formData.append("thumbnail", data?.thumbnail);

        const response = axiosInstance.post("/library", formData);
        toast.promise(response, {
            loading: "Creating new collection",
            success: "Collection created successfully",
            error: "Failed to create collection"
        });

        return (await response).data

    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});



const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllLibraries.fulfilled, (state, action) => {
            if(action.payload) {
                state.libraryData = [...action.payload];
            }
        })
    }
});

export default librarySlice.reducer;