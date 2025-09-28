import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import categoriesService from '../../services/categoriesService';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight,
  Save,
  X,
  Move,
  Palette
} from 'lucide-react';

const COLOR_OPTIONS = [
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-500' },
  { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500' }
];

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: 'orange',
    order: 1
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: '',
    order: 1
  });

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesService.createCategory(categoryForm);
      setSuccess('Category created successfully!');
      setCategoryForm({ name: '', description: '', color: 'orange', order: 1 });
      setShowAddCategory(false);
      await loadCategories();
    } catch (err) {
      setError('Failed to create category: ' + err.message);
    }
  };

  const handleUpdateCategory = async (categoryId, updates) => {
    try {
      await categoriesService.updateCategory(categoryId, updates);
      setSuccess('Category updated successfully!');
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      setError('Failed to update category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await categoriesService.deleteCategory(categoryId);
      setSuccess('Category deleted successfully!');
      await loadCategories();
    } catch (err) {
      setError('Failed to delete category: ' + err.message);
    }
  };

  const handleAddSubcategory = async (categoryId) => {
    try {
      await categoriesService.addSubcategory(categoryId, subcategoryForm);
      setSuccess('Subcategory added successfully!');
      setSubcategoryForm({ name: '', description: '', order: 1 });
      setAddingSubcategoryTo(null);
      await loadCategories();
    } catch (err) {
      setError('Failed to add subcategory: ' + err.message);
    }
  };

  const handleUpdateSubcategory = async (categoryId, subcategoryId, updates) => {
    try {
      await categoriesService.updateSubcategory(categoryId, subcategoryId, updates);
      setSuccess('Subcategory updated successfully!');
      await loadCategories();
    } catch (err) {
      setError('Failed to update subcategory: ' + err.message);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId, subcategoryName) => {
    if (!confirm(`Are you sure you want to delete "${subcategoryName}"?`)) {
      return;
    }
    
    try {
      await categoriesService.removeSubcategory(categoryId, subcategoryId);
      setSuccess('Subcategory deleted successfully!');
      await loadCategories();
    } catch (err) {
      setError('Failed to delete subcategory: ' + err.message);
    }
  };

  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      orange: 'bg-orange-500 text-white border-orange-500',
      blue: 'bg-blue-500 text-white border-blue-500',
      pink: 'bg-pink-500 text-white border-pink-500',
      red: 'bg-red-500 text-white border-red-500',
      green: 'bg-green-500 text-white border-green-500',
      purple: 'bg-purple-500 text-white border-purple-500',
      yellow: 'bg-yellow-500 text-white border-yellow-500',
      indigo: 'bg-indigo-500 text-white border-indigo-500'
    };
    return colorMap[color] || colorMap.orange;
  };

  if (loading) {
    return (
      <AdminLayout title="Manage Categories">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Categories">
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Manage your menu categories and subcategories</p>
          <p className="text-sm text-gray-500 mt-1">
            Total: {categories.length} categories, {categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)} subcategories
          </p>
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} />
            Add New Category
          </h3>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Desserts, Appetizers"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                rows="3"
                placeholder="Brief description of this category..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, color: colorOption.value })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      categoryForm.color === colorOption.value
                        ? 'border-gray-800 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${colorOption.color}`}></div>
                    <span className="text-sm">{colorOption.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Save size={16} />
                Create Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Main Category Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {expandedCategories.has(category.id) ? 
                      <ChevronDown size={20} /> : 
                      <ChevronRight size={20} />
                    }
                  </button>
                  
                  <div className={`w-4 h-4 rounded-full ${COLOR_OPTIONS.find(c => c.value === category.color)?.color || 'bg-gray-400'}`}></div>
                  
                  {editingCategory?.id === category.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="border border-gray-300 rounded px-2 py-1 text-lg font-semibold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateCategory(category.id, {
                          name: editingCategory.name,
                          description: editingCategory.description
                        })}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Order: {category.order}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {(category.subcategories || []).length} subs
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                    title="Edit category"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategories (when expanded) */}
            {expandedCategories.has(category.id) && (
              <div className="p-6">
                {/* Add Subcategory Form */}
                <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <Plus size={16} />
                    Add Subcategory to {category.name}
                  </h4>
                  {addingSubcategoryTo === category.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Subcategory name"
                          value={subcategoryForm.name}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, name: e.target.value})}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="number"
                          placeholder="Order"
                          value={subcategoryForm.order}
                          onChange={(e) => setSubcategoryForm({...subcategoryForm, order: parseInt(e.target.value) || 1})}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                          min="1"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={subcategoryForm.description}
                        onChange={(e) => setSubcategoryForm({...subcategoryForm, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddSubcategory(category.id)}
                          disabled={!subcategoryForm.name}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Save size={16} />
                          Add Subcategory
                        </button>
                        <button
                          onClick={() => {
                            setAddingSubcategoryTo(null);
                            setSubcategoryForm({ name: '', description: '', order: 1 });
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingSubcategoryTo(category.id)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Subcategory
                    </button>
                  )}
                </div>

                {/* Subcategories List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Subcategories ({(category.subcategories || []).length})
                  </h4>
                  {(category.subcategories || [])
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Move size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            #{subcategory.order || 0}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{subcategory.name}</span>
                          {subcategory.description && (
                            <span className="text-gray-600 text-sm ml-2">- {subcategory.description}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subcategory.active !== false
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subcategory.active !== false ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleDeleteSubcategory(category.id, subcategory.id, subcategory.name)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Delete subcategory"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!category.subcategories || category.subcategories.length === 0) && (
                    <p className="text-gray-500 text-sm italic py-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                      No subcategories yet. Add one above to get started.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="max-w-sm mx-auto">
            <Palette size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first menu category. Categories help organize your menu items.
            </p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Create Your First Category
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions Panel */}
      {categories.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800">Migration Tools</h4>
              <p className="text-blue-600">
                Need to import categories from the old system? 
                Run: <code className="bg-blue-100 px-1 rounded">npm run migrate-categories</code>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Testing</h4>
              <p className="text-blue-600">
                Test category operations: 
                <code className="bg-blue-100 px-1 rounded">npm run test-categories</code>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Next Steps</h4>
              <p className="text-blue-600">
                After setting up categories, add menu items to each subcategory in the Menu Items section.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
