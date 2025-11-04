import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import MyPage from "./components/MyPage.jsx";
import AppLayout from "./components/AppLayout";
import Community from "./components/Community";
import PostDetail from "./components/PostDetail";
import PostCreate from "./components/PostCreate";
import HomePage from "./components/MainPage/HomePage";
import ClosetListPage from "./components/Closet/ClosetListPage";
import AddClothPage from "./components/Closet/AddClothPage";
import AnalysisResultPage from "./components/Closet/AnalysisResultPage";
import CoordiEntryPage from "./components/Coordi/CoordiEntryPage";
import CoordiResultPage from "./components/Coordi/CoordiResultPage";
import { CoordiProvider } from "./components/Coordi/coordiStore.js";


export default function App() {
  return (
    <Router>
      <CoordiProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/new" element={<PostCreate />} />
            <Route path="/community/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />

            <Route path="/closet" element={<ClosetListPage />} />
            <Route path="/closet/add" element={<AddClothPage />} />
            <Route path="/closet/result" element={<AnalysisResultPage />} />
            <Route path="/coordi/select" element={<ClosetListPage selectionMode={true} />} />

            <Route path="/coordi" element={<CoordiEntryPage />} />
            <Route path="/coordi/result" element={<CoordiResultPage />} />
          </Routes>
        </AppLayout>
      </CoordiProvider>
    </Router>
  );
}
