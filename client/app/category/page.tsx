import { useCategoryContext } from "@/contexts/category-context"
import { CategoryCard } from "@/components/category-card"

export default function CategoriesPage() {
  const { categories, loading, error } = useCategoryContext()

  if (loading) return <p className="p-4 text-gray-400">Loading categories...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
