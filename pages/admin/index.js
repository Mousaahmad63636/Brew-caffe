import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/admin/Layout';

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch data from API routes instead of direct imports
        const itemsResponse = await fetch('/api/menu-items');
        const items = await itemsResponse.json();
        
        // Extract unique categories from items
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        
        setMenuItems(items);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set empty arrays on error to prevent crashes
        setMenuItems([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-accent-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Calculate some stats for the dashboard
  const totalItems = menuItems.length;
  const itemsByCategory = categories.map(category => ({
    name: category,
    count: menuItems.filter(item => item.category === category).length
  }));

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard - Menu Management</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-menu-gray-900">Dashboard</h1>
          <Link
            href="/admin/items/new"
            className="px-4 py-2 bg-menu-accent-500 text-white rounded-md hover:bg-menu-accent-600 transition-colors"
          >
            Add New Item
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-menu-gray-700">Total Menu Items</h2>
            <p className="text-3xl font-bold text-menu-accent-500 mt-2">{totalItems}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-menu-gray-700">Categories</h2>
            <p className="text-3xl font-bold text-menu-accent-500 mt-2">{categories.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-menu-gray-700">Most Recent Update</h2>
            <p className="text-menu-gray-600 mt-2">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-menu-gray-200">
            <h2 className="text-lg font-semibold text-menu-gray-700">Items by Category</h2>
          </div>
          <div className="divide-y divide-menu-gray-200">
            {itemsByCategory.map(category => (
              <div key={category.name} className="px-6 py-4 flex justify-between items-center">
                <span className="text-menu-gray-700">{category.name}</span>
                <span className="bg-menu-accent-100 text-menu-accent-800 px-2 py-1 rounded-full text-sm">
                  {category.count} items
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-menu-gray-200">
            <h2 className="text-lg font-semibold text-menu-gray-700">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/items"
              className="flex items-center justify-center px-4 py-3 bg-menu-gray-50 hover:bg-menu-gray-100 rounded-md transition-colors"
            >
              <span className="text-menu-gray-700">View All Items</span>
            </Link>
            <Link
              href="/admin/items/new"
              className="flex items-center justify-center px-4 py-3 bg-menu-gray-50 hover:bg-menu-gray-100 rounded-md transition-colors"
            >
              <span className="text-menu-gray-700">Add New Item</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center px-4 py-3 bg-menu-gray-50 hover:bg-menu-gray-100 rounded-md transition-colors"
            >
              <span className="text-menu-gray-700">View Menu Frontend</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
