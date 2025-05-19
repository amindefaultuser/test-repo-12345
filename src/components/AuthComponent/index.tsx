//General
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuthStore  from '../../store/authStore';
//images 
import Logo from '../../assets/plug/logo.png';
import SeePassword from '../../assets/icons/password-see.svg';
import SeePasswordOff from '../../assets/icons/password-see-off.svg';
//components 
import ForgotPasswordModal from '../Modals/forgot-password-modal';

 


 

const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('The email field is required'),
    password: yup
        .string()
        .min(6, 'Min 6 characters') 
        .required('The password field is required')
        .max(20, 'Max 20 characters')
    });

 
const validationSchemaModal = yup.object({
    email: yup.string().email('Invalid email format').required('The email field is required'),
    password: yup.string()
    .min(8, 'Password must be at least 8 characters long') 
    .required('The password field is required')
});   

const RegisterComponent: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorLogIn, setErrorLogIn] = useState<string>('')
    const login = useAuthStore((state) => state.login);
  
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(validationSchema),
      });


      const onSubmit = async (data: { email: string; password: string }) => {
        try {
            const res = await login(data.email, data.password);
            console.log(res);
            navigate("/");
        } catch (error) {
            const loginError = error as Error;
            setErrorLogIn(loginError.message);
        }
    };
    

    return (
        <div className="flex justify-center items-center flex-col space-y-6 shadow-custom-xl sm:shadow-custom-sm md:shadow-custom-xl lg:shadow-custom-xl w-full max-w-lg py-8">
            <div className="flex justify-center items-center">
                <img src={Logo} alt="Logo" className="w-24 md:w-24 lg:w-30" />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Log In To Your Account</h1>
            <div className="flex justify-center items-center flex-col w-full max-w-[90%] space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6" noValidate>
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm md:text-base lg:text-lg mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register('email')} 
                                className="w-full px-4 py-2.5 !bg-white text-sm md:text-base lg:text-lg h-10 md:h-12 lg:h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="email"
                                placeholder="name@example.com"
                            />
                            <p className='text-red-500 text-xs absolute right-0 mt-1'>{errors.email?.message}</p>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm md:text-base lg:text-lg mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className="w-full px-4 py-2.5 !bg-white text-sm md:text-base lg:text-lg h-10 md:h-12 lg:h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="password"
                                    placeholder="Enter your password"
                                />
                                <p className='text-red-500 text-xs absolute right-0 mt-1'>{errors.password?.message}</p>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <img
                                        src={showPassword ? SeePassword : SeePasswordOff}
                                        className="w-5 md:w-6 lg:w-6"
                                        alt={showPassword ? "Hide password" : "Show password"}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center pt-2">
                        <button 
                            type="submit" 
                            className="bg-[#056661] text-sm md:text-base lg:text-lg transition-all duration-500 hover:bg-[#044a46] font-bold text-white px-20 py-1.5 rounded-full"
                        >
                            Log In
                        </button>
                    </div>
                </form>
                {errorLogIn && <p className='text-red-500 text-xs'>{errorLogIn}</p>}
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm md:text-base lg:text-lg hover:text-[#056661]"
                >
                    Forgot Password?
                </button>
            </div>
            <ForgotPasswordModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shema={validationSchemaModal}
            />
        </div>
    );
};

export default RegisterComponent;