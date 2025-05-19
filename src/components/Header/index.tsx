import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDown from "../../assets/icons/arrow-down.svg";
import Support from "../../assets/icons/support.svg";
import Notification from "../../assets/icons/notifications.svg";
import Progile from "../../assets/icons/profile-user.svg";
import Bell from "../../assets/image/bellNotifications.png";
import Logo from "../../assets/plug/logo.png"
import useUserStore from "../../store/userStore";
import { useLocation } from "react-router-dom";



const profileItem = [
    { href: "/profile", title: "Profile" },
    { href: "/refferals", title: "Refferals" },
    { href: "/log-out", title: "Log Out" },
];

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = useUserStore((state) => state.user);
    const [balance, setBalance] = useState<string>("0000");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };
    console.log(balance)
    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false);
        }
        if (
            notificationRef.current &&
            !notificationRef.current.contains(event.target as Node)
        ) {
            setIsNotificationOpen(false);
        }
    };

    const totalBalance: any = user?.balance
    ? Object.values(user.balance).reduce((acc: any, value: any) => acc + parseFloat(value || "0"), 0)
    : 0;

    useEffect(() => {
        setBalance(totalBalance.toString());
    }, [totalBalance]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="sm:bg-white  ">
            <div className="flex justify-between ">
                <div className="flex flex-col justify-between ls:space-x-[1.111vw] sm:hidden">
                    <span className="text-[2.679vw] ls:!text-[3.844vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[10vw] h-[0.2vw] bg-[#4AB094] mt-[0.5vw]"></div>
                </div>
                {
                    user?.blocked && (
                        <div className="flex items-center justify-between ls:space-x-[1.111vw] sm:hidden">
                            <span className="text-[1.179vw] ls:!text-[3.844vw] text-red-500  font-bold uppercase text-[#77C46F]">Your account has been blocked, please contact support</span>
                        </div>
                    )
                }
                <div className="flex items-center space-x-[2.25vw] sm:w-full">
                <div>
                    <a href="/support">
                        <img src={Support} alt="Support" className="w-[2.141vw] ls:w-[3.63vw] sm:hidden " />
                    </a>
                </div>
                <div className="relative sm:hidden " ref={notificationRef}>
                    <button
                        className="bg-transparent border-none flex items-center"
                        onClick={toggleNotification}
                    >
                        <img src={Notification} alt="Notification" className="w-[2.141vw] ls:w-[3.63vw] " />
                    </button>
                    {isNotificationOpen && (
                        <div className="absolute  z-[99999] right-[0] mt-[0.625vw] w-[13.75vw] ls:w-[18.75vw] h-[12.5vw]  ls:h-[16.5vw] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center justify-center space-y-[0.625vw]">
                                <img src={Bell} alt="Bell" className="w-[4.841vw] ls:w-[6.63vw] " />
                                <p className="text-[0.75vw] ls:text-[1.172vw] font-bold text-[#056661] leading-tight">
                                    You have no notifications
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative sm:hidden flex items-center  space-x-[0.513vw] ls:space-x-[0.513vw]" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="bg-transparent border-none focus:outline-none flex items-center space-x-[0.313vw] ls:space-x-[0.513vw]"
                    >
                        <img src={Progile} alt="Profile" className="w-[2.441vw] ls:w-[3.63vw] " />
                        <div className="flex flex-col items-center justify-start">
                            <span className=" w-full text-[0.894vw] ls:text-[1.572vw] font-bold flex justify-start leading-tight">
                                accountID:
                            </span>
                            <span className="text-[0.75vw] ls:text-[1.275vw] font-bold leading-tight  flex items-center">
                                {user?.account_id}
                                <img src={ArrowDown} alt="ArrowDown" className="w-[1.05vw] ls:w-[1.672vw] " />
                            </span>
                        </div>

                    </button>


                    {isDropdownOpen && (
                        <div className="absolute !z-9999 right-[-0.938vw] top-[3.5vw] w-[7.5vw] ls:w-[9.5vw] bg-white border border-gray-200 rounded-lg shadow-lg">
                            {profileItem.map((item, index) =>
                                item.title === "Log Out" ? (
                                    <button
                                        key={index}
                                        onClick={() => logout()}
                                        className="text-[0.875vw] ls:text-[1.172vw] w-full font-medium  items-center justify-center py-2 hover:bg-gray-100"
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="block flex no-underline text-[0.875vw] ls:text-[1.172vw] text-[#000000] font-medium items-center justify-center py-2 hover:bg-gray-100"
                                    >
                                        {item.title}
                                    </a>
                                )
                            )}
                        </div>
                    )}
                </div>
                <div className=" py-[15px] pl-[4.513vw] pr-[9.513vw] w-full  sm:flex items-center justify-between hidden">
                    <img src={Logo} alt="Logo" className="w-[25.441vw] " />
                    <div className=" felex flex-col ">
                        <span className="text-[18px] font-medium  leading-tight">
                            Account Id:
                        </span>
                        <span className="text-[18px] font-bold  leading-tight  flex items-center">
                        {user?.account_id}

                        </span>

                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
