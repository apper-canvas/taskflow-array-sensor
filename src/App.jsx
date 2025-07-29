import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import TodayTasks from "@/components/pages/TodayTasks"
import UpcomingTasks from "@/components/pages/UpcomingTasks"
import CategoryTasks from "@/components/pages/CategoryTasks"
import CompletedTasks from "@/components/pages/CompletedTasks"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/today" element={<TodayTasks />} />
            <Route path="/upcoming" element={<UpcomingTasks />} />
            <Route path="/category/:categoryId" element={<CategoryTasks />} />
            <Route path="/completed" element={<CompletedTasks />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App