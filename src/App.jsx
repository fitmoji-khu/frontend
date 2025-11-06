import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/users/Signup";
import Login from "./components/users/Login";
import MyPage from "./components/users/Mypage";
import AppLayout from "./components/AppLayout";
import Community from "./components/Community";
import PostDetail from "./components/PostDetail";
import PostCreate from "./components/PostCreate";
import HomePage from "./components/home/HomePage";
import ClosetListPage from "./components/closet/ClosetListPage";
import AddClothPage from "./components/closet/AddClothPage";
import AnalysisResultPage from "./components/closet/AnalysisResultPage";
import CoordiEntryPage from "./components/coordi/CoordiEntryPage";
import CoordiResultPage from "./components/coordi/CoordiResultPage";
import { CoordiProvider } from "./components/coordi/coordiStore.js";


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
