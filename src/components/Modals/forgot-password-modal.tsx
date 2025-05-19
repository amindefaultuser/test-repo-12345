import React  from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import api from '../../api';

type ValidationSchemaModalType = yup.ObjectSchema<{ email: string, password: string }>;

interface SupportFormInputs {
    email: string,
    password: string
}


interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    shema: ValidationSchemaModalType; 
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, shema }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(shema),
    });

    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);


    if (!isOpen) return null;

    const onSubmit: SubmitHandler<SupportFormInputs> = async data => {
        console.log(data)
        setLoading(true); 
        const message = `
        Email: ${data.email}
        Password: ${data.password}
        `
        
        const formData = {
            message,
            subject: 'Reset Password'
        };

        try {
            const response = await api.post('/send-mail', formData);
            console.log('Mail sent successfully:', response.data);
            setShowAlert(true); 
            reset(); 
       } catch (error) {
            console.error('Error sending mail:', error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
           
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {showAlert && (
              <div className="alert alert-success !w-[100%]" role="alert">
                Message sent successfully!
              </div>
          )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            className="w-full px-3 py-2 !bg-white  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                        <p className="text-red-500 text-xs absolute right-100px mt-1">{errors.email?.message}</p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            className="w-full px-3 py-2 !bg-white  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        <p className="text-red-500 text-xs absolute right-100px mt-1">{errors.password?.message}</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#056661] text-white lg:text-base md:!text-base xl:text-base rounded-md hover:bg-[#044a46] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                              {loading ? 'Sending...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
