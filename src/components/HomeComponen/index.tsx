
import { useState, useEffect } from "react";
import axios from 'axios';
import './styles.css';
import './swiper.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { AreaChart, Area, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useBalanceStore } from "../../store/balanceStore";
import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import EUR from "../../assets/icons/eur.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import USD from "../../assets/icons/usd.svg";
import { Header } from "../../components";
import useUserStore from '../../store/userStore';


const cardItems = [
    {
        title: "EUR",
        color: "#3CBEEF",
        image: EUR,
        lable: "euro",
        bg: "rgba(60, 190, 239, 0.2)",
        balance: "1000.00",
        procent: "-1.5%"
    },
    {
        title: "USDT",
        color: "#4AB094",
        image: USDT,
        lable: "trc20",
        bg: "rgba(74, 176, 148, 0.2)",
        balance: "4.00",
        procent: "+2.5%"
    },
    {
        title: "BTC",
        color: "#F28B49",
        image: BTC,
        lable: "btc",
        bg: "rgba(242, 139, 73, 0.2)",
        balance: "7.00",
        procent: "-2.5%"
    },
    {
        title: "ETH",
        color: "#6489A4",
        image: ETH,
        lable: "eth",
        bg: "rgba(100, 137, 164, 0.2)",
        balance: "300.00",
        procent: "+1.5%"
    },
    {
        title: "USD",
        color: "#77C46F",
        image: USD,
        lable: "usd",
        bg: "rgba(119, 196, 111, 0.2)",
        balance: "1000.00",
        procent: "+1.5%"
    },

    {
        title: "DASH",
        color: "#F3BA2F",
        image: USDTD,
        lable: "dash",
        bg: "rgba(243, 186, 47, 0.2)",
        balance: "1900.00",
        procent: "+1.5%"
    },
]
const generateMockData = (period: string) => {
    const now = new Date();
    const data = [];
    let baseBalance = 15000;

    if (period === 'month') {
        // Last 30 days data
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            baseBalance += Math.random() * 1000 - 500; // More realistic daily changes
            data.push({
                date: date.getDate().toString(),
                balance: Math.max(baseBalance, 10000)
            });
        }
    } else if (period === 'year') {
        // Last 12 months data
        for (let i = 12; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            baseBalance += Math.random() * 3000 - 1000; // More realistic monthly changes
            data.push({
                date: date.toLocaleString('default', { month: 'short' }),
                balance: Math.max(baseBalance, 10000)
            });
        }
    } else {
        // All time (3 years) data
        for (let i = 36; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            baseBalance += Math.random() * 5000 - 2000; // More realistic yearly changes
            data.push({
                date: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
                balance: Math.max(baseBalance, 10000)
            });
        }
    }
    return data;
};

interface MarketData {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d_in_currency: number;
    price_change_percentage_30d_in_currency: number;
    market_cap: number;
    image: string;
}

const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1000000000000) { // Trillions
        return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) { // Billions
        return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) { // Millions
        return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else if (marketCap >= 1000) { // Thousands
        return `$${(marketCap / 1000).toFixed(2)}K`;
    } else {
        return `$${marketCap.toFixed(2)}`;
    }
};

const getAssetPrice = (marketData: MarketData[], assetLabel: string, assetTitle: string): number => {
    const coin = marketData.find(coin =>
        coin.symbol.toLowerCase() === assetLabel.toLowerCase() ||
        coin.symbol.toLowerCase() === assetTitle.toLowerCase()
    );
    return coin?.current_price || 0;
};

const getCoinData = (marketData: MarketData[], assetLabel: string, assetTitle: string): MarketData | undefined => {
    return marketData.find(coin =>
        coin.symbol.toLowerCase() === assetLabel.toLowerCase() ||
        coin.symbol.toLowerCase() === assetTitle.toLowerCase()
    );
};

