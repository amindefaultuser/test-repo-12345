import React, { useEffect, useState } from 'react';
import { Nav, NavMobile, HeaderMobile } from '../components';
import axios from 'axios';
import useUserStore from '../store/userStore'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setLoader = useUserStore((state) => state.setLoader);
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoader(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('User data:', response.data);
        setUser(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setUser(null);
      }).finally(() => {
        setLoader(false);
      });
  }, [setUser]);

  return (
    <div className='bg-[#2e2e2e] pt-[1.2vw] pb-[1.2vw] pr-[2vw] sm:p-0'>
      <div className="sm:block hidden w-full">
        <HeaderMobile />
      </div>
      <div className="flex ">
        <div className="fixed left-0 top-0 sm:hidden">
          <Nav setIsNavExpanded={setIsNavExpanded} />
        </div>
        <div className={` ${isNavExpanded ? 'w-[calc(100%-18.529vw)]' : ' w-[calc(100%-5vw)]'} transition-all duration-300 ${isNavExpanded ? 'ml-[18.529vw] ls:ml-[21.529vw]' : 'ml-[5vw]'} sm:!ml-0 bg-white min-h-[calc(100vh-2.4vw)] rounded-[2vw] sm:w-full sm:rounded-[0vw]`}>
          {children}
          <div className="hidden bg-white w-full fixed left-0 bottom-0 sm:block z-[9999]">
            <NavMobile />
          </div>
        </div>
      </div>
      {/* <div className=''>
          <Footer />
      </div> */}
    </div>
  );
};

export default Layout;
