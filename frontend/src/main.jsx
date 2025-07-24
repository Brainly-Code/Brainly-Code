import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ErrorBoundary } from './ErrorBoundary'
import './index.css'
import Login from './auth/Login'
import Register from './auth/Register'
import store from './redux/store'
import App from './App'
import { Hero } from './Components/Hero'
// import AllUsers from './Admin/AllUsers'
import UpdateUser from './Components/UpdateUser'
import Home from './Home'
import HomePage from './Components/HomePage'
import NewUser from './User'


import PlayGround from './Components/PlayGround'
import Dashboard from './Layouts/Dashboard/Components/Dashboard'
import Challenges from './Layouts/Dashboard/Components/Challenges.jsx'
import Courses from './Layouts/Dashboard/Components/Courses.jsx'
import Users from './Layouts/Dashboard/Components/Users.jsx'
// import AdminRoutes from './AdminRoutes'
import DashboardLayout from './Layouts/Dashboard/DashboardLayout'
// import CreateCourse from './Admin/CreateCourse'
import Modules from './Components/Modules'
import Lesson from './Components/Lesson'
import VideoPlayer from './Components/VideoPlayer'
import LessonVideoPlayer from './Components/LessonVideoPlayer'
// import AllChallenges from './Admin/AllChallenges'
// import AllCourses from './Admin/AllCourses'
import Challenge from './Components/Challenge'
import CreateCourse from './Admin/CreateCourse.jsx'
import AdminCourses from '../src/Admin/AdminCourses.jsx'
import CourseModules from '../src/Admin/CourseModules.jsx'
// import { GoogleOAuthProvider} from '@react-oauth/google'

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<NewUser />} >
        <Route path='' element = {<Hero />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

   

      <Route path='user' element={<Home />} >
        <Route path="profile"  element={<UpdateUser />} />
        <Route path='' element={<HomePage />} />
        <Route path='lesson/:id' element={<Lesson />}/>
        <Route path='challenges' element={<Challenges />} />
        <Route path='challenge/:id' element={<Challenge />} />
        <Route path='playground' element={<PlayGround />} />
        <Route path='module/:id' element={<Modules />} />
        <Route path='course/module/:moduleId/video/:videoId' element={<VideoPlayer />} />
        <Route path=':moduleId/:lessonVideoId' element={<LessonVideoPlayer />} />
      </Route>

      {/* Admin  */}
      <Route path='admin' element={<DashboardLayout />}>
        {/* <Route path='users' element={<AllUPasers />} /> */}
        <Route path='' element={<Dashboard />} />
        <Route path='challenges' element={<Challenges />} />
        <Route path='courses' element={<Courses />} />
        <Route path='users' element={<Users />} />
        <Route path='profile' element={<UpdateUser />} />
        <Route path='create' element={<CreateCourse />} /> 
        <Route path='myCourses' element={<AdminCourses />} />
        <Route path='courseModules/:id' element={<CourseModules />} />
        {/* <Route path='challenges' element={<AllChallenges />} /> 

        <Route path='courses' element={<AllCourses />} /> 
        <Route path='create' element={<CreateCourse />} /> */}
      </Route>
      {/* <Route path='admin' element={<Navbar />}/>
      <Route path='admin/users' element={<AllUsers />} /> */}

    </Route>

  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
 <ErrorBoundary>
   <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
 </ErrorBoundary>
)