import {Router} from 'express';
import { getAllLibrary,getBooksByLibraryId,createLibrary,updateLibrary,removeLibrary,addBookToLibraryById,removeBookFromLibraryById } from '../controllers/library.controller.js';
import {isLoggedIn,authorizedRoles,authorizeSubscriber} from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
   .get(getAllLibrary)
   .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createLibrary
    );

    
   router.delete(
  '/book',
  isLoggedIn,
  authorizedRoles('ADMIN'),
  removeBookFromLibraryById
);


router.route('/:id')
  .get(isLoggedIn,authorizeSubscriber,getBooksByLibraryId) 
   .put(isLoggedIn, authorizedRoles('ADMIN'),updateLibrary)
   .delete(isLoggedIn, authorizedRoles('ADMIN'),removeLibrary)
   .post(isLoggedIn, authorizedRoles('ADMIN'),upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'book', maxCount: 1 }
    ]),addBookToLibraryById)


export default router;