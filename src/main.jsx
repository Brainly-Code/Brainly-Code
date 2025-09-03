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
import Community from './Components/Community.jsx'


import PlayGround from './Components/PlayGround'
import Dashboard from './Layouts/Dashboard/Components/Dashboard'
import Courses from './Layouts/Dashboard/Components/Courses.jsx'
import Users from './Layouts/Dashboard/Components/Users.jsx'
// import AdminRoutes from './AdminRoutes'
import DashboardLayout from './Layouts/Dashboard/DashboardLayout'
// import CreateCourse from './Admin/CreateCourse'
import Modules from './Components/Modules'
import Lesson from './Components/Lesson'
import VideoPlayer from './Components/VideoPlayer'
import VideoPlayer2 from './Admin/AdminVideoPlayer.jsx'
import LessonVideoPlayer from './Components/LessonVideoPlayer.jsx'
import LessonVideoPlayer2 from './Admin/AdminLessonVideoPlayer.jsx'
import Lesson2 from './Admin/AdminLesson.jsx'

// import AllChallenges from './Admin/AllChallenges'
// import AllCourses from './Admin/AllCourses'
import Challenge from './Components/Challenge'
import CreateCourse from './Admin/CreateCourse.jsx'
import CourseModules from '../src/Admin/CourseModules.jsx'
import RouteError from './RouteError.jsx'
import Challenges from './Components/Challenges.jsx'
import AdminChallenges from './Layouts/Dashboard/Components/Challenges.jsx'
import EditChallenge from './Admin/EditChallenge.jsx'
import NotDoneError from './NotDoneError.jsx'
import ChallengeCompleters from './Admin/ChallengeCompleters.jsx'
import Chat from './Components/Chat.jsx'
import Reviews from './Admin/Reviews.jsx'
import UserCourses from './Components/Courses.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(


    <Route path="/" element={<App />}>

      <Route path='/error' element={<RouteError />} >

      </Route>

      <Route path='' element={<NewUser />} >
        <Route path='' element={<Hero />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path='not-done' element={<NotDoneError />} />
      </Route>


      <Route path='user' element={<Home />} >
        <Route path="courses"  element={<UserCourses />} />
        <Route path="profile" element={<UpdateUser />} />
        <Route path='' element={<HomePage />} />
        <Route path='lesson/:id' element={<Lesson />} />
        <Route path='challenges' element={<Challenges />} />
        <Route path='challenge/:id' element={<Challenge />} />
        <Route path='playground' element={<PlayGround />} />
        <Route path='module/:id' element={<Modules />} />
        <Route path='course/module/:moduleId/video/:videoId' element={<VideoPlayer />} />
        <Route path=':moduleId/:lessonVideoId' element={<LessonVideoPlayer />} />
        <Route path='community' element={<Community />} />
        <Route path='chat' element={<Chat />} />
      </Route>

      {/* Admin  */}
      <Route path='admin' element={<DashboardLayout />}>
        {/* <Route path='users' element={<AllUPasers />} /> */}
        <Route path='' element={<Dashboard />} />
        <Route path='challenges' element={<AdminChallenges />} />
        <Route path='completers/:id' element={<ChallengeCompleters />} />
        <Route path='courses' element={<Courses />} />
        <Route path='users' element={<Users />} />
        <Route path='profile' element={<UpdateUser />} />
        <Route path='create' element={<CreateCourse />} />
        <Route path='courseModules/:id' element={<CourseModules />} />
        <Route path='course/module/:moduleId/video/:videoId' element={<VideoPlayer2 />} />
        <Route path=':moduleId/:lessonVideoId' element={<LessonVideoPlayer2 />} />
        <Route path='lesson/:id' element={< Lesson2 />} />
        <Route path='editChallenge/:id' element={<EditChallenge />} />
        <Route path='reviews' element={<Reviews />} />
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
