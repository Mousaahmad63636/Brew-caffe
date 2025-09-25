import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import MenuHeader from '../components/MenuHeader';
import MainCategoryNav from '../components/MainCategoryNav';
import SubcategorySlider from '../components/SubcategorySlider';
import MenuCategory from '../components/MenuCategory';
import { fetchMenuData } from '../services/menuService';

export default function Menu() {
  const [activeMainCategory, setActiveMainCategory] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMenuData();
        setMenuData(data);
        // Set the first main category and its first subcategory as active by default
        if (data.mainCategories && data.mainCategories.length > 0) {
          const firstMainCategory = data.mainCategories[0];
          setActiveMainCategory(firstMainCategory.id);
          if (firstMainCategory.subcategories && firstMainCategory.subcategories.length > 0) {
            setActiveSubcategory(firstMainCategory.subcategories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load menu data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuData();
  }, []);

  const handleMainCategoryChange = (mainCategoryId) => {
    setActiveMainCategory(mainCategoryId);
    // Automatically select the first subcategory of the new main category
    const mainCategory = menuData.mainCategories.find(cat => cat.id === mainCategoryId);
    if (mainCategory && mainCategory.subcategories && mainCategory.subcategories.length > 0) {
      setActiveSubcategory(mainCategory.subcategories[0].id);
    }
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setActiveSubcategory(subcategoryId);
    // Scroll to the subcategory section
    const element = sectionRefs.current[subcategoryId];
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Get current main category and its subcategories
  const currentMainCategory = menuData?.mainCategories.find(cat => cat.id === activeMainCategory);
  const currentSubcategories = currentMainCategory?.subcategories || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-menu-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-accent-500 mx-auto mb-4"></div>
          <p className="text-menu-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-menu-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-menu-gray-800 mb-2">Unable to Load Menu</h2>
          <p className="text-menu-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-menu-accent-500 text-white px-6 py-2 rounded-lg hover:bg-menu-accent-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-menu-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-menu-gray-600">No menu data available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{menuData.restaurant.name} - Mobile Menu</title>
        <meta name="description" content={menuData.restaurant.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      <div className="min-h-screen bg-menu-gray-50">
        <MenuHeader restaurant={menuData.restaurant} />
        
        {/* Main Category Navigation */}
        <MainCategoryNav
          mainCategories={menuData.mainCategories}
          activeMainCategory={activeMainCategory}
          onMainCategoryChange={handleMainCategoryChange}
        />
        
        {/* Subcategory Slider */}
        <SubcategorySlider
          subcategories={currentSubcategories}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={handleSubcategoryChange}
        />
        
        {/* All Subcategories Display */}
        <main className="pb-8">
          {currentSubcategories.map((subcategory, index) => (
            <div key={subcategory.id}>
              {/* Subcategory Section Header */}
              <div 
                ref={el => sectionRefs.current[subcategory.id] = el}
                className="bg-white border-b border-menu-gray-200 px-4 py-3 sticky top-0 z-5"
              >
                <h2 className="text-lg font-semibold text-menu-gray-900 flex items-center space-x-2">
                  <span className="text-menu-accent-500">#{index + 1}</span>
                  <span>{subcategory.name}</span>
                </h2>
                <p className="text-sm text-menu-gray-600 mt-1">{subcategory.description}</p>
              </div>
              
              {/* Subcategory Items */}
              <MenuCategory
                category={subcategory}
                isVisible={true}
                showTitle={false} // We're showing our own title above
              />
            </div>
          ))}
          
          {currentSubcategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-menu-gray-600">No items available in this category</p>
            </div>
          )}
        </main>
        
        <footer className="bg-white border-t border-menu-gray-200 p-4">
          <div className="text-center text-menu-gray-600">
            <p className="text-sm">&copy; 2024 {menuData.restaurant.name}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}