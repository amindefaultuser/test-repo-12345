import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Wallet from "../../assets/icons/wallet.svg"
import WalletPlus from "../../assets/icons/wallet-plus.svg"
import Transfer from "../../assets/icons/receipt.svg"
import Exchange from "../../assets/icons/exchange.svg"
import History from "../../assets/icons/history.svg"
import ExchangeModal from "../Modals/exchange-modal";

const navItem = [
    {
      title: "Balance",
      img: Wallet,
      href: "/"
    },
    {
        title: "Add",
        img: WalletPlus,
        href: "/payment"
    },
    {
        title: "Transfer",
        img: Transfer,
        href: "/transfer"
    },
    {
        title: "Exchange",
        img: Exchange,
    },
    {
        title: "History",
        img: History,
        href: "/history"
    }
]

// Animation styles for consistency with other components
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .nav-item-active {
    color: #4AB094;
  }
  
  .nav-item-active img {
    filter: brightness(0) saturate(100%) invert(62%) sepia(10%) saturate(2091%) hue-rotate(114deg) brightness(92%) contrast(88%);
  }
  
  .nav-container {
    animation: fadeIn 0.3s ease-out;
    border-top: 1px solid rgba(0,0,0,0.1);
  }
  
  .nav-icon {
    filter: brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(10%) hue-rotate(10deg) brightness(90%) contrast(90%);
  }
  
  .nav-item:hover .nav-icon-container {
    background-color: rgba(74,176,148,0.05);
  }
  
  .nav-item:hover .nav-label {
    color: #4AB094;
  }
`;

const NavMobile = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Add animation styles to document head
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <div className='bg-white shadow-lg h-[17.778vw] flex justify-around items-center w-full nav-container'>
            {navItem.map((item) => {
                const isActive = item.href && location.pathname === item.href;
                return (
                    <button
                        onClick={() => item.href ? navigate(item.href) : setIsOpen(!isOpen)}
                        key={item.title}
                        className={`flex flex-col items-center cursor-pointer space-y-[0.889vw] relative nav-item ${isActive ? 'nav-item-active' : ''}`}
                    >
                       
                        <div className={`w-[8vw] h-[8vw] flex items-center justify-center rounded-full nav-icon-container ${isActive ? 'bg-[rgba(74,176,148,0.1)]' : 'bg-[#f5f5f5]'}`}>
                            <img src={item.img} alt={item.title} className={`w-[5vw] ${isActive ? '' : 'nav-icon'}`} />
                        </div>
                        <span className={`text-[2.5vw] font-medium uppercase nav-label ${isActive ? 'text-[#4AB094]' : 'text-[#2e2e2e]'}`}>
                            {item.title}
                        </span>
                    </button>
                );
            })}
            {isOpen && <ExchangeModal setIsOpen={setIsOpen} />}
        </div>
    );
}

export default NavMobile;