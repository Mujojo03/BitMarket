import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  /* ---------- theme ---------- */
  const [theme, setTheme] = useState("light")  // 'light' | 'dark'
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  /* ---------- auth ---------- */
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null
    } catch { return null }
  })

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const value = { theme, setTheme, user, setUser, logout }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}