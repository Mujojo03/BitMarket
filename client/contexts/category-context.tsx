// client/context/category-context.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import $ from "jquery"
import { Category, CategoryCardData } from "@/lib/types"
import { toCategoryCardData } from "@/lib/utils"

interface CategoryContextType {
  categories: CategoryCardData[]
  loading: boolean
  error: string | null
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: false,
  error: null,
})

export const useCategoryContext = () => useContext(CategoryContext)

interface CategoryProviderProps {
  children: ReactNode
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<CategoryCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    $.ajax({
      url: "http://localhost:5000/categories",
      method: "GET",
      dataType: "json",
      success: (data: Category[]) => {
        const mapped = data.map(toCategoryCardData)
        setCategories(mapped)
        setLoading(false)
      },
      error: (jqXHR, textStatus, errorThrown) => {
        setError(errorThrown || textStatus)
        setLoading(false)
      },
    })
  }, [])

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  )
}
