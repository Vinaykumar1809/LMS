import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    books: []
}


export const getLibraryBooks = createAsyncThunk("/library/book/get", async (cid) => {
    try {
        const responsePromise = axiosInstance.get(`/library/${cid}`);
    const response = await toast.promise(responsePromise, {
      loading: "Fetching Books of collection",
      success: "Books fetched successfully",
      error: "Failed to load the Books"
    });

    return response.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const addLibraryBook = createAsyncThunk("/library/book/add", async (data) => {
    try {
        const formData = new FormData();
        formData.append("book", data.book);
        formData.append("title", data.title);
        formData.append("thumbnail", data.thumbnail);

        const response = axiosInstance.post(`/library/${data.id}`, formData);
        toast.promise(response, {
            loading: "adding book in collection",
            success: "Book added successfully",
            error: "Failed to add the Book"
        });
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const deleteLibraryBook = createAsyncThunk("/library/book/delete", async (data) => {
    try {

        const response = axiosInstance.delete(`/library/book/?libraryId=${data.libraryId}&bookId=${data.bookId}`);
        toast.promise(response, {
            loading: "deleting book from collection",
            success: "Book deleted successfully",
            error: "Failed to delete the Book"
        });
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});


const BookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLibraryBooks.fulfilled, (state, action) => {
    
              if (action.payload?.books) {
    state.books = action.payload.books;
  } else {
    state.books = [];
  }
          //  state.books = action?.payload?.books;
        })
        .addCase(getLibraryBooks.rejected, (state, action) => {
      console.error("Books fetch failed:", action.error || action.payload);
    })
        .addCase(addLibraryBook.fulfilled, (state, action) => {
            state.books = action?.payload?.library?.books;
        })
    }
});

export default BookSlice.reducer;