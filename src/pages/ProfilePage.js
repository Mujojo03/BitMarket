"use client"

import { useNavigate } from "react-router-dom"
import { Sun, Moon, LogOut } from "lucide-react"
import { useApp } from "../contexts/AppContext"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, theme, setTheme, logout } = useApp()

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"))
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00264D] to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        {/* Avatar + name */}
        <div className="flex flex-col items-center space-y-2 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-[#00264D] flex items-center justify-center text-4xl font-bold">
            {user?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <h2 className="text-xl font-semibold text-[#00264D]">{user?.username}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>
            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
          >
            <span>Logout</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage