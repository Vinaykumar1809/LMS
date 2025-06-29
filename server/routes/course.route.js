import {Router} from 'express';
import { getAllCourses,getLecturesByCourseId,createCourse,updateCourse,removeCourse,addLectureToCourseById,removeLectureFromCourseById } from '../controllers/course.controller.js';
import {isLoggedIn,authorizedRoles,authorizeSubscriber} from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
   .get(getAllCourses)
   .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
    );

    
   router.delete(
  '/lecture',
  isLoggedIn,
  authorizedRoles('ADMIN'),
  removeLectureFromCourseById
);


router.route('/:id')
  .get(isLoggedIn,authorizeSubscriber,getLecturesByCourseId)
   .put(isLoggedIn, authorizedRoles('ADMIN'),updateCourse)
   .delete(isLoggedIn, authorizedRoles('ADMIN'),removeCourse)
   .post(isLoggedIn, authorizedRoles('ADMIN'),upload.single('lecture'),addLectureToCourseById)
   


//    router.delete(
//   '/:id/lectures/:lectureId',
//   isLoggedIn,
//   authorizedRoles('ADMIN'),
//   removeLectureFromCourseById
// );

export default router;