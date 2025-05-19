import { Header } from "../../components";
import Verification from "../../assets/icons/verification.svg";
import useUserStore from "../../store/userStore";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api';
import { useState, useEffect } from 'react';

interface ProfileFormInputs {
    email: string;
    name: string;
    lastName: string;
    userId: string;
}

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    name: yup.string().required('Name is required'),
    lastName: yup.string().required('Last Name is required'),
    userId: yup.string().required('AccountId is required'),
});

const ProfileComponents = () => {
    const user = useUserStore((state) => state.user);
    const { register, handleSubmit,  setValue, formState: { errors } } = useForm<ProfileFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: user?.email || '',
            name: user?.name || '',
            lastName: user?.lastName || '',
            userId: user?.account_id?.toString() || ''
        }
    });
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Add animation styles to document head
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
            .animate-fade-in-out {
                animation: fadeInOut 5s forwards;
            }
            .form-input-focus:focus {
                border-color: #4AB094;
                box-shadow: 0 0 0 2px rgba(74, 176, 148, 0.2);
            }
            .profile-input {
                transition: all 0.3s ease;
            }
            .profile-input:focus {
                border-color: #4AB094;
                box-shadow: 0 0 0 2px rgba(74, 176, 148, 0.1);
            }
            .verification-badge {
                transition: all 0.3s ease;
            }
            .verification-badge:hover {
                transform: scale(1.02);
            }
        `;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    // Set form values when user data changes
    useEffect(() => {
        if (user) {
            setValue('email', user.email || '');
            setValue('name', user.name || '');
            setValue('lastName', user.lastName || '');
            setValue('userId', user.account_id?.toString() || '');
        }
    }, [user, setValue]);

    const onSubmit: SubmitHandler<ProfileFormInputs> = async data => {
        setLoading(true); 
        const message = `
        Name: ${data.name}
        Last Name: ${data.lastName}
        Email: ${data.email}
        Account ID: ${user?.account_id}
        `
        const formData = {
            email: user?.email || '',
            message,
            userId: user?.account_id?.toString() || '',
            subject: 'Profile Update'
        };
        
        try {
            const response = await api.post('/send-mail', formData);
            console.log('Profile updated successfully:', response.data);
            setNotificationType('success');
            setNotificationMessage('Profile updated successfully!');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotificationType('error');
            setNotificationMessage('Failed to update profile. Please try again.');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[2vw] sm:space-y-[4vw] ">
            <div className="sm:hidden">
                <Header />
            </div>
            <div className=" hidden sm:flex flex-col  justify-between ls:space-x-[1.111vw] py-[5vw]">
                    <span className="text-[7.679vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
             </div>
            
            {/* Notification */}
            {showNotification && (
                <div className={`fixed top-[5vw] right-[5vw] py-[1vw] px-[2vw] rounded-lg shadow-lg z-50 animate-fade-in-out ${notificationType === 'success' ? 'bg-[#4AB094]' : 'bg-[rgba(235,87,87,0.9)]'}`}>
                    <p className="text-[1vw] sm:text-[3vw] text-white">{notificationMessage}</p>
                </div>
            )}
            
            {user?.blocked && (
                <div className="flex items-center justify-between ls:space-x-[1.111vw] mb-[2vw]">
                    <span className="text-[1.179vw] sm:text-[3.844vw] text-red-500 font-bold">Your account has been blocked, please contact support</span>
                </div>
            )}

         
            
            {/* Verification Badge */}
            <div className="verification-badge bg-[rgba(74,176,148,0.1)] border border-[#4AB094] rounded-lg p-[1.5vw] flex items-center space-x-[1.5vw] mb-[2vw]">
                <div className="bg-white p-[1vw] rounded-full">
                    <img src={Verification} alt="Verification" className="w-[3vw] sm:w-[8vw]" />
                </div>
                <div>
                    <h3 className="text-[1.2vw] sm:text-[3.5vw] font-bold text-[#4AB094]">Verified Account</h3>
                    <p className="text-[1vw] sm:text-[2.8vw] text-gray-600">Your account is verified and withdrawal limits have been increased.</p>
                </div>
            </div>
            
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm p-[2vw]">
                <h2 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[2vw] text-[#2e2e2e]">Personal Information</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-[2vw]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vw]">
                        <div className="space-y-[1vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">First Name</label>
                            <div className="relative">
                                <input 
                                    {...register('name')} 
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md outline-none profile-input transition-all duration-200" 
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.name.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-[1vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">Last Name</label>
                            <div className="relative">
                                <input 
                                    {...register('lastName')} 
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md outline-none profile-input transition-all duration-200" 
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-[1vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    {...register('email')} 
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md outline-none profile-input transition-all duration-200" 
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-[1vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">Account ID</label>
                            <div className="relative">
                                <input 
                                    {...register('userId')} 
                                    disabled
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md outline-none bg-gray-100 text-gray-500" 
                                />
                                {errors.userId && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.userId.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-[1vw] border-t border-gray-200 mt-[2vw]">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-[#4AB094] text-white py-[1vw] px-[3vw] sm:py-[3vw] sm:px-[6vw] rounded-md font-medium text-[1.1vw] sm:text-[3.5vw] transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3d9d89]'}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-[0.5vw]">
                                        <svg className="animate-spin h-[1.2vw] w-[1.2vw] sm:h-[3vw] sm:w-[3vw] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Updating...</span>
                                    </div>
                                ) : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            {/* Account Statistics */}
            <div className="grid grid-cols-3 gap-[1vw] sm:gap-[2vw]">
                <div className="bg-white p-[1.5vw] rounded-lg shadow-sm text-center">
                    <div className="text-[2vw] sm:text-[5vw] text-[#4AB094] font-bold">Verified</div>
                    <p className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Account Status</p>
                </div>
                <div className="bg-white p-[1.5vw] rounded-lg shadow-sm text-center">
                    <div className="text-[2vw] sm:text-[5vw] text-[#4AB094] font-bold">$50,000</div>
                    <p className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Daily Limit</p>
                </div>
                <div className="bg-white p-[1.5vw] rounded-lg shadow-sm text-center">
                    <div className="text-[2vw] sm:text-[5vw] text-[#4AB094] font-bold">Premium</div>
                    <p className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Account Type</p>
                </div>
            </div>
        </div>
    );
};
export default ProfileComponents;