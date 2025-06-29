import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addLibraryBook } from "../../Redux/Slices/BookSlice";

function AddBook() {

    const libraryDetails = useLocation().state;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        id: libraryDetails?._id,
        book: undefined,
        thumbnail: undefined,
        title: "",
        thumbnailSrc: "",
        bookSrc: ""
    });

    function handleInputChange(e) {
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

   function handleFileChange(e) {
        const fileType = e.target.name;
        const file = e.target.files[0];
        const fileUrl = window.URL.createObjectURL(file);

        setUserInput((prev) => ({
            ...prev,
            [fileType]: file,
            [`${fileType}Src`]: fileUrl
        }));
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if(!userInput.book || !userInput.title || !userInput.thumbnail) {
            toast.error("All fields are mandatory")
            return;
        }
        const response = await dispatch(addLibraryBook(userInput));
        if(response?.payload?.success) {
            navigate(-1);
            setUserInput({
                id: libraryDetails?._id,
                book: undefined,
                thumbnail:undefined,
                title: "",
                thumbnailSrc: "",
                bookSrc: ""
            })
        }
    }

    useEffect(() => {
        if(!libraryDetails) navigate("/library");
    }, [])

    return (
        <HomeLayout>
            <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
                <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
                    <header className="flex items-center justify-center relative">
                        <button 
                            className="absolute left-2 text-xl text-green-500"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className="text-xl text-yellow-500 font-semibold">
                            Add new book
                        </h1>
                    </header>
                    <form 
                        onSubmit={onFormSubmit} className="flex flex-col gap-3"
                    >

                       <input
                            type="text"
                            name="title"
                            placeholder="Enter Book Title"
                            className="input input-bordered w-full"
                            value={userInput.title}
                            onChange={handleInputChange}
                        />

                         <label className="text-sm font-semibold text-gray-300">Upload Book PDF</label>
                        <input
                            type="file"
                            name="book"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="text-white"
                        />

                         <label className="text-sm font-semibold text-gray-300">Upload Book Thumbnail or frontpage</label>
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-white"
                        />
                      
                      {userInput.thumbnailSrc && (
                            <img
                                src={userInput.thumbnailSrc}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded"
                            />
                        )}

                        <button type="submit" className="btn btn-primary py-1 font-semibold text-lg">
                            Add Book
                        </button>
                    </form>
                </div>
            </div>  
        </HomeLayout>
    )
}

export default AddBook;