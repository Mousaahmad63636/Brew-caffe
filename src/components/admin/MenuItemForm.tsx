'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertMessage } from '@/components/ui/alert-message'
import { ImageUpload } from '@/components/ui/image-upload'
import { MenuService } from '@/services/menuService'
import { useMenuStore } from '@/stores/menuStore'
import { MenuItem } from '@/types/menu'
import { useToast } from '@/hooks/use-toast'

interface MenuItemFormProps {
  item?: MenuItem
  mode?: 'create' | 'edit'
}

const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto'] as const
const spicyLevels = ['mild', 'medium', 'hot', 'extra-hot'] as const
const currencies = ['USD', 'EUR', 'GBP'] as const

export function MenuItemForm({ item, mode = 'create' }: MenuItemFormProps) {
  const router = useRouter()
  const { categories, setCategories } = useMenuStore()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    currency: item?.currency || 'USD',
    category: item?.category || '',
    subcategory: item?.subcategory || '',
    image: item?.image || '',
    available: item?.available ?? true,
    featured: item?.featured ?? false,
    spicyLevel: item?.spicyLevel || '',
    dietary: item?.dietary || [],
    allergens: item?.allergens || [],
    preparationTime: item?.preparationTime || '',
    calories: item?.calories || '',
  })
  
  const [newAllergen, setNewAllergen] = useState('')

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (categories.length === 0) {
          const categoriesData = await MenuService.getCategories()
          setCategories(categoriesData)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }

    loadCategories()
  }, [categories.length, setCategories])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    // Validation
    if (!formData.name.trim()) {
      setError('Item name is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0')
      return
    }
    if (!formData.category) {
      setError('Category is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const itemData = {
        ...formData,
        price: Number(formData.price),
        preparationTime: formData.preparationTime ? Number(formData.preparationTime) : undefined,
        calories: formData.calories ? Number(formData.calories) : undefined,
        dietary: formData.dietary as MenuItem['dietary'],
        spicyLevel: formData.spicyLevel as MenuItem['spicyLevel'] || undefined,
      }

      if (mode === 'edit' && item) {
        await MenuService.updateMenuItem(item.id, itemData)
        toast({
          title: 'Success',
          description: 'Menu item updated successfully',
        })
      } else {
        await MenuService.createMenuItem(itemData)
        toast({
          title: 'Success', 
          description: 'Menu item created successfully',
        })
      }

      router.push('/admin/menu-items')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save menu item')
    } finally {
      setIsLoading(false)
    }
  }
  // Handle dietary toggle
  const handleDietaryToggle = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet]
    }))
  }

  // Handle add allergen
  const handleAddAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }))
      setNewAllergen('')
    }
  }

  // Handle remove allergen
  const handleRemoveAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Message */}
      {error && (
        <AlertMessage
          type="error"
          title="Error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {mode === 'edit' ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Item'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField label="Item Name" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Description" required>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your menu item"
                  rows={4}
                  disabled={isLoading}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Price" required>
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="absolute left-0 top-0 h-full bg-transparent border-0 focus:ring-0 pr-8 text-slate-600"
                      disabled={isLoading}
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="pl-16"
                      disabled={isLoading}
                    />
                  </div>
                </FormField>

                <FormField label="Category" required>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Subcategory">
                <Input
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  placeholder="Optional subcategory"
                  disabled={isLoading}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Preparation Time (minutes)">
                  <Input
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                    placeholder="15"
                    disabled={isLoading}
                  />
                </FormField>

                <FormField label="Calories">
                  <Input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                    placeholder="250"
                    disabled={isLoading}
                  />
                </FormField>
              </div>

              <FormField label="Spicy Level">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, spicyLevel: '' }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !formData.spicyLevel ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    disabled={isLoading}
                  >
                    None
                  </button>
                  {spicyLevels.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, spicyLevel: level }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        formData.spicyLevel === level 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      disabled={isLoading}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="Dietary Options">
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map(diet => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => handleDietaryToggle(diet)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        formData.dietary.includes(diet)
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      disabled={isLoading}
                    >
                      {diet.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="Allergens">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newAllergen}
                      onChange={(e) => setNewAllergen(e.target.value)}
                      placeholder="Add allergen (e.g., nuts, dairy)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergen())}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={handleAddAllergen}
                      variant="outline"
                      disabled={isLoading}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.allergens.map(allergen => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          {allergen}
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergen(allergen)}
                            className="ml-2 hover:text-red-900"
                            disabled={isLoading}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle>Item Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.image}
                onChange={(imageData) => setFormData(prev => ({ ...prev, image: imageData }))}
                label="Menu Item Image"
                disabled={isLoading}
                compressionOptions={{
                  maxWidth: 400,
                  maxHeight: 400,
                  quality: 0.8
                }}
              />
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Item Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Available</label>
                  <p className="text-sm text-slate-600">Item is available for ordering</p>
                </div>
                <Switch
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                  disabled={isLoading}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Featured</label>
                  <p className="text-sm text-slate-600">Highlight this item</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}