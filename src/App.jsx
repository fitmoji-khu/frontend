import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Community from "./components/Community";
import PostDetail from "./components/PostDetail";
import PostCreate from "./components/PostCreate";
import HomePage from "./components/MainPage/HomePage";

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/new" element={<PostCreate />} />
          <Route path="/community/:id" element={<PostDetail />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
