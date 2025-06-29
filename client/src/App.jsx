import './App.css';
import './index.css';
import {Route,Routes} from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import AboutUs from './Pages/AboutUs.jsx'
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import CourseList from './Pages/Course/CourseList.jsx';
import LibraryList from './Pages/BookCollection/LibraryList.jsx';
import Contact from './Pages/Contact.jsx';
import Denied from './Pages/Denied';
import CourseDescription from './Pages/Course/CourseDescription.jsx';
import LibraryDescription from './Pages/BookCollection/LibraryDescription.jsx';
import CreateCourse from './Pages/Course/CreateCourse';
import CreateCollection from './Pages/BookCollection/CreateCollection.jsx';
import RequireAuth from './Components/Auth/RequireAuth';
import EditProfile from './Pages/User/EditProfile';
import Profile from './Pages/User/Profile';
import Checkout from './Pages/Payment/Checkout.jsx';
import CheckoutFailure from './Pages/Payment/CheckoutFailure';
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess';
import Displaylectures from './Pages/Dashboard/Displaylectures';
import DisplayBooks from './Pages/Dashboard/DisplayBooks.jsx';
import AddLecture from './Pages/Dashboard/AddLecture.jsx';
import AddBook from './Pages/Dashboard/AddBook.jsx';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import ForgetPassword from "./Pages/Password/ForgotPassword";
import ResetPassword from "./Pages/Password/ResetPassword";
import ChangePassword  from "./Pages/Password/ChangePassword.jsx";
import PDFViewer from "./Pages/pdfViewer.jsx";

function App() {
 

  return (
    <>
   <Routes>
     <Route path="/" element ={<HomePage/>} ></Route>
     <Route path="/about" element ={<AboutUs/>} ></Route>

      <Route path="/courses" element ={<CourseList/>} ></Route>
      <Route path="/library" element ={<LibraryList/>} ></Route>
     <Route path="/contact" element ={<Contact/>} ></Route>
     <Route path="/denied" element={<Denied />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />


      <Route path="/course/description" element={<CourseDescription />} />
      <Route path="/library/description" element={<LibraryDescription />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/login" element={<Login />} />

     <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
           <Route path="/course/addlecture" element={<AddLecture />} />
            <Route path="/library/create" element={<CreateCollection />} />
              <Route path="/library/addbook" element={<AddBook />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        
     <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
      <Route path='/user/profile' element={<Profile />} />
    <Route path='/user/editprofile' element={<EditProfile />} />
    <Route path='/checkout' element={<Checkout />}/>
     <Route path='/checkout/success' element={<CheckoutSuccess />} />
     <Route path='/checkout/cancel' element={<CheckoutFailure />} />
       <Route path="/changepassword" element={<ChangePassword />} />
      <Route path='/course/displaylectures' element={<Displaylectures />}/>
       <Route path='/library/displaybooks' element={<DisplayBooks />}/>
       <Route path="/preview" element={<PDFViewer />} />
     </Route>

      <Route path="*" element={<NotFound />}></Route>
    </Routes>
   
    </>
  )
}

export default App
