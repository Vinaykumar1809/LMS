import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LibraryCard from "../../Components/LibraryCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllLibraries } from "../../Redux/Slices/LibrarySlice.js";

function LibraryList() {
    const dispatch = useDispatch();

    const {libraryData} = useSelector((state) => state.library);

    async function loadCollections() {
        await dispatch(getAllLibraries());
    }

    useEffect(() => {
        loadCollections();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12  flex flex-col gap-10 text-white ">
                <h1 className="text-center text-3xl font-semibold mb-5">
                   Find books that inspire, educate, and empower — &nbsp;
                    <span className="font-bold text-yellow-500">
                         curated just for you
                    </span>
                </h1>
                <div className="mb-10 flex flex-wrap gap-14 justify-center">
                    {libraryData?.map((element) => {
                        return <LibraryCard key={element._id} data={element} />
                    })}
                </div>
                

            </div>
        </HomeLayout>
    );

}

export default LibraryList;