import { useForm, SubmitHandler } from 'react-hook-form';
import { Header } from "../../components";
import useUserStore from '../../store/userStore';
import api from '../../api';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface SupportFormInputs {
    email: string;
    message: string;
    category: string;
}

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    message: yup.string().required('Message is required'),
    category: yup.string().required('Please select a category'),
});

interface FaqItem {
    question: string;
    answer: string;
}

const faqItems: FaqItem[] = [
    {
        question: 'What are the transfer limits?',
        answer: 'Transfer limits vary based on your account verification level. Basic accounts can transfer up to $5,000 per day, while verified accounts can transfer up to $50,000 per day.'
    },
    {
        question: 'How long do transfers take to process?',
        answer: 'Most transfers are processed instantly. However, depending on the payment method and recipient bank, some transfers may take 1-3 business days to complete.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-standard encryption and security protocols to protect your data. All transactions are secured with 256-bit SSL encryption and we never store your full card details.'
    },
    {
        question: 'What currencies do you support?',
        answer: 'We currently support USD, EUR, GBP, JPY, and major cryptocurrencies including BTC, ETH, and USDT.'
    }
];

const supportCategories = [
    { id: 'account', name: 'Account Issues', icon: '👤' },
    { id: 'payment', name: 'Payment Problems', icon: '💳' },
    { id: 'transfer', name: 'Transfer Questions', icon: '🔄' },
    { id: 'security', name: 'Security Concerns', icon: '🔒' },
    { id: 'other', name: 'Other', icon: '❓' }
];

const SupportComponent = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SupportFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            category: ''
        }
    });
    const user = useUserStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
            .faq-item {
                transition: all 0.3s ease;
            }
            .faq-item:hover {
                background-color: rgba(74, 176, 148, 0.05);
            }
            .category-card {
                transition: all 0.2s ease;
                cursor: pointer;
            }
            .category-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            }
            .category-card.active {
                border-color: #4AB094;
                background-color: rgba(74, 176, 148, 0.1);
            }
        `;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const onSubmit: SubmitHandler<SupportFormInputs> = async data => {
        setLoading(true); 
        const formData = {
            email: data.email,
            message: data.message,
            category: data.category,
            userId: user?.account_id?.toString() || 'guest',
            subject: `Support: ${data.category}`
        };
        
        try {
            const response = await api.post('/send-mail', formData);
            console.log('Mail sent successfully:', response.data);
            setNotificationMessage('Your message has been sent successfully! Our support team will contact you shortly.');
            setNotificationType('success');
            setShowNotification(true);
            reset(); 
        } catch (error) {
            console.error('Error sending mail:', error);
            setNotificationMessage('Failed to send message. Please try again later.');
            setNotificationType('error');
            setShowNotification(true);
        } finally {
            setLoading(false); 
        }
    };
    
    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };
  
   

    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[2vw] sm:space-y-[4vw]">
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

            <div className="mb-[2vw]">
             
           
                <p className="text-[1.2vw] sm:text-[3.2vw] text-gray-600 mt-[1vw] max-w-[70%]">
                    Need help with your account, payments, or transfers? Our support team is here to assist you 24/7.
                </p>
            </div>
            
          
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2vw] sm:flex sm:flex-col sm:!gap-[6vw]">
                {/* Contact Form */}
                <div className="bg-white p-[2vw] rounded-lg shadow-sm order-2 lg:order-1">
                    <h2 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1vw] text-[#2e2e2e]">Send a Message</h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[1.5vw]">
                        <div className="space-y-[0.5vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder="Your email" 
                                    {...register('email')} 
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md outline-none form-input-focus transition-all duration-200" 
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-[0.5vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">Category</label>
                            <div className="relative">
                                <select
                                    {...register('category')}
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md outline-none form-input-focus transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    {supportCategories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.category.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-[0.5vw]">
                            <label className="text-[1vw] sm:text-[3vw] font-medium text-gray-700">Message</label>
                            <div className="relative">
                                <textarea 
                                    placeholder="How can we help you?" 
                                    {...register('message')} 
                                    className="w-full py-[0.8vw] px-[1vw] sm:py-[2.5vw] sm:px-[2.5vw] border border-gray-300 rounded-md h-[10vw] sm:h-[30vw] resize-none outline-none form-input-focus transition-all duration-200" 
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-[0.9vw] sm:text-[2.5vw] mt-[0.3vw]">{errors.message.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#4AB094] text-white py-[1vw] px-[2vw] sm:py-[3vw] sm:px-[4vw] rounded-md font-medium text-[1.1vw] sm:text-[3.5vw] transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3d9d89]'}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-[0.5vw]">
                                    <svg className="animate-spin h-[1.2vw] w-[1.2vw] sm:h-[3vw] sm:w-[3vw] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Sending...</span>
                                </div>
                            ) : 'Send Message'}
                        </button>
                    </form>
                </div>
                
                {/* FAQ Section */}
                <div className="bg-white p-[2vw] rounded-lg shadow-sm order-1 lg:order-2">
                    <h2 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1.5vw] text-[#2e2e2e]">Frequently Asked Questions</h2>
                    
                    <div className="space-y-[1vw]">
                        {faqItems.map((faq, index) => (
                            <div 
                                key={index} 
                                className="faq-item border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <div 
                                    className="p-[1.2vw] sm:p-[3vw] bg-gray-50 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <h3 className="text-[1.1vw] sm:text-[3vw] font-medium">{faq.question}</h3>
                                    <svg 
                                        className={`w-[1vw] h-[1vw] sm:w-[2.5vw] sm:h-[2.5vw] text-gray-500 transition-transform duration-200 ${expandedFaq === index ? 'transform rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                                {expandedFaq === index && (
                                    <div className="p-[1.2vw] sm:p-[3vw] border-t border-gray-200">
                                        <p className="text-[1vw] sm:text-[2.8vw] text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-[2vw] p-[1.5vw] rounded-lg bg-[rgba(74,176,148,0.1)] border border-[#4AB094]">
                        <div className="flex items-start">
                            <svg className="w-[1.5vw] h-[1.5vw] sm:w-[3.5vw] sm:h-[3.5vw] text-[#4AB094] mr-[1vw] mt-[0.2vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <div>
                                <h3 className="text-[1.2vw] sm:text-[3.2vw] font-medium text-[#4AB094]">Still need help?</h3>
                                <p className="text-[1vw] sm:text-[2.8vw] text-gray-600 mt-[0.5vw]">
                                    If you can't find the answer to your question, please don't hesitate to contact our support team.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Support Stats */}
            <div className="grid grid-cols-3 gap-[1vw] sm:gap-[2vw]">
                <div className="bg-white p-[1.5vw] rounded-lg shadow-sm text-center">
                    <div className="text-[2vw] sm:text-[5vw] text-[#4AB094] font-bold">98%</div>
                    <p className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Customer Satisfaction</p>
                </div>
                <div className="bg-white p-[1.5vw] rounded-lg shadow-sm text-center">
                    <div className="text-[2vw] sm:text-[5vw] text-[#4AB094] font-bold">24H</div>
                    <p className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Response time</p>
                </div>
                <div className="bg-white p-[1.5vw] rounded-lg shadow-sm text-center">
                    <div className="text-[2vw] sm:text-[5vw] text-[#4AB094] font-bold">24/7</div>
                    <p className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Support Availability</p>
                </div>
            </div>
        </div>
    );
};
export default SupportComponent;
