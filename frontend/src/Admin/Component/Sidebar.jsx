  import React from 'react';
  import { X, Image, LayoutDashboard,Layers, Users, ShoppingBag,Palette,Frame, BoxIcon, Instagram, Star } from 'lucide-react';
  import { Link } from 'react-router-dom';

  const Sidebar = ({ isOpen, toggleSidebar }) => {
    const menuItems = [
      { name:'Dashboard', icon: <LayoutDashboard />, link: '/admin' },
      {name:"Category", icon:<Layers />, link:'/admin/category'},
      {name:"Products",icon:<ShoppingBag />, link:'/admin/products'},
      {name:"Color", icon:<Palette />, link:'/admin/color'},
      {name:"Orders", icon:<BoxIcon />, link:'/admin/orders'},
      {name:"Instagram", icon:<Instagram />, link:'/admin/instagram'},
      {name:"Slider", icon:<BoxIcon />, link:'/admin/slider'},
      {name:"Review", icon:<Star/>, link:'/admin/review'},
    ];

    return (
      <>
        {/* Overlay on mobile */}
        {isOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black opacity-30 z-30 sm:hidden"
          />
        )}

        {/* Sidebar */}
        <div className={`fixed sm:static inset-y-0 left-0 z-40 w-64 transform bg-white border-r shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
          <div className="flex justify-between items-center p-6">
            <div className="text-xl font-bold text-[#262B0D]">Admin Z&M</div>
            <button onClick={toggleSidebar} className="sm:hidden">
              <X />
            </button>
          </div>
          <ul>
    {menuItems?.map(item => (
      <li key={item.name}>
        <Link
          to={item.link || '#'}
          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 cursor-pointer"
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      </li>
    ))}
  </ul>

        </div>
      </>
    );
  };

  export default Sidebar;
