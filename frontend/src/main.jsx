import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import Login from './auth/Login'
import Register from './auth/Register'
import store from './redux/store'
import App from './App'
import { Hero } from './Components/Hero'
import AllUsers from './Admin/AllUsers'
import UpdateUser from './Components/UpdateUser'
import Home from './Home'
import HomePage from './Components/HomePage'
import NewUser from './User'
import Challenges from './Components/Challenges'
import PlayGround from './Components/PlayGround'
import Dashboard from './Admin/Dashboard'
import AdminRoutes from './AdminRoutes'
import CreateCourse from './Admin/CreateCourse'
import Modules from './Components/Modules'
import Lesson from './Components/Lesson'
import VideoPlayer from './Components/VideoPlayer'
import LessonVideoPlayer from './Components/LessonVideoPlayer'
import AllChallenges from './Admin/AllChallenges'
import AllCourses from './Admin/AllCourses'
// import { GoogleOAuthProvider} from '@react-oauth/google'

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<NewUser />} >
        <Route path='' element = {<Hero />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      {/* Admin  */}
      <Route path='admin' element={<AdminRoutes />}>
        <Route path='users' element={<AllUsers />} />
        <Route path='' element={<Dashboard />} />
        <Route path='challenges' element={<AllChallenges />} /> 
        <Route path='profile' element={<UpdateUser />} />
        <Route path='courses' element={<AllCourses />}> 
          
        </Route>
        <Route path='create' element={<CreateCourse />} />
      </Route>
      {/* <Route path='admin' element={<Navbar />}/>
      <Route path='admin/users' element={<AllUsers />} /> */}

      <Route path='user' element={<Home />} >
        <Route path="profile"  element={<UpdateUser />} />
        <Route path='' element={<HomePage />} />
        <Route path='lesson/:id' element={<Lesson />}/>
        <Route path='challenges' element={<Challenges />} />
        <Route path='playground' element={<PlayGround />} />
        <Route path='module/:id' element={<Modules />} />
        <Route path='course/module/:moduleId/video/:videoId' element={<VideoPlayer />} />
        <Route path=':moduleId/:lessonVideoId' element={<LessonVideoPlayer />} />
      </Route>

    </Route>

  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)