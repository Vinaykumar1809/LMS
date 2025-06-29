import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import BookCard from "../../Components/BookCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { deleteLibraryBook, getLibraryBooks } from "../../Redux/Slices/BookSlice.js";

function DisplayBooks() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {state} = useLocation();
  const {books} = useSelector((state) => state.book);
   const {role} = useSelector((state) => state.auth);
   

   


    async function onBookDelete(libraryId, bookId) {
        console.log(libraryId, bookId);
        await dispatch(deleteLibraryBook({libraryId: libraryId, bookId: bookId}));
        await dispatch(getLibraryBooks(libraryId));
    }

    useEffect(() => {
        if(!state) navigate("/library");
        dispatch(getLibraryBooks(state._id));
    }, []);

    

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12  flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold mb-5">
                    Collection : &nbsp;
                    <span className="font-bold text-yellow-500">
                         {state?.title}
                    </span>
                </h1>
                {role === "ADMIN" && (<div className="flex justify-center">
        <button
          onClick={() => navigate("/library/addbook", { state })}
          className="btn btn-primary px-4 py-2 rounded-md font-semibold text-sm"
        >
          Add New Book
        </button>
        </div>
      )}
                <div className="mb-10 flex flex-wrap gap-14 justify-center">
                    {books?.map((element) => {
                        return <BookCard key={element._id} data={element}  onDelete={() => onBookDelete(state._id, element._id)}
            role={role} />
                    })}
                </div>
                

            </div>
        </HomeLayout>
    );
}

export default DisplayBooks;