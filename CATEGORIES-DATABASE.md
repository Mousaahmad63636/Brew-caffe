# Categories Database Structure Documentation

## ✅ Task 2 Complete: Firestore Categories Collection

### Database Design

**Collection:** `categories`

**Document Structure:**
```javascript
{
  id: "pizza",                    // Document ID (auto-generated or custom)
  name: "Pizza",                  // Display name
  description: "Authentic wood-fired pizzas...", // Category description
  color: "orange",                // UI theme color (orange, blue, pink, red, green)
  order: 1,                       // Display order (ascending)
  active: true,                   // Soft delete flag
  subcategories: [                // Array of subcategories
    {
      id: "margherita",           // Subcategory ID
      name: "Margherita Pizzas",  // Subcategory display name
      description: "Classic Italian...", // Subcategory description
      order: 1,                   // Subcategory display order
      active: true               // Subcategory active status
    }
  ],
  createdAt: Timestamp,          // Creation date
  updatedAt: Timestamp           // Last modification date
}
```

### Color Scheme Mapping
- **Pizza:** orange (orange-500, orange-50, orange-200, etc.)
- **Beverages:** blue (blue-500, blue-50, blue-200, etc.)
- **Pasta:** pink (pink-500, pink-50, pink-200, etc.)
- **Burgers:** red (red-500, red-50, red-200, etc.)
- **Salads:** green (green-500, green-50, green-200, etc.)

### Service Functions

**CategoriesService** provides:
- `getAllCategories()` - Fetch all active categories
- `getCategoryById(id)` - Get specific category
- `createCategory(data)` - Create new category
- `updateCategory(id, updates)` - Update category
- `deleteCategory(id)` - Soft delete category
- `addSubcategory(categoryId, data)` - Add subcategory
- `updateSubcategory(categoryId, subId, updates)` - Update subcategory
- `removeSubcategory(categoryId, subId)` - Remove subcategory

### Setup Scripts

1. **Migration:** `npm run migrate-categories`
   - Migrates existing hardcoded categories to Firestore
   - Creates initial database structure

2. **Testing:** `npm run test-categories`
   - Validates all CRUD operations
   - Tests subcategory management

3. **Complete Setup:** `./setup-categories-db.bat`
   - Runs Firebase test + migration + validation
   - One-click database setup

### Database Indexing

Firestore will automatically create indexes for:
- `active` field (for filtering)
- `order` field (for sorting)
- Composite index for `active + order` (recommended)

### Integration Points

**Components to Update:**
- `MainCategoryNav.js` - Dynamic color schemes
- `SubcategorySlider.js` - Dynamic subcategories
- `ItemForm.js` - Category/subcategory dropdowns
- `MenuService.js` - Category fetching logic

**Admin Features Required:**
- Category CRUD interface
- Subcategory management
- Color scheme selection
- Ordering/reordering capabilities

### Next Implementation Steps

1. **Task 3:** Create Category Management Service (✅ Complete)
2. **Task 4:** Build Admin Category Management UI
3. **Task 5:** Update Existing Components for Dynamic Categories
