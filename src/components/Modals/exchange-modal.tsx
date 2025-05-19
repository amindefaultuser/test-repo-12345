import { createPortal } from "react-dom";
import Close from '../../assets/icons/close.svg';

interface Props {
    setIsOpen: (value: boolean) => void
}

const ExchangeModal = ({ setIsOpen }: Props) => {
    return createPortal(
        <div className="fixed z-[9999] inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg px-8 pt-6 pb-14  max-w-[26.316vw] sm:max-w-[85%] w-full">
                <div className="flex justify-end items-center">
                    <button onClick={() => setIsOpen(false)}>
                        <img src={Close} alt="Close" className='w-[1.474vw] sm:w-[6.222vw]' />
                    </button>
                </div>
                <div className="space-y-4 flex flex-col text-center">
                    <span className="text-[1.579vw] sm:text-[5.333vw] font-bold">Exchange</span>
                    <span className="text-[0.947vw] sm:text-[3.666vw] font-medium ">Online exchange is prohibited. Online exchange available
                        only for premium accounts. To exchange please contact
                        customer support. </span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExchangeModal;
