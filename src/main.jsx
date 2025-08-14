import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './ErrorBoundary';
import './index.css';

import store from './redux/store';
import App from './App';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './Home';
import Hero from './Components/Hero';
import UpdateUser from './Components/UpdateUser';
import HomePage from './Components/HomePage';
import NewUser from './User';
import PlayGround from './Components/PlayGround';
import Dashboard from './Layouts/Dashboard/Components/Dashboard';
import Courses from './Layouts/Dashboard/Components/Courses';
import Users from './Layouts/Dashboard/Components/Users';
import DashboardLayout from './Layouts/Dashboard/DashboardLayout';
import Modules from './Components/Modules';
import Lesson from './Components/Lesson';
import VideoPlayer from './Components/VideoPlayer';
import VideoPlayer2 from './Admin/AdminVideoPlayer';
import LessonVideoPlayer from './Components/LessonVideoPlayer';
import LessonVideoPlayer2 from './Admin/AdminLessonVideoPlayer';
import Lesson2 from './Admin/AdminLesson';
import Challenge from './Components/Challenge';
import CreateCourse from './Admin/CreateCourse';
import CourseModules from './Admin/CourseModules';
import RouteError from './RouteError';
import Challenges from './Components/Challenges';
import AdminChallenges from './Layouts/Dashboard/Components/Challenges';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<RouteError />}>
      <Route path="" element={<NewUser />}>
        <Route index element={<Hero />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="user" element={<Home />}>
        <Route path="profile" element={<UpdateUser />} />
        <Route index element={<HomePage />} />
        <Route path="lesson/:id" element={<Lesson />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="challenge/:id" element={<Challenge />} />
        <Route path="playground" element={<PlayGround />} />
        <Route path="module/:id" element={<Modules />} />
        <Route path="course/module/:moduleId/video/:videoId" element={<VideoPlayer />} />
        <Route path=":moduleId/:lessonVideoId" element={<LessonVideoPlayer />} />
      </Route>

      <Route path="admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="challenges" element={<AdminChallenges />} />
        <Route path="courses" element={<Courses />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<UpdateUser />} />
        <Route path="create" element={<CreateCourse />} />
        <Route path="courseModules/:id" element={<CourseModules />} />
        <Route path="course/module/:moduleId/video/:videoId" element={<VideoPlayer2 />} />
        <Route path=":moduleId/:lessonVideoId" element={<LessonVideoPlayer2 />} />
        <Route path="lesson/:id" element={<Lesson2 />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ErrorBoundary>
);