const HomeComponent = () => {
    const navigate = useNavigate();

    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year' | 'all'>('month');
    const [chartData, setChartData] = useState(generateMockData('month'));
    const [isChartVisible, setIsChartVisible] = useState(false);
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [timeRange, setTimeRange] = useState<'1h' | '24h' | '1w' | '1m'>('24h');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getChangePercentage = (coin: MarketData, range: '1h' | '24h' | '1w' | '1m') => {
        switch (range) {
            case '1h':
                return coin.price_change_percentage_1h_in_currency;
            case '24h':
                return coin.price_change_percentage_24h;
            case '1w':
                return coin.price_change_percentage_7d_in_currency;
            case '1m':
                return coin.price_change_percentage_30d_in_currency;
            default:
                return 0;
        }
    };

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/coins/markets',
                    {
                        params: {
                            vs_currency: 'usd',
                            ids: 'tether,bitcoin,ethereum,euro-coin,dash',
                            order: 'market_cap_desc',
                            per_page: 6,
                            page: 1,
                            sparkline: false,
                            price_change_percentage: '1h,24h,7d,30d'
                        }
                    }
                );
                setMarketData(response.data);
            } catch (error: any) {
                setError(error.response?.data?.error || 'Failed to fetch market data');
                console.error('Error fetching market data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Initial fetch
        fetchMarketData();

        // Update every 5 minutes to stay within rate limits
        const interval = setInterval(fetchMarketData, 300000); // 5 minutes in milliseconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsChartVisible(true);
    }, [])

    const { setBalance } = useBalanceStore.getState();

    const user = useUserStore((state) => state.user);
    const totalBalance: any = user?.balance
        ? Object.values(user.balance).reduce((acc: any, value: any) => acc + parseFloat(value || "0"), 0)
        : 0;

    useEffect(() => {
        setBalance(totalBalance.toString());
    }, [totalBalance]);
    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0 ">
            <div className="sm:hidden mb-[3vw]">
                <Header />
            </div>
            <div className=" hidden sm:flex flex-col  justify-between ls:space-x-[1.111vw] py-[5vw]">
                    <span className="text-[7.679vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
             </div>
            <div className="flex space-x-[3vw] sm:flex-col sm:space-x-0 sm:space-y-[5vw]">
                <div className="w-[70vw] sm:w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-4 sm:space-y-0">
                        <div className="space-y-2">
                            <p className="text-[#2e2e2e] text-[1.8vw] sm:text-[4vw] font-bold">Portfolio Balance</p>

                        </div>

                    </div>
                    <div style={{  background: 'rgba(55, 109, 71, 0.2)' }} className="rounded-xl p-2 shadow-lg transition-all duration-500 ease-in-out max-w-[60vw] sm:!h-[30vh] !h-[40vh] sm:!max-w-[100vw]">
                        <div className="space-y-[0.5vw] mb-[1vw]">
                            <p className="text-[2.1vw] m-0 pl-[0.5vw] sm:text-[5vw] font-bold text-black">
                                ${totalBalance.toLocaleString()}
                            </p>
                            <p className="text-[1.1vw] m-0 pl-[0.5vw] sm:text-[3vw] text-black">
                                Portfolio Balance
                            </p>
                        </div>
                        <div className={`w-full h-full transition-opacity  duration-300 ${isChartVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <ResponsiveContainer width="100%" height="60%">
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4AB094" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4AB094" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#999', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                                        labelFormatter={(label) => {
                                            const now = new Date();
                                            if (selectedPeriod === 'month') {
                                                // For monthly view, show as "May" instead of day number
                                                return `Month: ${now.toLocaleString('en', { month: 'long' })}`;
                                            } else if (selectedPeriod === 'year') {
                                                // For yearly view, show only the month name
                                                return `Month: ${label}`;
                                            } else {
                                                // For all-time view, the label already contains "Month Year" format
                                                // Extract just the year portion
                                                const parts = label.toString().split(' ');
                                                if (parts.length > 1) {
                                                    // If format is "Jan 2025", return "Year: 2025"
                                                    return `Year: ${parts[1]}`;
                                                } else {
                                                    // Fallback to current year if parsing fails
                                                    return `Year: ${now.getFullYear()}`;
                                                }
                                            }
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#4AB094"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorBalance)"
                                    />
                                </AreaChart>

                            </ResponsiveContainer>
                            <div className="flex justify-start space-x-[0.1vw] sm:space-x-[2vw]">
                                <button
                                    onClick={() => {
                                        setIsChartVisible(false);
                                        setTimeout(() => {
                                            setSelectedPeriod('month');
                                            setChartData(generateMockData('month'));
                                            setIsChartVisible(true);
                                        }, 300);
                                    }}
                                    className={`px-[0.5vw] py-[0.2vw] sm:px-[2vw] sm:py-[1vw] rounded-full text-sm sm:text-[3vw] font-medium transition-all duration-300 ${selectedPeriod === 'month'
                                        ? ' text-[#4AB094]'
                                        : ''
                                        }`}
                                >
                                    1M
                                </button>
                                <button
                                    onClick={() => {
                                        setIsChartVisible(false);
                                        setTimeout(() => {
                                            setSelectedPeriod('year');
                                            setChartData(generateMockData('year'));
                                            setIsChartVisible(true);
                                        }, 300);
                                    }}
                                    className={`px-[0.5vw] py-[0.2vw] sm:px-[2vw] sm:py-[1vw] rounded-full text-sm sm:text-[3vw] font-medium transition-all duration-300 ${selectedPeriod === 'year'
                                        ? ' text-[#4AB094] '
                                        : ''
                                        }`}
                                >
                                    1Y
                                </button>
                                <button
                                    onClick={() => {
                                        setIsChartVisible(false);
                                        setTimeout(() => {
                                            setSelectedPeriod('all');
                                            setChartData(generateMockData('all'));
                                            setIsChartVisible(true);
                                        }, 300);
                                    }}
                                    className={`px-[0.5vw] py-[0.2vw] sm:px-[2vw] sm:py-[1vw] rounded-full text-sm sm:text-[3vw] font-medium transition-all duration-300 ${selectedPeriod === 'all'
                                        ? ' text-[#4AB094] '
                                        : ''
                                        }`}
                                >
                                    All Time
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="w-[50vw] sm:w-full">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[#2e2e2e] text-[1.8vw] sm:text-[4vw] font-bold">
                            Your Assets
                        </p>
                        <div className="flex gap-2">
                            <button className="swiper-button-prev-custom w-[2vw] h-[2vw] sm:w-[6vw] sm:h-[6vw] flex items-center justify-center rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-50">
                                <svg width="0.8vw" height="0.8vw" className="sm:w-[2.5vw] sm:h-[2.5vw]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="swiper-button-next-custom w-[2vw] h-[2vw] sm:w-[6vw] sm:h-[6vw] flex items-center justify-center rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-50">
                                <svg width="0.8vw" height="0.8vw" className="sm:w-[2.5vw] sm:h-[2.5vw]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={3}
                        breakpoints={{
                            320: {
                                slidesPerView: 1.5,
                                spaceBetween: 10
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 16
                            }
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{ clickable: true }}
                        className="assets-swiper"
                        onSwiper={(swiper: any) => {
                            // Initialize Swiper
                            swiper.update();
                        }}
                    >
                        {cardItems.map((item) => (
                            <SwiperSlide key={item.title}>
                                <div
                                    className={`rounded-xl h-[19vw] sm:h-[45vw] w-[calc(100%-0.1vw)] sm:w-[47vw] p-[1vw] sm:p-[3vw] shadow-md `}
                                    style={{ borderLeft: `4px solid ${item.color}`, background: item.bg }}
                                >
                                    <div className="flex items-center justify-end mb-[1vw]">
                                        <span className="text-[0.8vw] sm:text-[2.5vw] px-[0.5vw] py-[0.2vw] sm:px-[1.5vw] sm:py-[0.8vw] rounded-full bg-gray-100">
                                            {item.lable}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-[0.5vw]">
                                            <p className="text-[1.8vw] sm:text-[4.5vw] font-bold text-gray-800">{item.balance}</p>
                                            <p className="text-[1.8vw] sm:text-[4.5vw] font-bold text-gray-800">{item.title}</p>
                                        </div>
                                        <p className="text-[1.4vw] sm:text-[3.5vw] text-gray-500">
                                            ${(parseFloat(item.balance) * getAssetPrice(marketData, item.lable, item.title)).toLocaleString()}
                                        </p>
                                    </div>
                                    <span onClick={() => navigate(`/payment`)} className="text-[0.996vw] sm:text-[2.8vw] underline mt-[1.1vw] text-end text-gray-500 cursor-pointer">View Address</span>
                                    <div className="flex items-center mt-[2vw] justify-start space-x-[0.5vw]">
                                        <img src={item.image} alt={item.title} className="w-[3vw] h-[3vw] sm:w-[7vw] sm:h-[7vw]" />
                                        {(() => {
                                            const coinData = getCoinData(marketData, item.lable, item.title);
                                            if (!coinData) return null;
                                            const change = coinData.price_change_percentage_24h;
                                            return (
                                                <span className={`text-[1.2vw] sm:text-[3.2vw] font-bold mt-[1.1vw] ${change >= 0 ? 'text-green-500' : 'text-red-500'} transition-all duration-300`}>
                                                    {change >= 0 ? '+' : ''}
                                                    {change.toFixed(2)}%
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
          <div className="flex !mt-[3vw] space-x-[2vw] sm:flex-col sm:space-x-0 sm:space-y-[5vw]">
          <div className="w-[calc(100%-30vw)] sm:w-full">
                <div className="flex items-center justify-between mb-[2vw]">
                    <p className="text-[#2e2e2e] text-[1.8vw] sm:text-[4vw] font-bold">Markets</p>
                    <div className="flex space-x-[1vw] sm:space-x-[2vw]">
                        {(['1h', '24h', '1w', '1m'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-[1vw] py-[0.5vw] sm:px-[2vw] sm:py-[1vw] rounded-full text-[0.8vw] sm:text-[2.5vw] font-medium transition-all duration-300 ${timeRange === range ? 'bg-[#4AB094] text-white' : 'bg-gray-100'}`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl shadow-md overflow-hidden relative min-h-[20vw] sm:min-h-[40vw]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-[#4AB094] border-t-transparent"></div>
                        </div>
                    )}
                    {error && (
                        <div className="absolute inset-0 bg-white flex items-center justify-center">
                            <div className="text-red-500 text-center">
                                <p className="text-[1vw] sm:text-[3vw] font-medium">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 text-[0.8vw] sm:text-[2.5vw] text-[#4AB094] underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw] text-gray-600">Name</th>
                                    <th className="text-right p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw] text-gray-600">Price</th>
                                    <th className="text-right p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw] text-gray-600">Change</th>
                                    <th className="text-right p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw] text-gray-600">Market Cap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marketData.map((coin) => (
                                    <tr
                                        key={coin.id}
                                        className="border-b transition-all duration-200 hover:bg-gray-50 cursor-pointer"

                                    >
                                        <td className="p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw]">
                                            <div className="flex items-center space-x-[0.5vw] sm:space-x-[1.5vw]">
                                                <img src={coin.image} alt={coin.name} className="w-[2vw] h-[2vw] sm:w-[5vw] sm:h-[5vw]" />
                                                <span className="font-medium hover:text-[#4AB094] transition-colors">{coin.name}</span>
                                                <span className="text-gray-500 text-[0.8vw] sm:text-[2.5vw]">{coin.symbol.toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="text-right p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw] font-medium">
                                            ${coin.current_price.toLocaleString()}
                                        </td>
                                        <td className="text-right p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw]">
                                            <span className={`${getChangePercentage(coin, timeRange) >= 0 ? 'text-green-500' : 'text-red-500'} transition-all duration-300 font-medium`}>
                                                {getChangePercentage(coin, timeRange) >= 0 ? '+' : ''}
                                                {getChangePercentage(coin, timeRange).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="text-right p-[1vw] sm:p-[2vw] text-[1vw] sm:text-[3vw]">
                                            {formatMarketCap(coin.market_cap)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                
            </div>
            </div>
            <div className="p-[2vw] sm:p-[4vw] w-[28vw] sm:w-full h-[calc(100%-0.5vw)] sm:h-[65vw] rounded-xl shadow-lg bg-[#2e2e2e] text-white relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-[15vw] h-[15vw] sm:w-[30vw] sm:h-[30vw] bg-[#4AB094] opacity-10 rounded-full transform translate-x-[7vw] translate-y-[-7vw] sm:translate-x-[15vw] sm:translate-y-[-15vw] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[10vw] h-[10vw] sm:w-[20vw] sm:h-[20vw] bg-[#F3BA2F] opacity-10 rounded-full transform translate-x-[-5vw] translate-y-[5vw] sm:translate-x-[-10vw] sm:translate-y-[10vw] animate-pulse"></div>
                
                <div className="relative z-10 h-[25.5vw] sm:h-[50vw] flex flex-col justify-between">
                    <div className="flex items-center gap-[0.5vw] sm:gap-[1.5vw] mb-[1vw] sm:mb-[3vw]">
                        <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] bg-[#F3BA2F] rounded-full animate-ping"></div>
                        <span className="text-[0.8vw] sm:text-[2.5vw] text-[#F3BA2F]">FEATURE UNAVAILABLE</span>
                    </div>
                    
                    <h3 className="text-[1.6vw] sm:text-[4.5vw] font-bold mb-[1vw] sm:mb-[3vw] leading-tight">
                        Exchange Coming Soon ⚡️
                    </h3>
                    
                    <div className="flex flex-col justify-center items-center h-full space-y-[3vw] sm:space-y-[6vw] py-[2vw] ">
                        <div className="flex items-center gap-[1.5vw] sm:gap-[3vw]">
                            <img src={BTC} alt="BTC" className="w-[3vw] h-[3vw] sm:w-[7vw] sm:h-[7vw] opacity-70" />
                            <svg className="w-[2.5vw] h-[2.5vw] sm:w-[6vw] sm:h-[6vw] text-[#4AB094]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                            </svg>
                            <img src={ETH} alt="ETH" className="w-[3vw] h-[3vw] sm:w-[7vw] sm:h-[7vw] opacity-70" />
                        </div>
                        
                        <div className="text-center space-y-[0.6vw] sm:space-y-[1.5vw]">
                            <p className="text-[1vw] sm:text-[3vw] text-gray-300"><span className="text-[#F3BA2F] font-medium">Note:</span> The exchange feature is currently unavailable.</p>
                            <p className="text-[0.8vw] sm:text-[2.5vw] text-gray-400">We're working hard to bring you this functionality soon.</p>
                        </div>
                        
                        <div className="flex items-center gap-[1vw] sm:gap-[2vw] bg-white/5 px-[2vw] py-[1vw] sm:px-[4vw] sm:py-[2vw] rounded-lg">
                            <svg className="w-[1.5vw] h-[1.5vw] sm:w-[4vw] sm:h-[4vw] text-[#F3BA2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <span className="text-[0.9vw] sm:text-[2.8vw]">Launching in </span>
                                <span className="text-[1.1vw] sm:text-[3.2vw] font-bold text-[#F3BA2F]">August  2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        
        </div>
    )
}

export default HomeComponent