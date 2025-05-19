import { useState, useEffect } from "react";
import { Header } from "..";
import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import Balance from "../../assets/icons/balance.svg";
import Euro from "../../assets/icons/euro.svg";
import useUserStore from '../../store/userStore';
import { useNavigate } from "react-router-dom";
import { useBalanceStore } from "../../store/balanceStore";

// Додаємо CSS для анімації
const animationStyles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  .animate-fade-in-out {
    animation: fadeInOut 2s ease-in-out;
  }

  .wallet-card {
    transition: all 0.3s ease;
  }

  .wallet-card:hover {
    transform: translateY(-5px);
  }
`;

const walletAddresses = [
    {
        label: "USDT",
        network: "TRC20:",
        image: USDT,
        address: "TNt7b9Nm3BJmYdeVFkavpd6NEmTUs9NxYD",
        color: "#4AB094",
        bg: "rgba(74, 176, 148, 0.2)"
    },
    {
        label: "BTC",
        network: "Bitcoin:",
        image: BTC,
        address: "bc1q7qz9s0v36v3yqq7ss2y5zk7jcz960wzfscrm9a",
        color: "#F28B49",
        bg: "rgba(242, 139, 73, 0.2)"
    },
    {
        label: "ETH",
        network: "ERC20:",
        image: ETH,
        address: "0x195fe4951A047BE75E400c00b95d019D0565f012",
        color: "#6489A4",
        bg: "rgba(100, 137, 164, 0.2)"
    },
    {
        label: "DASH",
        network: "Dash:",
        image: USDTD,
        address: "Xx3KoZqSHkxxwBaUAJonE7RFXDbDvFp37v",
        color: "#F3BA2F",
        bg: "rgba(243, 186, 47, 0.2)"
    },
];

const transferLimits = [
    {
        value: "1 000",
        label: "Min. per transaction"
    },
    {
        value: "3 000 000",
        label: "Max. per transaction"
    },
    {
        value: "Instantly",
        label: "Transfer term"
    }
];

const PaymentComponent = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const [activeTab, setActiveTab] = useState(0);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>("USDT");
    const { balance } = useBalanceStore();
    
    // Додаємо стан для нових функцій
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        // Симулюємо затримку API
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Використовуємо стилі анімації
    useEffect(() => {
        // Додаємо стилі до head документа
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
        // Видаляємо стилі при розмонтуванні компонента
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);
    
    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setShowNotification(true);
        
        setTimeout(() => {
            setShowNotification(false);
            setCopiedAddress(null);
        }, 2000);
    };
    
    const handleCurrencySelect = (label: string) => {
        setSelectedCurrency(selectedCurrency === label ? null : label);
    };
    
  

    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0 ">
            {/* Notification для скопійованої адреси */}
            {showNotification && (
                <div className="fixed top-[5vw] right-[5vw] bg-[#4AB094] text-white py-[1vw] px-[2vw] rounded-lg shadow-lg z-50 animate-fade-in-out">
                    <p className="text-[1vw] sm:text-[3vw]">Address copied to clipboard!</p>
                </div>
            )}
            
            {/* QR-код модальне вікно */}
           
            <div className="sm:hidden mb-[3vw]">
                <Header />
            </div>
            <div className=" hidden sm:flex flex-col  justify-between ls:space-x-[1.111vw] py-[5vw]">
                    <span className="text-[7.679vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
             </div>
          

            {user?.blocked && (
                <div className="flex items-center justify-between ls:space-x-[1.111vw] sm:block hidden">
                    <span className="text-[1.179vw] sm:text-[0.7vw] ls:!text-[3.844vw] text-red-500 font-bold uppercase">Your account has been blocked, please contact support</span>
                </div>
            )}
            <div className="mt-[2vw] hidden sm:block rounded-xl p-4 shadow-lg !mb-[8vw]" style={{ background: 'linear-gradient(135deg, #4AB094 0%, #376D47 100%)' }}>
                            <div className="space-y-[1vw]">
                                <p className="text-[1.2vw] sm:text-[3.5vw] font-medium text-white opacity-80">Current Balance</p>
                                <p className="text-[2.2vw] sm:text-[5vw] font-bold text-white">${balance || '0.00'}</p>
                            </div>
                            
                            <div className="mt-[2vw] flex justify-between">
                                <button 
                                    onClick={() => navigate('/transfer')}
                                    className="text-[1vw] sm:text-[3vw] bg-white text-[#4AB094] px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Transfer
                                </button>
                                <button 
                                    onClick={() => navigate('/history')}
                                    className="text-[1vw] sm:text-[3vw] bg-transparent text-white border border-white px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-white/10 transition-colors"
                                >
                                    History
                                </button>
                            </div>
                        </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-[40vh]">
                    <div className="animate-spin rounded-full h-[5vw] w-[5vw] border-t-2 border-b-2 border-[#4AB094]"></div>
                </div>
            ) : (
                <div className="flex space-x-[3vw] m-0 sm:flex-col sm:space-x-0 sm:space-y-[5vw]">
                    <div className="w-[70vw] sm:w-full space-y-[1vw] sm:space-y-[5vw]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-4 sm:space-y-0">            
                            <div className="flex space-x-[1vw] sm:space-x-[2vw]">
                                {['All', 'USDT', 'BTC', 'ETH', 'DASH'].map((tab, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`px-[1vw] py-[0.5vw] rounded-full text-[1vw] sm:text-[3vw] font-medium transition-all ${activeTab === index ? 'bg-[#4AB094] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ maxWidth: '100%', background: 'rgba(55, 109, 71, 0.2)' }} className="rounded-xl p-4 shadow-lg transition-all duration-500 ease-in-out">
                            <div className="space-y-[0.5vw] mb-[1vw]">
                                <p className="text-[2.1vw] m-0 pl-[0.5vw] sm:text-[4vw] font-bold text-black">
                                    Wallet Addresses
                                </p>
                                <p className="text-[1.1vw] m-0 pl-[0.5vw] sm:text-[2.5vw] text-black">
                                    Use these addresses to deposit funds
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                {walletAddresses
                                    .filter(item => activeTab === 0 || item.label === ['All', 'USDT', 'BTC', 'ETH', 'DASH'][activeTab])
                                    .map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex items-center space-x-[1.579vw] p-3 rounded-lg transition-all duration-300 hover:shadow-md ${selectedCurrency === item.label ? 'ring-2 ring-[#4AB094]' : ''}`}
                                        style={{ backgroundColor: item.bg }}
                                        onClick={() => handleCurrencySelect(item.label)}
                                    >
                                        <div style={{ backgroundColor: item.color }} className="w-[3.658vw] h-[3.684vw] sm:w-[7.778vw] sm:h-[7.778vw] rounded-full flex justify-center items-center">
                                            <img src={item.image} alt={`${item.label} logo`} className="w-[1.842vw] sm:w-[4.444vw]" />
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[1.247vw] sm:text-[4.111vw] font-bold">{item.label}</span>
                                                <div className="flex space-x-[0.5vw]">
                                                    <button 
                                                        className="text-[0.8vw] sm:text-[2.5vw] bg-[#4AB094] text-white px-[0.8vw] py-[0.3vw] rounded-full hover:bg-[#3a9a7e] transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopyAddress(item.address);
                                                        }}
                                                    >
                                                        {copiedAddress === item.address ? 'Copied!' : 'Copy'}
                                                    </button>
                                                  
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                <span className="text-[0.937vw] sm:text-[3.267vw] font-medium text-gray-700">{item.network}</span>
                                                <span className="text-[0.937vw] sm:text-[3.267vw] font-medium text-gray-700 break-words">
                                                    {item.address.substring(0, 10)}...{item.address.substring(item.address.length - 10)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {selectedCurrency && (
                            <div className="mt-[2vw] p-[2vw] bg-white rounded-xl shadow-lg">
                                <h3 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1vw]">{selectedCurrency} Payment Instructions</h3>
                                <ol className="list-decimal pl-[2vw] space-y-[1vw]">
                                    <li className="text-[1vw] sm:text-[3vw]">Copy the {selectedCurrency} address above</li>
                                    <li className="text-[1vw] sm:text-[3vw]">Open your {selectedCurrency} wallet application</li>
                                    <li className="text-[1vw] sm:text-[3vw]">Initiate a transfer to the copied address</li>
                                    <li className="text-[1vw] sm:text-[3vw]">Enter the amount you wish to deposit</li>
                                    <li className="text-[1vw] sm:text-[3vw]">Confirm the transaction in your wallet</li>
                                    <li className="text-[1vw] sm:text-[3vw]">Wait for the network confirmations</li>
                                    <li className="text-[1vw] sm:text-[3vw]">Your balance will be updated automatically</li>
                                </ol>
                                <div className="mt-[2vw] p-[1vw] bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-[0.9vw] sm:text-[2.5vw] text-yellow-700">
                                        <strong>Important:</strong> Always double-check the address before confirming your transaction. 
                                        Cryptocurrency transactions cannot be reversed once confirmed on the blockchain.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                
                    <div className="w-[25vw] sm:w-full sm:mt-8 mt-[3.4vw]">
                        <div style={{ background: 'rgba(74, 176, 148, 0.2)' }} className="rounded-xl p-4 shadow-lg">
                            <div className="space-y-[0.5vw] mb-[2vw]">
                                <p className="text-[1.8vw] sm:text-[4.5vw] font-bold text-black">Transfer Information</p>
                            </div>
                            
                            <div className="space-y-[1.5vw]">
                                {transferLimits.map((item, index) => (
                                    <div key={index} className="flex flex-col space-y-[0.3vw]">
                                        <span className="text-[1.4vw] sm:text-[3.5vw] font-medium">{item.value}</span>
                                        <span className="text-[0.9vw] sm:text-[2.5vw] text-gray-600 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-[3vw] space-y-[1vw]">
                                <div className="flex items-center space-x-[1.2vw]">
                                    <img src={Balance} alt="Dollar" className="w-[3.726vw] sm:w-[9.844vw]" />
                                    <img src={Euro} alt="Euro" className="w-[3.226vw] sm:w-[8vw]" />
                                </div>
                                <div>
                                    <span className="text-[1.042vw] sm:text-[2.667vw] font-medium text-gray-700">Only for premium accounts</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Current Balance Card */}
                        <div className="mt-[2vw] sm:hidden rounded-xl p-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #4AB094 0%, #376D47 100%)' }}>
                            <div className="space-y-[1vw]">
                                <p className="text-[1.2vw] sm:text-[3.5vw] font-medium text-white opacity-80">Current Balance</p>
                                <p className="text-[2.2vw] sm:text-[5vw] font-bold text-white">${balance || '0.00'}</p>
                            </div>
                            
                            <div className="mt-[2vw] flex justify-between">
                                <button 
                                    onClick={() => navigate('/transfer')}
                                    className="text-[1vw] sm:text-[3vw] bg-white text-[#4AB094] px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Transfer
                                </button>
                                <button 
                                    onClick={() => navigate('/history')}
                                    className="text-[1vw] sm:text-[3vw] bg-transparent text-white border border-white px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-white/10 transition-colors"
                                >
                                    History
                                </button>
                            </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div className="mt-[2vw] rounded-xl p-4 shadow-lg bg-white">
                            <div className="space-y-[0.5vw] mb-[1.5vw]">
                                <p className="text-[1.5vw] sm:text-[4vw] font-bold text-black">Recent Activity</p>
                            </div>
                            
                            <div className="space-y-[0.3vw]">
                                {[1, 2].map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-[1vw] rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-[1vw]">
                                            <div className={`w-[2.5vw] h-[2.5vw] sm:w-[6vw] sm:h-[6vw] rounded-full flex justify-center items-center ${index % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <span className="text-[1vw] sm:text-[3vw] font-bold">{index % 2 === 0 ? '+' : 'D'}</span>
                                            </div>
                                            <div>
                                                <p className="text-[1vw] sm:text-[3vw] font-medium">{index % 2 === 0 ? 'Deposit' : 'Withdrawal'}</p>
                                                <p className="text-[0.8vw] sm:text-[2.5vw] text-gray-500">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className={`text-[1.2vw] sm:text-[3.5vw] font-bold ${index % 2 === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                                            {index % 2 === 0 ? '+' : '-'}${(Math.random() * 1000).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => navigate('/history')}
                                className="mt-[1.5vw] w-full text-[1vw] sm:text-[3vw] text-[#4AB094] font-medium hover:underline"
                            >
                                View All Transactions →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentComponent;
