import { useState } from "react";
import Support from "../../assets/icons/support.svg";
import Document from "../../assets/icons/document.svg";
import Profile from "../../assets/icons/profile-user.svg";
import BellNotifications from "../../assets/image/bellNotifications.png";
import { useNavigate } from "react-router-dom";
import Balance from "../../assets/icons/balance.svg";
import  useUserStore  from "../../store/userStore";
import Bell from "../../assets/icons/bell.svg";

interface Props {
    titlePage: string
}

const MobileNavigation = ({titlePage}: Props) => {
    const navigate = useNavigate();
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

    const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
    const user = useUserStore((state) => state.user);
    const totalBalance: any = user?.balance
    ? Object.values(user.balance).reduce((acc: any, value: any) => acc + parseFloat(value || "0"), 0)
    : 0;
    return (
        <div className="flex justify-between">
             <div className="space-y-[6vw]  line-clamp-3 truncate">
                <div className="flex items-center pl-[3vw] !min-w-[39vw] py-[2vw] space-x-[1.6vw] bg-white rounded-[2.953vw]">
                    <img src={Balance} alt="Balance" className="w-[12.895vw] " />
                    <span className="text-[5.579vw] font-medium uppercase text-[#77C46F]">{totalBalance}</span>
                </div>
                <div>
               <h1 className="text-[7.105vw] font-bold uppercase tracking-widest w-[40vw]  !truncate">{titlePage}</h1>
               <div className="w-full h-[0.658vw] bg-black"></div>
               </div>
            </div>
                <div className="bg-white  rounded-[2.953vw] flex flex-wrap  justify-center items-center  w-[31.111vw] p-2">
                    <div className="grid grid-cols-2 gap-[4.444vw]">
                        <button
                            onClick={() => navigate("/support")}
                            className="w-[8.889vw] flex items-center justify-center">
                            <img src={Support} alt="Support" className="w-[8.889vw]" />
                        </button>
                        <button
                            onClick={() => navigate("/refferals")}
                            className="w-[8.889vw] flex items-center justify-center">
                            <img src={Profile} alt="Profile" className="w-[8.889vw]" />
                        </button>
                        <button
                            onClick={() => navigate("/profile")}
                            className="w-[8.889vw] flex items-center justify-center">
                            <img src={Document} alt="Document" className="w-[8.889vw]" />
                        </button>
                        <div>
                            <button
                                onClick={toggleNotification}
                                className="w-[8.889vw] flex items-center justify-center">
                                <img src={Bell} alt="Bell" className="w-[8.889vw]" />
                            </button>
                            {isNotificationOpen && (
                                <div className="absolute  z-[99999] right-[40px] mt-[0.625vw] w-[25.75vw]  h-[25.5vw] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center">
                                    <div className="flex flex-col items-center justify-center space-y-[0.625vw]">
                                        <img src={BellNotifications} alt="Bell" className="w-[8.841vw]  " />
                                        <p className="text-[1.75vw] font-bold text-[#056661] leading-tight">
                                            You have no notifications
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default MobileNavigation;