import { createPortal } from "react-dom";

import Close from '../../assets/icons/close.svg';

interface Props {
    setIsOpen: (value: boolean) => void
}

const PrivatePolicy = ({ setIsOpen }: Props) => {
    return createPortal (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-8 py-6 max-w-[500px] w-full">
                <div className="flex justify-end items-center ">
                    <button onClick={() => setIsOpen(false)} className="">
                        <img src={Close} alt="Close" className='w-[28px]' />
                    </button>
                </div>
                <div className="space-y-4 flex flex-col items-center">
                    <h3 className="uppercase font-bold text-gray-800">Private Policy</h3>
                    <div className="w-full h-[500px] bg-[#abaaa9] overflow-y-scroll p-4">
                        <h4 className="font-bold">Last updated: 18.04.2023</h4>
                        <p>This Privacy Policy describes how [Name of your company or website] collects, uses, and protects personal data from users.</p>

                        <h4 className="font-bold">1. What data we collect</h4>
                        <p>When you use our website, we may collect the following information:</p>
                        <ul className="list-disc pl-5">
                            <li><strong>Personal data:</strong> Name, email, phone number (if you provide this information when registering or filling out forms).</li>
                            <li><strong>Technical data:</strong> IP address, browser type, device you are accessing the site from.</li>
                            <li><strong>Activity data:</strong> Pages viewed, time spent on the site, clicks.</li>
                            <li><strong>Cookies and similar technologies:</strong> Used to improve your experience of interacting with the site.</li>
                        </ul>

                        <h4 className="font-bold">2. How we use your data</h4>
                        <p>We use the collected data to:</p>
                        <ul className="list-disc pl-5">
                            <li>Provide services and customer care.</li>
                            <li>Optimize and improve the website.</li>
                            <li>Analytics.</li>
                            <li>Marketing mailings (only with your consent).</li>
                        </ul>

                        <h4 className="font-bold">3. How we protect your data</h4>
                        <ul className="list-disc pl-5">
                            <li>We use SSL encryption for the secure transfer of information.</li>
                            <li>Only authorized persons have access to personal data.</li>
                            <li>We do not share your data with third parties without your consent, except as required by law.</li>
                        </ul>

                        <h4 className="font-bold">4. Cookies</h4>
                        <p>Our website uses cookies to:</p>
                        <ul className="list-disc pl-5">
                            <li>Remember your preferences.</li>
                            <li>Analytics and statistics.</li>
                            <li>Improve the functionality of the site.</li>
                        </ul>
                        <p>You can manage cookies in your browser settings.</p>

                        <h4 className="font-bold">5. Transfer of data to third parties</h4>
                        <p>We may share anonymized or aggregated data with partners (e.g., Google Analytics).</p>

                        <h4 className="font-bold">6. Your rights</h4>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5">
                            <li>Find out what data we store about you.</li>
                            <li>Request the deletion or modification of your personal data.</li>
                            <li>Opt out of marketing mailings.</li>
                        </ul>

                        <h4 className="font-bold">7. Changes to the policy</h4>
                        <p>We may update this policy from time to time. Changes will be posted on our website.</p>
                    </div>
                </div>
            </div>
        </div>,
         document.body
    );
};

export default PrivatePolicy;
