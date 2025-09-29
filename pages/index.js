import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import MenuHeader from '../components/MenuHeader';
import MainCategoryNav from '../components/MainCategoryNav';
import SubcategorySlider from '../components/SubcategorySlider';
import MenuCategory from '../components/MenuCategory';

export default function Menu() {
  const [activeMainCategory, setActiveMainCategory] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [error, setError] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load menu data
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error(`Failed to fetch menu: ${response.status}`);
        }
        
        const data = await response.json();
        setMenuData(data);
        
        // Load hero image
        try {
          const heroResponse = await fetch('/api/hero-image');
          if (heroResponse.ok) {
            const heroData = await heroResponse.json();
            if (heroData.image) {
              setHeroImage(heroData);
            }
          }
        } catch (heroErr) {
          console.log('No hero image found:', heroErr);
        }
        
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

  // Empty state - no categories created yet
  if (!menuData.mainCategories || menuData.mainCategories.length === 0) {
    return (
      <>
        <Head>
          <title>{menuData.restaurant.name} - Mobile Menu</title>
          <meta name="description" content={menuData.restaurant.description} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          <MenuHeader restaurant={menuData.restaurant} />
          
          <div className="flex items-center justify-center min-h-[60vh] px-6">
            <div className="text-center max-w-md mx-auto">
              <div className="text-8xl mb-6">🍽️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to {menuData.restaurant.name}!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our delicious menu is being carefully crafted. 
                Please check back soon for our amazing offerings!
              </p>
              <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-orange-800 mb-2">🚀 Coming Soon:</h3>
                <p className="text-orange-700 text-sm">
                  Fresh ingredients, authentic flavors, and memorable dining experiences.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p className="mb-2">📍 {menuData.restaurant.location}</p>
                <p>{menuData.restaurant.description}</p>
              </div>
            </div>
          </div>
        </div>
      </>
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
        {/* Hero Image Section */}
        {heroImage?.image && (
          <div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden">
            <img
              src={heroImage.image}
              alt="Restaurant Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center drop-shadow-lg mb-2">
                {menuData.restaurant.name}
              </h1>
              {menuData.restaurant.description && (
                <p className="text-sm md:text-base text-center max-w-2xl drop-shadow-md opacity-90">
                  {menuData.restaurant.description}
                </p>
              )}
            </div>
          </div>
        )}

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