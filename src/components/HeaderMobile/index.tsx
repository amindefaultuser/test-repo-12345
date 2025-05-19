import { useState } from "react";
import Logo from "../../assets/plug/logo.png";
import Support from "../../assets/icons/support.svg";
import Document from "../../assets/icons/document.svg";
import Profile from "../../assets/icons/profile-user.svg";
import Bell from "../../assets/icons/bell.svg";
import BellNotifications from "../../assets/image/bellNotifications.png";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

const HeaderMobile = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const user = useUserStore((state) => state.user);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsMenuOpen(false); // Close menu when opening notifications
    };

    return (
        <div className='bg-[#ffffff] relative shadow-[0_4px_20px_rgba(0,0,0,0.1)] border-b border-[rgba(74,176,148,0.1)]'>
            <div className="py-[2.333vw] px-[4.513vw] w-full sm:flex items-center justify-between hidden">
                <div className="flex items-center">
                    <img src={Logo} alt="Logo" className="w-[20.441vw]" />
                </div>
                <div className="flex flex-col items-center">
                        <span className="text-[3.111vw] font-medium text-[#056661] leading-tight">
                            Account Id:
                        </span>
                        <span className="text-[3.111vw] font-bold text-[#056661] leading-tight flex items-center">
                            {user?.account_id}
                        </span>
                    </div>
                <div className="flex items-center space-x-[3vw]">
                    {/* Account ID */}
                   

                    {/* Menu Button */}
                    <button 
                        onClick={toggleMenu}
                        className="w-[8vw] h-[8vw] flex items-center justify-center bg-[#f5f5f5] rounded-full"
                    >
                        <svg className="w-[4vw] h-[4vw] text-[#056661]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>

                    {/* Notification Button */}
                    <button 
                        onClick={toggleNotification}
                        className="w-[8vw] h-[8vw] flex items-center justify-center bg-[#f5f5f5] rounded-full relative"
                    >
                        <img src={Bell} alt="Bell" className="w-[4vw]" />
                    </button>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-[4.513vw] top-[12vw] z-[99999] w-[45vw] bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-[2vw]">
                        <button 
                            onClick={() => {
                                navigate("/support");
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center space-x-[2vw] w-full py-[2vw] px-[2vw] hover:bg-gray-100 rounded-lg"
                        >
                            <img src={Support} alt="Support" className="w-[5vw]" />
                            <span className="text-[3.5vw] text-[#056661]">Support</span>
                        </button>
                        
                        <button 
                            onClick={() => {
                                navigate("/refferals");
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center space-x-[2vw] w-full py-[2vw] px-[2vw] hover:bg-gray-100 rounded-lg"
                        >
                            <img src={Profile} alt="Referrals" className="w-[5vw]" />
                            <span className="text-[3.5vw] text-[#056661]">Referrals</span>
                        </button>
                        
                        <button 
                            onClick={() => {
                                navigate("/profile");
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center space-x-[2vw] w-full py-[2vw] px-[2vw] hover:bg-gray-100 rounded-lg"
                        >
                            <img src={Document} alt="Profile" className="w-[5vw]" />
                            <span className="text-[3.5vw] text-[#056661]">Profile</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Dropdown */}
            {isNotificationOpen && (
                <div className="absolute right-[4.513vw] top-[12vw] z-[99999] w-[45vw] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center p-[4vw]">
                    <div className="flex flex-col items-center justify-center space-y-[2vw]">
                        <img src={BellNotifications} alt="Bell" className="w-[15vw]" />
                        <p className="text-[3.5vw] font-bold text-[#056661] text-center">
                            You have no notifications
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeaderMobile;