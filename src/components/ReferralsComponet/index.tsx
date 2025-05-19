import { Header } from "../../components";
import useUserStore from '../../store/userStore';
import { useEffect } from 'react';

const ReferralPage = () => {
    const user = useUserStore((state) => state.user);
    
    // Mock referral data
    const referralsCount = 0;
    
    // Animation styles
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[2vw] sm:space-y-[4vw] ">
            <div className="sm:hidden">
                <Header />
            </div>
            <div className=" hidden sm:flex flex-col  justify-between ls:space-x-[1.111vw] py-[5vw]">
                    <span className="text-[7.679vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
             </div>
         
            
            {user?.blocked && (
                <div className="flex items-center justify-between ls:space-x-[1.111vw] mb-[2vw]">
                    <span className="text-[1.179vw] sm:text-[3.844vw] text-red-500 font-bold">Your account has been blocked, please contact support</span>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-sm p-[2vw]">
                <h2 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[2vw] text-[#2e2e2e]">Referral History</h2>
                
                {referralsCount > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-[1vw] py-[1vw] text-left text-[1vw] sm:text-[3vw] font-medium text-gray-500">User</th>
                                    <th className="px-[1vw] py-[1vw] text-left text-[1vw] sm:text-[3vw] font-medium text-gray-500">Date</th>
                                    <th className="px-[1vw] py-[1vw] text-left text-[1vw] sm:text-[3vw] font-medium text-gray-500">Status</th>
                                    <th className="px-[1vw] py-[1vw] text-left text-[1vw] sm:text-[3vw] font-medium text-gray-500">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* No referrals yet, so this will be empty */}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-[5vw]">
                        <div className="w-[8vw] h-[8vw] sm:w-[20vw] sm:h-[20vw] mx-auto bg-[rgba(74,176,148,0.1)] rounded-full flex items-center justify-center mb-[2vw]">
                            <svg className="w-[4vw] h-[4vw] sm:w-[10vw] sm:h-[10vw] text-[#4AB094]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1vw]">No Referrals Yet</h3>
                        <p className="text-[1vw] sm:text-[3vw] text-gray-600 max-w-[40vw] mx-auto">
                            Share your referral link with friends and family to start earning rewards.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReferralPage