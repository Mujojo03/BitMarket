"use client"

import { useState } from "react"
import { Bitcoin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/mock-data"

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: string | null
  priceRange: [number, number]
  productType: "all" | "physical" | "digital"
  onCategoryChange: (categoryId: string | null) => void
  onPriceRangeChange: (range: [number, number]) => void
  onProductTypeChange: (type: "all" | "physical" | "digital") => void
  onReset: () => void
  className?: string
}

export function ProductFilters({
  categories,
  selectedCategory,
  priceRange,
  productType,
  onCategoryChange,
  onPriceRangeChange,
  onProductTypeChange,
  onReset,
  className,
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange)

  const handlePriceRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    setLocalPriceRange(newRange)
    onPriceRangeChange(newRange)
  }

  const formatPrice = (value: number) => {
    return `${value.toLocaleString()} sats`
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-xs">
            <X className="mr-1 h-3 w-3" /> Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Categories</h3>
            <div className="space-y-2">
              <div
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm cursor-pointer",
                  selectedCategory === null ? "bg-bitcoin text-black font-medium" : "hover:bg-gray-700",
                )}
                onClick={() => onCategoryChange(null)}
              >
                All Categories
              </div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm cursor-pointer",
                    selectedCategory === category.id ? "bg-bitcoin text-black font-medium" : "hover:bg-gray-700",
                  )}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Price Range</h3>
            <div className="pt-2 px-1">
              <Slider
                defaultValue={[localPriceRange[0], localPriceRange[1]]}
                min={0}
                max={1000000}
                step={1000}
                value={[localPriceRange[0], localPriceRange[1]]}
                onValueChange={handlePriceRangeChange}
                className="mb-6"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Bitcoin className="h-3 w-3 text-bitcoin mr-1" />
                  <span>{formatPrice(localPriceRange[0])}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Bitcoin className="h-3 w-3 text-bitcoin mr-1" />
                  <span>{formatPrice(localPriceRange[1])}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Product Type</h3>
            <RadioGroup
              value={productType}
              onValueChange={(value) => onProductTypeChange(value as "all" | "physical" | "digital")}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Products</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="physical" />
                <Label htmlFor="physical">Physical Products</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digital" id="digital" />
                <Label htmlFor="digital">Digital Products</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
