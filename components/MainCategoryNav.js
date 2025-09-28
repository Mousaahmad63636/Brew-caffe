import React from 'react';

const MainCategoryNav = ({ mainCategories, activeMainCategory, onMainCategoryChange }) => {
  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMainCategoryChange(categoryId);
    }
  };

  // Define unique colors for each main category button (not background)
  const getCategoryColors = (categoryId) => {
    const colorMap = {
      'pizza': {
        active: 'bg-orange-500 text-white border-orange-500',
        inactive: 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300'
      },
      'beverages': {
        active: 'bg-blue-500 text-white border-blue-500',
        inactive: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
      },
      'pasta': {
        active: 'bg-pink-500 text-white border-pink-500',
        inactive: 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50 hover:border-pink-300'
      },
      'burgers': {
        active: 'bg-red-500 text-white border-red-500',
        inactive: 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
      }
    };
    return colorMap[categoryId] || colorMap['pizza'];
  };

  // Professional SVG icons for each category
  const getCategoryIcon = (categoryId, className) => {
    const iconMap = {
      'pizza': (
        // Pizza slice icon
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l10 20-10-5-10 5L12 2z" />
        </svg>
      ),
      'beverages': (
        // Wine glass icon
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12V7a1 1 0 011-1h12a1 1 0 011 1v5M5 12l2 7h10l2-7M5 12h14" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V2M9 2h6" />
        </svg>
      ),
      'pasta': (
        // Pasta/noodles icon
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v12M16 6v12" />
        </svg>
      ),
      'burgers': (
        // Burger icon
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 8h16a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M8 16h8" />
        </svg>
      )
    };
    return iconMap[categoryId] || iconMap['pizza'];
  };

  return (
    <nav className="bg-white sticky top-0 z-20 shadow-lg border-b border-gray-200">
      <div className="px-3 py-4">
        <div className="flex justify-center items-center space-x-3 overflow-x-auto scrollbar-hide">
          {mainCategories.map((category) => {
            const categoryColors = getCategoryColors(category.id);
            const isActive = activeMainCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onMainCategoryChange(category.id)}
                onKeyDown={(e) => handleKeyDown(e, category.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-1 max-w-24 border-2 ${
                  isActive
                    ? `${categoryColors.active} shadow-lg transform scale-105 focus:ring-white`
                    : `${categoryColors.inactive} hover:scale-102 focus:ring-gray-300`
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex flex-col items-center space-y-1">
                  {getCategoryIcon(category.id, "w-5 h-5 stroke-current")}
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MainCategoryNav;