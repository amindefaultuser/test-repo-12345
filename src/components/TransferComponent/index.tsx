import { Header } from "../../components";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useUserStore from '../../store/userStore';
import api from '../../api';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import EUR from "../../assets/icons/eur.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import USD from "../../assets/icons/usd.svg";
import { useBalanceStore } from "../../store/balanceStore";

interface TransferFormInputs {
    currency: string;
    fullName: string;
    wallet: string;
    network: string;
    amount: string;
    memo?: string;
    priority: 'standard' | 'express' | 'instant';
}

interface CurrencyCard {
    title: string;
    color: string;
    image: string;
    label: string;
    bg: string;
    rate: number;
    network: string;
    processingTime: string;
    fee: string;
}

interface TransferStep {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed';
    estimatedTime: string;
}

// Animation styles
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

  .currency-card {
    transition: all 0.3s ease;
  }

  .currency-card:hover {
    transform: translateY(-5px);
  }

  .currency-card.active {
    box-shadow: 0 0 0 2px #4AB094;
  }
`;

// Currency card data
const currencyCards: CurrencyCard[] = [
    {
        title: "USDT",
        color: "#4AB094",
        image: USDT,
        label: "trc20",
        bg: "rgba(74, 176, 148, 0.2)",
        rate: 1.00,
        network: "TRC20",
        processingTime: "10-30 minutes",
        fee: "1 USDT"
    },
    {
        title: "BTC",
        color: "#F28B49",
        image: BTC,
        label: "btc",
        bg: "rgba(242, 139, 73, 0.2)",
        rate: 65000.00,
        network: "BTC",
        processingTime: "30-60 minutes",
        fee: "0.0001 BTC"
    },
    {
        title: "ETH",
        color: "#6489A4",
        image: ETH,
        label: "eth",
        bg: "rgba(100, 137, 164, 0.2)",
        rate: 3500.00,
        network: "ETH",
        processingTime: "15-45 minutes",
        fee: "0.002 ETH"
    },
    {
        title: "USD",
        color: "#77C46F",
        image: USD,
        label: "usd",
        bg: "rgba(119, 196, 111, 0.2)",
        rate: 1.00,
        network: "SWIFT",
        processingTime: "1-3 business days",
        fee: "25 USD"
    },
    {
        title: "EUR",
        color: "#3CBEEF",
        image: EUR,
        label: "euro",
        bg: "rgba(60, 190, 239, 0.2)",
        rate: 1.08,
        network: "SEPA",
        processingTime: "1-2 business days",
        fee: "20 EUR"
    },
    {
        title: "DASH",
        color: "#F3BA2F",
        image: USDTD,
        label: "dash",
        bg: "rgba(243, 186, 47, 0.2)",
        rate: 32.50,
        network: "DASH",
        processingTime: "5-15 minutes",
        fee: "0.01 DASH"
    },
];

// Transfer limits for the information card
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
        value: "1-3 days",
        label: "Transfer term"
    }
];

// Transfer steps for the progress visualization
const transferSteps: TransferStep[] = [
    {
        id: 1,
        title: "Request Submitted",
        description: "Your transfer request has been submitted and is being processed",
        status: "pending",
        estimatedTime: "1-2 minutes"
    },
    {
        id: 2,
        title: "Verification",
        description: "Verifying transaction details and security checks",
        status: "pending",
        estimatedTime: "5-10 minutes"
    },
    {
        id: 3,
        title: "Processing",
        description: "Transaction is being processed by the network",
        status: "pending",
        estimatedTime: "15-30 minutes"
    },
    {
        id: 4,
        title: "Confirmation",
        description: "Waiting for network confirmations",
        status: "pending",
        estimatedTime: "Varies by network"
    },
    {
        id: 5,
        title: "Completed",
        description: "Transfer has been successfully completed",
        status: "pending",
        estimatedTime: ""
    }
];

// Priority options for transfer speed


const schema = yup.object().shape({
    currency: yup.string().required('Currency is required'),
    fullName: yup.string().required('Full name is required'),
    wallet: yup.string().required('Wallet address is required').min(10, 'Enter a valid wallet address'),
    network: yup.string().required('Network is required'),
    amount: yup.string().required('Amount is required')
        .test('is-number', 'Amount must be a valid number', value => !isNaN(Number(value)))
        .test('is-positive', 'Amount must be greater than 0', value => Number(value) > 0),
    memo: yup.string(),
    priority: yup.string().oneOf(['standard', 'express', 'instant'], 'Invalid priority').required('Priority is required')
});

const TransferComponent = () => {
    const navigate = useNavigate();
    // Form handling
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TransferFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            priority: 'standard'
        }
    });
    
    // Get user from store
    const user = useUserStore((state) => state.user);
    const { balance } = useBalanceStore();
    
    // Component state
    const [loading, setLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>("USDT");
    const [isLoading, setIsLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [conversionRate, setConversionRate] = useState<number | null>(null);
    const [showTransferProgress, setShowTransferProgress] = useState(false);
    const [currentTransferStep, setCurrentTransferStep] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [transferComplete, setTransferComplete] = useState(false);
    
    // Refs
    const amountInputRef = useRef<HTMLInputElement>(null);
    
    // Watch form values
    const watchAmount = watch('amount');
    
    // Add animation styles to document head
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
        // Simulate API loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        
        return () => {
            document.head.removeChild(styleElement);
            clearTimeout(timer);
        };
    }, []);
    
    // Calculate USD value when amount or currency changes
    useEffect(() => {
        if (selectedCurrency && watchAmount && !isNaN(Number(watchAmount))) {
            const selectedCard = currencyCards.find(card => card.title === selectedCurrency);
            if (selectedCard) {
                setConversionRate(selectedCard.rate);
            }
        } else {
            setConversionRate(null);
        }
    }, [watchAmount, selectedCurrency]);
    

    
    // Handle currency selection
    const handleCurrencySelect = (currency: string) => {
        setSelectedCurrency(currency);
        setValue('currency', currency);
        
        // Auto-fill network based on selected currency
        const selectedCard = currencyCards.find(card => card.title === currency);
        if (selectedCard) {
            setValue('network', selectedCard.network);
        }
        
        // Focus on amount input after selecting currency
        if (amountInputRef.current) {
            amountInputRef.current.focus();
        }
    };
    
    // Calculate estimated fee based on priority
      
    
    // Handle priority selection
 
    const onSubmit: SubmitHandler<TransferFormInputs> = async data => {
        if (!selectedCurrency) {
            setNotificationType('error');
            setNotificationMessage('Please select a currency');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }
        
        // Start the transfer process visualization
        setLoading(true);
        setShowTransferProgress(true);
        setCurrentTransferStep(1);
        
        // Enhanced message with additional fields
        const message = `
        Currency: ${data.currency}
        Full Name: ${data.fullName}
        Wallet: ${data.wallet}
        Network: ${data.network}
        Amount: ${data.amount}
        Priority: ${data.priority || 'Standard'}
        ${data.memo ? `Memo: ${data.memo}` : ''}
        USD Value: $${conversionRate && !isNaN(Number(data.amount)) ? (Number(data.amount) * conversionRate).toFixed(2) : '0.00'}
        `;
        
        const formData = {
            email: user.email,
            message,
            userId: user.account_id.toString(),
            subject: `Transfer - ${data.currency}`
        };

        try {
            // Simulate verification step
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentTransferStep(2);
                    resolve(null);
                }, 2000);
            });
            
            // Simulate processing step
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentTransferStep(3);
                    resolve(null);
                }, 3000);
            });
            
            // Send the actual request
            const response = await api.post('/send-mail', formData);
            console.log('Mail sent successfully:', response.data);
            
            // Simulate confirmation step
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentTransferStep(4);
                    resolve(null);
                }, 2000);
            });
            
            // Simulate completion step
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentTransferStep(5);
                    setTransferComplete(true);
                    resolve(null);
                }, 1500);
            });
            
            // Show success notification
            setNotificationType('success');
            setNotificationMessage('Transfer request submitted successfully!');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            
            // Reset form after a delay to allow the user to see the completion
            setTimeout(() => {
                reset();
                setSelectedCurrency(null);
                setShowTransferProgress(false);
                setCurrentTransferStep(0);
                setTransferComplete(false);
            }, 5000);
            
        } catch (error) {
            console.error('Error sending mail:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to submit transfer request. Please try again.');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            setShowTransferProgress(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0 ">
            {/* Notification */}
            {showNotification && (
                <div className={`fixed top-[5vw] right-[5vw] py-[1vw] px-[2vw] rounded-lg shadow-lg z-50 animate-fade-in-out ${notificationType === 'success' ? 'bg-[#4AB094]' : 'bg-[rgba(235,87,87,0.9)]'}`}>
                    <p className="text-[1vw] sm:text-[3vw] text-white">{notificationMessage}</p>
                </div>
            )}
            
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
             <div className="mt-[2vw] hidden sm:block  rounded-xl !mb-[8vw] p-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #4AB094 0%, #376D47 100%)' }}>
                            <div className="space-y-[1vw]">
                                <p className="text-[1.2vw] sm:text-[3.5vw] font-medium text-white opacity-80">Current Balance</p>
                                <p className="text-[2.2vw] sm:text-[5vw] font-bold text-white">${balance || '0.00'}</p>
                            </div>
                            
                            {showTransferProgress && (
                                <div className="mt-[2vw] space-y-[1vw]">
                                    <p className="text-[1vw] sm:text-[3vw] text-white">Transfer Progress</p>
                                    <div className="h-[0.6vw] sm:h-[1.5vw] bg-white bg-opacity-20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white rounded-full" 
                                            style={{ width: `${(currentTransferStep / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="mt-[2vw] flex justify-between">
                                <button 
                                    onClick={() => navigate('/payment')}
                                    className="text-[1vw] sm:text-[3vw] bg-white text-[#4AB094] px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Deposit
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
                    <div className="w-[70vw] sm:w-full space-y-[1vw]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-4 sm:space-y-0">            
                            <div className="flex space-x-[1vw] sm:space-x-[2vw]">
                                {['All', 'USDT', 'BTC', 'ETH', 'DASH', 'EUR'].map((tab, index) => (
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
                                    Select Currency
                                </p>
                                <p className="text-[1.1vw] m-0 pl-[0.5vw] sm:text-[2.5vw] text-black">
                                    Choose a currency to transfer funds
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mt-4 sm:grid-cols-2">
                                {currencyCards
                                    .filter(card => activeTab === 0 || card.title === ['All', 'USDT', 'BTC', 'ETH', 'DASH', 'EUR'][activeTab])
                                    /**
 * Renders a currency card with details for each currency.
 * 
 * @param {CurrencyCard} card - The currency card data containing title, color, image, label, etc.
 * @param {number} index - The index of the current card in the map iteration.
 * @returns {JSX.Element} A styled div element representing a currency card.
 */
                                    .map((card, index) => (
                                    <div 
                                        key={index} 
                                        className={`currency-card p-3 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${selectedCurrency === card.title ? 'active' : ''}`}
                                        style={{ backgroundColor: card.bg }}
                                        onClick={() => handleCurrencySelect(card.title)}
                                    >
                                        <div className="flex items-center space-x-[1vw]">
                                            <div style={{ backgroundColor: card.color }} className="w-[3.658vw] h-[3.684vw] sm:w-[7.778vw] sm:h-[7.778vw] rounded-full flex justify-center items-center">
                                                <img src={card.image} alt={`${card.title} logo`} className="w-[1.842vw] sm:w-[4.444vw]" />
                                            </div>
                                            <div>
                                                <p className="text-[1.247vw] m-0 sm:text-[4.111vw] font-bold">{card.title}</p>
                                                <p className="text-[0.937vw]  m-0 sm:text-[3.267vw] text-gray-600">{card.label}</p>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                  
                        {selectedCurrency && (
                            <div className="mt-[2vw] p-[2vw] bg-white rounded-xl shadow-lg">
                                <h3 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1vw]">Transfer Details</h3>
                                
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-[1.5vw]">
                                    {/* Hidden currency field */}
                                    <input type="hidden" {...register('currency')} />
                                    
                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            {...register('fullName')} 
                                            className="w-full py-[0.8vw] px-[1vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.fullName.message}</p>}
                                    </div>

                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Wallet Address
                                        </label>
                                        <input 
                                            type="text" 
                                            {...register('wallet')} 
                                            className="w-full py-[0.8vw] px-[1vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                            placeholder="Enter wallet address"
                                        />
                                        {errors.wallet && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.wallet.message}</p>}
                                    </div>

                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Network
                                        </label>
                                        <input 
                                            type="text" 
                                            {...register('network')} 
                                            className="w-full py-[0.8vw] px-[1vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                            placeholder="Network type"
                                            readOnly={!!selectedCurrency}
                                        />
                                        {errors.network && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.network.message}</p>}
                                    </div>

                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                {...register('amount')} 
                                                ref={amountInputRef}
                                                className="w-full py-[0.8vw] px-[1vw] pr-[3vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                                placeholder="Enter amount"
                                            />
                                            {selectedCurrency && (
                                                <div className="absolute right-[1vw] top-1/2 transform -translate-y-1/2 text-[0.9vw] sm:text-[2.5vw] text-[#4AB094] font-medium">
                                                    {selectedCurrency}
                                                </div>
                                            )}
                                        </div>
                                        {errors.amount && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.amount.message}</p>}
                                        {conversionRate && watchAmount && !isNaN(Number(watchAmount)) && (
                                            <p className="text-[0.8vw] sm:text-[2.5vw] text-[#4AB094] font-medium">
                                                ≈ ${(Number(watchAmount) * conversionRate).toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>
                                    
                              
                                    
                                    

                                    <div className="pt-[1.5vw]">
                                        <button 
                                            type="submit" 
                                            className="w-full py-[0.8vw] sm:py-[2.5vw] bg-[#4AB094] text-white rounded-lg font-medium hover:bg-[#3a9a7e] transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center space-x-[0.8vw]">
                                                    <div className="animate-spin rounded-full h-[1.2vw] w-[1.2vw] border-2 border-white border-t-transparent"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : 'Submit Transfer'}
                                        </button>
                                    </div>
                                </form>
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
                            
                            
                        </div>
                        
                        {/* Current Balance Card */}
                        <div className="mt-[2vw] sm:hidden rounded-xl p-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #4AB094 0%, #376D47 100%)' }}>
                            <div className="space-y-[1vw]">
                                <p className="text-[1.2vw] sm:text-[3.5vw] font-medium text-white opacity-80">Current Balance</p>
                                <p className="text-[2.2vw] sm:text-[5vw] font-bold text-white">${balance || '0.00'}</p>
                            </div>
                            
                            {showTransferProgress && (
                                <div className="mt-[2vw] space-y-[1vw]">
                                    <p className="text-[1vw] sm:text-[3vw] text-white">Transfer Progress</p>
                                    <div className="h-[0.6vw] sm:h-[1.5vw] bg-white bg-opacity-20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white rounded-full" 
                                            style={{ width: `${(currentTransferStep / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="mt-[2vw] flex justify-between">
                                <button 
                                    onClick={() => navigate('/payment')}
                                    className="text-[1vw] sm:text-[3vw] bg-white text-[#4AB094] px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Deposit
                                </button>
                                <button 
                                    onClick={() => navigate('/history')}
                                    className="text-[1vw] sm:text-[3vw] bg-transparent text-white border border-white px-[1.5vw] py-[0.7vw] rounded-full font-medium hover:bg-white/10 transition-colors"
                                >
                                    History
                                </button>
                            </div>
                        </div>
                        
                        {/* Security Tips */}
                        <div className="mt-[2vw] rounded-xl p-4 shadow-lg bg-white">
                            <div className="space-y-[0.5vw] mb-[1.5vw]">
                                <p className="text-[1.5vw] sm:text-[4vw] font-bold text-black">Security Tips</p>
                            </div>
                            
                            <ul className="space-y-[1vw]">
                                {[
                                    'Always verify recipient details before transfer',
                                    'Never share your account credentials',
                                    'Contact support if you notice suspicious activity'
                                ].map((tip, index) => (
                                    <li key={index} className="flex items-start space-x-[1vw] p-[0.8vw] rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-[1.8vw] h-[1.8vw] sm:w-[4vw] sm:h-[4vw] rounded-full bg-[rgba(74,176,148,0.1)] flex-shrink-0 flex items-center justify-center text-[#4AB094]">
                                            <span className="text-[0.9vw] sm:text-[2.5vw] font-bold">{index + 1}</span>
                                        </div>
                                        <span className="text-[0.9vw] sm:text-[2.8vw] text-gray-700">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Transfer Steps Visualization */}
                        {showTransferProgress && (
                            <div className="mt-[2vw] rounded-xl p-4 shadow-lg bg-white">
                                <div className="space-y-[0.5vw] mb-[1.5vw]">
                                    <p className="text-[1.5vw] sm:text-[4vw] font-bold text-black">Transfer Status</p>
                                </div>
                                
                                <div className="space-y-[1.5vw]">
                                    {transferSteps.map((step, index) => {
                                        const isActive = currentTransferStep >= step.id;
                                        const isCompleted = currentTransferStep > step.id;
                                        return (
                                            <div key={index} className={`p-[1vw] rounded-lg border ${isActive ? 'border-[#4AB094] bg-[rgba(74,176,148,0.05)]' : 'border-gray-200 opacity-60'}`}>
                                                <div className="flex items-start space-x-[1vw]">
                                                    <div className={`w-[2vw] h-[2vw] sm:w-[4vw] sm:h-[4vw] rounded-full flex items-center justify-center ${isActive ? 'bg-[#4AB094] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                        {isCompleted ? (
                                                            <svg className="w-[1vw] h-[1vw] sm:w-[2.5vw] sm:h-[2.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-[0.9vw] sm:text-[2.5vw] font-bold">{step.id}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-[1vw] sm:text-[3vw] font-bold ${isActive ? 'text-[#4AB094]' : 'text-gray-500'}`}>
                                                            {step.title}
                                                        </p>
                                                        <p className="text-[0.8vw] sm:text-[2.5vw] text-gray-600">{step.description}</p>
                                                        {isActive && !isCompleted && (
                                                            <div className="mt-[0.8vw] flex items-center space-x-[0.5vw]">
                                                                <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full bg-[#4AB094] animate-pulse"></div>
                                                                <span className="text-[0.8vw] sm:text-[2.5vw] text-[#4AB094] font-medium">In progress...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {transferComplete && (
                                    <div className="mt-[2vw] p-[1.5vw] rounded-lg bg-[rgba(74,176,148,0.1)] border border-[#4AB094]">
                                        <p className="text-[1vw] sm:text-[3vw] text-[#4AB094] font-medium flex items-center">
                                            <svg className="w-[1.5vw] h-[1.5vw] sm:w-[3.5vw] sm:h-[3.5vw] mr-[0.8vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Transfer request completed successfully!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransferComponent;