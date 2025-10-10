import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Community from "./components/Community";
import PostDetail from "./components/PostDetail";
import PostCreate from "./components/PostCreate";
import HomePage from "./components/MainPage/HomePage";
import ClosetListPage from "./components/Closet/ClosetListPage";
import AddClothPage from "./components/Closet/AddClothPage";
import AnalysisResultPage from "./components/Closet/AnalysisResultPage";
import TryOnPage from "./components/Closet/TryOnPage"

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/new" element={<PostCreate />} />
          <Route path="/community/:id" element={<PostDetail />} />
          <Route path="/closet" element={<ClosetListPage />} />
          <Route path="/closet/add" element={<AddClothPage />} />
          <Route path="/closet/result" element={<AnalysisResultPage />} />
          <Route path="/try-on" element={<TryOnPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
