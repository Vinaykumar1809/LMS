import Library from "../models/library.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { uploadPDFToDrive, deleteFileFromDrive } from '../utils/drive.helper.js';

const getAllLibrary = async function(req,res,next){
    try{
               const libraries = await Library.find({}).select('-books');
    res.status(200).json({
       success:true,
       message:'All collections',
       libraries, 
    })
    }catch(e){
    next(new AppError(e.message,400));
    } 

};

const getBooksByLibraryId = async function(req,res,next){
    try{
            const {id} = req.params;
       const library = await Library.findById(id);
    if(!library){
        return next(
            new AppError('Collection not found',400)
        )
    }

    console.log("Library.books to return:", library.books);
    res.status(200).json({
        success:true,
        message: "Books' collection fetched successfully!",
        books:library.books
    })
    }catch(e){
        next(new AppError(e.message,400));
    }
};


const createLibrary = async(req,res,next)=>{
    const {title,description,category} = req.body;
    if(!title || !description || !category ){
         return next(
            new AppError('All fields are required',400)
         )
    }

    const library= await Library.create({
        title,
        description,
        category,
        thumbnail:{
            public_id:'Dummy',
            secure_url:'Dummy',
        }
    });

    if(!library){
        return next(
            new AppError('Failed to create collection, please try again!',500)
        )
    }
    
      if(req.file){
              try{
                   const result = await cloudinary.v2.uploader.upload(req.file.path,{
                   folder: 'lms'
              });
              if(result){
                  library.thumbnail.public_id = result.public_id;
                  library.thumbnail.secure_url = result.secure_url;
              }
      
         await fs.rm(`uploads/${req.file.filename}`); 
              }catch(e){
                   console.error("File upload/delete error:", e);
                  return next(
                      new AppError('',500)
                  )
              }
              
          }

     await library.save();

     res.status(200).json({
        success:true,
        message:'Collection created successfully!',
        library,
     });
}



const updateLibrary = async(req,res,next)=>{
   try{
    const {id} = req.params;
    const library = await Library.findByIdAndUpdate(
       id,
       {
        $set:req.body
       },
       {
        runValidators:true
       }
    );

    if(!library){
        return next(
            new AppError('Course does not exist',500)
        )
    }

    res.status(200).json({
        success:true,
        message: 'Collection updated successfully!',
        library,
    })

   }catch(e){
    return next(
        new AppError('Collection updation failed!',500)
    )
   }

}


const removeLibrary = async(req,res,next)=>{
   try{

    const {id} = req.params;
    const library = await Library.findById(id);

    if(!library){
        return next(
            new AppError('Collection does not exist',500)
        )
    }

 await Library.findByIdAndDelete(id);

    res.status(200).json({
        success:true,
        message:'Collection deleted successfully!'
    })
   }catch(e){
    return next(
        new AppError(e.message||'Collection deletion failed!',500)
    )
   }
}


const addBookToLibraryById = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    if (!title) {
      return next(new AppError('All fields are required', 400));
    }

    const library = await Library.findById(id);
    if (!library) {
      return next(new AppError('Collection does not exist', 500));
    }

    const bookData = {
      title,
      thumbnail: {},
      book: {}
    };

    // Upload thumbnail if available
    if (req.files?.thumbnail?.[0]) {
      const file = req.files.thumbnail[0];
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'lms/thumbnails'
      });
      bookData.thumbnail.public_id = result.public_id;
      bookData.thumbnail.secure_url = result.secure_url;
      await fs.rm(file.path);
    } else {
      return next(new AppError('Thumbnail is required', 400));
    }

    // Upload book file (e.g., PDF) if available
    if (req.files?.book?.[0]) {
      const file = req.files.book[0];
      // const result = await cloudinary.v2.uploader.upload(file.path, {
      //folder: 'lms/books',
      //resource_type: 'raw' ,// use raw for non-media files like PDFs
      // });
      //bookData.book.public_id = result.public_id;
      //bookData.book.secure_url = result.secure_url;
      // await fs.rm(file.path);

      const result = await uploadPDFToDrive(file.path, file.originalname);
            bookData.book.public_id = result.public_id;
             bookData.book.secure_url = result.secure_url;

    } else {
      return next(new AppError('Book file is required', 400));
    }

    // Push book to library
    library.books.push(bookData);
    library.numbersOfBooks = library.books.length;
    await library.save();

    res.status(200).json({
      success: true,
      message: 'Book added successfully!',
      library
    });

  } catch (e) {
    return next(new AppError(e.message || 'Failed to add book', 500));
  }
};

const removeBookFromLibraryById = async (req, res, next) => {
  const { libraryId, bookId } = req.query;

  try {
    const library = await Library.findById(libraryId);

    if (!library) {
      return next(new AppError('Collection not found', 404));
    }

    const book = library.books.id(bookId);
    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    // Delete book media from Cloudinary if available
    // if (book.book.public_id) {
    //   await cloudinary.v2.uploader.destroy(book.book.public_id);
    // }
    if (book.book.public_id) {
  await deleteFileFromDrive(book.book.public_id);
}


     if (book.thumbnail?.public_id) {
      await cloudinary.v2.uploader.destroy(book.thumbnail.public_id);
    }
    
    // Remove the book from the array
    library.books =library.books.filter(
      (bk) => bk._id.toString() !== bookId
    );
    library.numbersOfBooks = library.books.length;

    await library.save();

    res.status(200).json({
      success: true,
      message: 'Book removed successfully!',
      library,
    });
  } catch (e) {
    return next(new AppError(e.message ||'Failed to remove book', 500));
  }
};

export {
    getAllLibrary,
    getBooksByLibraryId,
    createLibrary,
    updateLibrary,
    removeLibrary,
    addBookToLibraryById,
    removeBookFromLibraryById
}