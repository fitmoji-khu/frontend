import './App.css'
import AppLayout from "./components/AppLayout.jsx";

function App() {

  return (
    <>
    <AppLayout activePath="/">
      <div style={{ padding: 16 }}>
        <h2>Common UI</h2>
        <p>여기는 Fitmoji 공통 레이아웃 안의 컨텐츠입니다.</p>
      </div>
    </AppLayout>
    </>
  )
}

export default App
