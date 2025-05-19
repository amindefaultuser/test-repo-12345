import { useState } from "react";
import { Header } from "../../components";
import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import EUR from "../../assets/icons/eur.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import USD from "../../assets/icons/usd.svg";
import Pending from "../../assets/icons/expectation.svg";
import Success from "../../assets/icons/gal1.svg";
import Error from "../../assets/icons/kr.svg";
import Insurance from "../../assets/icons/insurance.svg";
import Declaration from "../../assets/icons/declaration.svg";
import Tax from "../../assets/icons/Tax.svg";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useBalanceStore } from "../../store/balanceStore";
// Add animation styles for consistency with other components
const animationStyles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
  .transaction-row {
    transition: all 0.3s ease;
  }
  
  .transaction-row:hover {
    transform: translateY(-2px);
  }
  
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 0 0 rgba(74, 176, 148, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(74, 176, 148, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 176, 148, 0); }
  }
  
  .pulse-animation {
    animation: pulse-glow 2s infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .shimmer-effect {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;

interface Transaction {
    _id: string;
    date: string;
    sum: number;
    country?: string;
    ps: string;
    transaction_id: string;
    status: "success" | "pending" | "error";
}

const colors: Record<string, string> = {
    "TRC-20": "#4AB094",
    "ETH": "#6489A4",
    "USDTD": "#F3BA2F",
    "BTC": "#F28B49",
    "EUR": "#3CBEEF",
    "USD": "#77C46F"
};

const imageSources: Record<string, string> = {
    "TRC-20": USDT,
    "ETH": ETH,
    "USDTD": USDTD,
    "BTC": BTC,
    "EUR": EUR,
    "USD": USD
};

const statusIcons: Record<string, string> = {
    "completed": Success,
    "pending": Pending,
    "failed": Error,
    "insurance": Insurance,
    "declaration": Declaration,
    "tax": Tax
};

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const normalizePaymentSystem = (ps: string): string => {
    const map: Record<string, string> = {
        "trc20": "TRC-20",
        "usdt": "USDT",
        "usdt-d": "USDTD",
        "eth": "ETH",
        "btc": "BTC",
        "eur": "EUR",
        "usd": "USD"
    };
    return map[ps.toLowerCase()] || ps.toUpperCase();
};


const HistoryComponent = () => {
    const user = useUserStore((state) => state.user);
    const transactions: Transaction[] = user?.transactions || [];
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
        const { balance } = useBalanceStore();
 console.log(isLoading)
    
    // Apply animation styles
    useState(() => {
        // Add styles to head
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
        // Simulate loading state
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    });

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === transactions.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(transactions.map((item) => item._id)));
        }
    };

    const deleteSelected = () => {
        console.log("Deleting transactions:", Array.from(selectedIds));
        setSelectedIds(new Set());
    };


    return (
<div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0">          
          <div className="sm:hidden mb-[3vw]">
              <Header />
          </div>
          
          {
              user?.blocked && (
                  <div className="flex items-center justify-between ls:space-x-[1.111vw] sm:block hidden">
                      <span className="text-[1.179vw] sm:text-[0.7vw] ls:!text-[3.844vw] text-red-500 font-bold uppercase">Your account has been blocked, please contact support</span>
                  </div>
              )
          }
             <div className=" hidden sm:flex flex-col  justify-between ls:space-x-[1.111vw] py-[5vw]">
                    <span className="text-[7.679vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
             </div>

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

          

    

            <div className="mt-[2vw] sm:flex-col space-y-[2vw]">
                <div style={{ maxWidth: '100%', background: 'rgba(74, 176, 148, 0.1)' }} className="rounded-xl p-4 shadow-lg transition-all duration-500 ease-in-out">
                    <div className="flex justify-between items-center mb-[2vw]">
                        <p className="text-[1.5vw] sm:text-[3.5vw] font-bold text-[#2e2e2e]">Transaction Details</p>
                        <div className="flex space-x-[1vw]">
                            <button 
                                onClick={toggleSelectAll}
                                className="px-[1vw] py-[0.5vw] rounded-full text-[0.8vw] sm:text-[2.5vw] font-medium transition-all duration-300 bg-[#4AB094] text-white hover:bg-[#3a9a7e]"
                            >
                                {selectedIds.size === transactions.length && transactions.length > 0 ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full mx-auto px-[1vw]">
                        <div className="grid grid-cols-[1.083vw_repeat(5,_7fr)_6vw] flex items-center justify-center sm:grid-cols-[repeat(6,_1fr)] sm:px-[3vw] bg-white text-gray-700 font-semibold py-[1vw] px-[1.5vw] rounded-t-lg shadow-sm">
                            <input
                                type="checkbox"
                                checked={selectedIds.size === transactions.length && transactions.length > 0}
                                onChange={toggleSelectAll}
                                className="w-[1vw] h-[1vw] sm:hidden accent-[#4AB094]"
                            />
                            <div className="text-[1vw] sm:text-[2.9vw] font-bold flex items-center justify-center sm:justify-center text-[#2e2e2e]">Date</div>
                            <div className="text-[1vw] sm:text-[2.9vw] font-bold flex items-center justify-center sm:justify-center text-[#2e2e2e]">Sum</div>
                            <div className="text-[1vw] sm:text-[2.9vw] font-bold flex items-center justify-center sm:justify-center text-[#2e2e2e]">Country</div>
                            <div className="text-[1vw] sm:text-[2.9vw] font-bold flex items-center justify-center sm:justify-center text-[#2e2e2e]"><span>PS</span></div>
                            <div className="text-[1vw] sm:text-[2.9vw] font-bold flex items-center justify-center sm:justify-center text-[#2e2e2e]"><span>ID</span></div>
                            <div className="text-[1vw] sm:text-[2.9vw] font-bold flex items-center justify-center sm:justify-center text-[#2e2e2e]">STATUS</div>
                        </div>
                        <div className="flex flex-col bg-white rounded-b-lg min-h-[23vw] sm:min-h-[93vw] shadow-md overflow-hidden">
                            {!user ? (
                                <div className="flex justify-center h-full items-center">
                                    <div className="animate-spin rounded-full h-[5vw] w-[5vw] border-t-2 border-b-2 border-[#4AB094]"></div>
                                </div>
                            ) : (
                                <>
                                    {transactions.length > 0 ? (
                                        transactions.map((item) => {
                                            const normalizedPS = normalizePaymentSystem(item.ps);
                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`grid grid-cols-[1.083vw_repeat(5,_7fr)_6vw] sm:grid-cols-[repeat(6,_1fr)] py-[1vw] sm:py-[2vw] px-[1.5vw] items-center cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b transaction-row ${selectedIds.has(item._id) ? "bg-[rgba(74,176,148,0.1)]" : ""}`}
                                                    onClick={() => {
                                                        if (window.innerWidth < 640) toggleSelection(item._id);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(item._id)}
                                                        onChange={() => {
                                                            if (window.innerWidth >= 640) toggleSelection(item._id);
                                                        }}
                                                        className="w-[1vw] h-[1vw] sm:hidden accent-[#4AB094]"
                                                    />
                                                    <div className="sm:text-[2.5vw] text-[1vw] flex items-center justify-center font-medium">{formatDate(item.date)}</div>
                                                    <div className="sm:text-[2.5vw] text-[1vw] flex items-center justify-center font-bold">${parseFloat(item.sum.toString()).toLocaleString()}</div>
                                                    <div className="sm:text-[2.5vw] text-[1vw] flex items-center justify-center">{item.country || "-"}</div>
                                                    <div className="sm:text-[2.5vw] flex items-center justify-center">
                                                        <div
                                                            className="flex items-center justify-center rounded-full sm:w-[6vw] sm:h-[6vw] w-[2.5vw] h-[2.5vw] transition-transform hover:scale-110"
                                                            style={{ backgroundColor: colors[normalizedPS] || "#ccc" }}
                                                        >
                                                            {imageSources[normalizedPS] ? (
                                                                <img src={imageSources[normalizedPS]} alt={normalizedPS} className="w-[1.5vw] sm:w-[3vw]" />
                                                            ) : (
                                                                <span>{normalizedPS}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="sm:text-[2.5vw] flex items-center justify-center text-[0.8vw] font-medium text-gray-600">{item.transaction_id}</div>
                                                    <div className="sm:text-[2.5vw] flex items-center justify-center text-[1vw]">
                                                        {statusIcons[item.status] ? (
                                                            <img src={statusIcons[item.status]} alt={item.status} className="w-[2vw] sm:w-[6vw]" />
                                                        ) : (
                                                            <span className={`px-[0.8vw] py-[0.3vw] rounded-full text-white ${item.status === "success" ? "bg-[#4AB094]" : item.status === "pending" ? "bg-[#F3BA2F]" : "bg-[#F28B49]"}`}>
                                                                {item.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col justify-center items-center py-[5vw] space-y-[1vw]">
                                            <div className="w-[5vw] h-[5vw] sm:w-[15vw] sm:h-[15vw] rounded-full bg-[rgba(74,176,148,0.1)] flex items-center justify-center">
                                                <svg className="w-[2.5vw] h-[2.5vw] sm:w-[7.5vw] sm:h-[7.5vw] text-[#4AB094]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-[1.2vw] sm:text-[4vw] text-gray-600">You don't have any transactions</p>
                                            <p className="text-[0.9vw] sm:text-[3vw] text-gray-500">Your transaction history will appear here</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>


                    <div className="flex justify-center items-center mt-[2vw] sm:hidden">
                        <button
                            onClick={deleteSelected}
                            disabled={selectedIds.size === 0}
                            className="px-[3.737vw] py-[0.8vw] bg-[#4AB094] font-medium text-[0.937vw] text-white rounded-full transition-all duration-300 hover:bg-[#3a9a7e] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md"
                        >
                            {selectedIds.size > 0 ? `Delete Selected (${selectedIds.size})` : 'Delete'}
                        </button>
                    </div>
                </div>
                <div className="hidden sm:flex justify-center items-center mt-[4vw]">
                    <button
                        onClick={deleteSelected}
                        disabled={selectedIds.size === 0}
                        className="px-[15.737vw] py-[2vw] bg-[#4AB094] text-[4vw] text-white rounded-full transition-all duration-300 hover:bg-[#3a9a7e] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md"
                    >
                        {selectedIds.size > 0 ? `Delete Selected (${selectedIds.size})` : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryComponent;
