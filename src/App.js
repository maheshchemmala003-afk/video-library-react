import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VideoHome } from './components/video-home';
import { AdminLogin } from './components/admin-login';
import { UserLogin } from './components/user-login';
import { AdminDash } from './components/admin-dashboard';
import { AdminAddVideo } from './components/admin-addvideo';
import { AdminEditVideo } from './components/admin-edit-video';
import { AdminDelVideo } from './components/admin-delete-video';
import { UserRegister } from './components/user-register';
import { UserDashBoard } from './components/user-dashboard';
import { SavedVideos } from './components/saved-videos';

function App() {
  return (
    <div className="video-banner">
      <div className='shade-banner'>
      <h1 className="animated-title text-center d-flex   p-2">
         <span className='mx-3' style={{ color: "blue", fontStyle: "italic",fontWeight:"bold" }}> Technologies </span> <span style={{color: "gold", fontWeight: "bold",fontStyle:"italic" }}> Video Library</span>
      </h1>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<VideoHome />} />
          <Route path='admin-login' element={<AdminLogin />} />
          <Route path='user-login' element={<UserLogin /> } />
          <Route path='user-register' element={ <UserRegister /> } />
          <Route path='user-dash' element={ <UserDashBoard /> } />
          <Route path='admin-dash' element={<AdminDash /> }/>
          <Route path='add-video' element={ <AdminAddVideo /> } />
          <Route path='edit-video/:id' element={ <AdminEditVideo /> } />
          <Route path='delete-video/:id' element={ <AdminDelVideo /> } />
          <Route path='saved-videos' element={ <SavedVideos /> } />
        </Routes>
      </BrowserRouter>

      </div>
    </div>
  );
}

export default App;
