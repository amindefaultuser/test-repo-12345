import { useState, useEffect } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Logo from "../../assets/plug/logo.png"
import Wallet from "../../assets/icons/wallet.svg"
import WalletPlus from "../../assets/icons/wallet-plus.svg"
import Transfer from "../../assets/icons/receipt.svg"
import Exchange from "../../assets/icons/exchange.svg"
import History from "../../assets/icons/history.svg"
import ExchangeModal from "../Modals/exchange-modal";
import useUserStore from "../../store/userStore";

const navItem = [
    {
        href: "/",
        title: "Balance",
        img: Wallet
    },
    { 
        href: "/payment", 
        title: "Payment",
        img: WalletPlus
    },
    { 
        href: "/transfer", 
        title: "Transfer",
        img: Transfer
    },
    { 
        title: "Exchange",
        img: Exchange
    },
    { 
        href: "/history", 
        title: "History",
        img: History
     }
];

interface NavProps {
    setIsNavExpanded?: (expanded: boolean) => void;
}

const Nav = ({ setIsNavExpanded }: NavProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState<number | null>(null);
    const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useUserStore();
    
    // Add animation styles
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            @keyframes iconPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .nav-icon-pulse {
                animation: iconPulse 1.5s infinite;
            }
            .tooltip-fade-in {
                animation: fadeIn 0.3s forwards;
            }
        `;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    useEffect(() => {
        setIsNavExpanded?.(isNavOpen);
    }, [isNavOpen, setIsNavExpanded]);

    return (
        <>
            {/* Toggle button for mobile */}
            <button 
                className="fixed top-[1vw] right-[1vw] z-50 w-[3vw] h-[3vw] sm:flex hidden items-center justify-center bg-[#2e2e2e] rounded-full shadow-lg"
                onClick={() => setIsNavOpen(!isNavOpen)}
            >
                <div className="relative w-[1.5vw] h-[1.5vw]">
                    <span className={`absolute left-0 w-full h-[0.2vw] bg-white transition-all duration-300 ${isNavOpen ? 'top-[0.65vw] rotate-45' : 'top-[0.3vw]'}`}></span>
                    <span className={`absolute left-0 top-[0.65vw] w-full h-[0.2vw] bg-white transition-all duration-300 ${isNavOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`absolute left-0 w-full h-[0.2vw] bg-white transition-all duration-300 ${isNavOpen ? 'top-[0.65vw] -rotate-45' : 'top-[1vw]'}`}></span>
                </div>
            </button>
            
            <div 
                className={`fixed top-0 left-0 h-[100vh] pt-[0.2vw] bg-[#2e2e2e] transition-all duration-300 ease-in-out group hover:w-[18.529vw] hover:ls:w-[21.529vw] ${isNavOpen ? 'w-[18.529vw] ls:w-[21.529vw]' : 'w-[5vw]'} shadow-xl z-40 flex flex-col`}
                onMouseEnter={() => setIsNavOpen(true)}
                onMouseLeave={() => setIsNavOpen(false)}
            >
                <div className="flex justify-center items-center py-[1.488vw] ls:py-[3.918vw] overflow-hidden">
                    <img src={Logo} alt="Logo" className="transition-all duration-300 w-[3vw] group-hover:w-[10.294vw] group-hover:ls:w-[13.294vw]" />
                </div>
                
                <div className="w-full h-[0.059vw] ls:h-[0.158vw] bg-white"></div>
                
                <div className="flex-1 overflow-y-auto py-[2.341vw] ">
                    <div className="space-y-[0.741vw]">
                        {navItem.map((item, index) => (
                            <button
                                key={index}
                                className={`w-full flex items-center justify-between h-[3.882vw] ls:h-[6.882vw] px-[1vw] group-hover:pl-[2.529vw] relative transition-all duration-300 ${(hoveredIndex === index || (item.href && location.pathname === item.href)) ? 'bg-[#3e3e3e]' : ''}`}
                                onClick={() => item.href ? navigate(item.href) : setIsOpen(!isOpen)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                               
                                <div className="flex items-center space-x-[1.159vw] overflow-hidden">
                                    <img 
                                        src={item.img} 
                                        alt={item.title} 
                                        className={`w-[2.5vw] h-[2.5vw] ls:w-[6vw] ls:h-[6vw] min-w-[2.5vw] min-h-[2.5vw] ls:min-w-[6vw] ls:min-h-[6vw] ${(item.href && location.pathname === item.href) ? 'nav-icon-pulse' : ''}`}
                                        onMouseEnter={() => !isNavOpen && setShowTooltip(index)}
                                        onMouseLeave={() => setShowTooltip(null)} 
                                    />
                                    <span className="text-[1.359vw] ls:text-[2.159vw] font-bold !text-white uppercase tracking-widest whitespace-nowrap transition-all duration-300">
                                        {item.title}
                                    </span>
                                </div>
                               
                                
                                {/* Tooltip when nav is collapsed */}
                                {!isNavOpen && showTooltip === index && (
                                    <div className="absolute left-[5.5vw] top-[50%] transform -translate-y-1/2 bg-[#4AB094] text-white py-[0.5vw] px-[1vw] rounded-md z-10 tooltip-fade-in whitespace-nowrap">
                                        {item.title}
                                        <div className="absolute left-[-0.5vw] top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[0.5vw] border-t-transparent border-r-[0.5vw] border-r-[#4AB094] border-b-[0.5vw] border-b-transparent"></div>
                                    </div>
                                )} {(item.href && location.pathname === item.href) && (
                                    <div className="absolute right-0 top-0 bottom-0 w-[0.3vw] bg-[#4AB094] animate-pulse"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                
                {isOpen && <ExchangeModal setIsOpen={setIsOpen} />}
                
                {/* Logout Button */}
                <div className="mt-auto pt-[1vw] border-t border-gray-700 mb-[2vw]">
                    <button 
                        className="w-full flex items-center justify-between h-[3.882vw] ls:h-[6.882vw] px-[1vw] group-hover:pl-[2.529vw] relative transition-all duration-300 hover:bg-[#3e3e3e]"
                        onClick={() => {
                            setUser(null);
                            navigate('/login');
                        }}
                        onMouseEnter={() => setShowLogoutTooltip(true)}
                        onMouseLeave={() => setShowLogoutTooltip(false)}
                    >
                        <div className="flex items-center space-x-[1.159vw] overflow-hidden">
                            <div className="flex items-center justify-center">
                                <svg className={`text-red-500 w-[2.5vw] h-[2.5vw] ls:w-[6vw] ls:h-[6vw] min-w-[2.5vw] min-h-[2.5vw] ls:min-w-[6vw] ls:min-h-[6vw]`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <span className="text-[1.359vw] ls:text-[2.159vw] font-bold text-red-500 uppercase tracking-widest whitespace-nowrap transition-all duration-300">
                                Logout
                            </span>
                        </div>
                        
                        {/* Tooltip when nav is collapsed */}
                        {!isNavOpen && showLogoutTooltip && (
                            <div className="absolute left-[5.5vw] top-[50%] transform -translate-y-1/2 bg-red-500 text-white py-[0.5vw] px-[1vw] rounded-md z-10 tooltip-fade-in whitespace-nowrap">
                                Logout
                                <div className="absolute left-[-0.5vw] top-[50%] transform -translate-y-1/2 w-0 h-0 border-t-[0.5vw] border-t-transparent border-r-[0.5vw] border-r-red-500 border-b-[0.5vw] border-b-transparent"></div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Nav;