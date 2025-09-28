import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { fetchMenuItems, deleteMenuItem } from '../../services/menuItemsService';

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchMenuItems();
        setItems(data);
      } catch (err) {
        console.error('Error loading menu items:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadItems();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
        // Remove the deleted item from the state
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        alert(`Failed to delete: ${err.message}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Menu Items">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-accent-500 mx-auto"></div>
          <p className="mt-4 text-menu-gray-600">Loading menu items...</p>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Menu Items">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Menu Items">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-menu-gray-900">All Menu Items</h2>
        <Link href="/admin/add-item" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-menu-accent-600 hover:bg-menu-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500">
            Add New Item
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-menu-gray-200">
          {items.length === 0 ? (
            <li className="px-6 py-4 text-center text-menu-gray-500">
              No menu items found. Click "Add New Item" to create one.
            </li>
          ) : (
            items.map((item) => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {item.image && (
                      <div className="flex-shrink-0 h-12 w-12 mr-4">
                        <img className="h-12 w-12 rounded-md object-cover" src={item.image} alt={item.name} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-menu-gray-900">{item.name}</h3>
                        {item.popular && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Popular
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Vegetarian
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-menu-gray-500">{item.category}</p>
                      <p className="mt-1 text-sm text-menu-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/admin/edit-item/${item.id}`} className="inline-flex items-center px-3 py-1 border border-menu-accent-600 text-sm font-medium rounded-md text-menu-accent-600 bg-white hover:bg-menu-accent-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500">
                        Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center px-3 py-1 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </AdminLayout>
  );
}
