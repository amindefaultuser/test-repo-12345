interface Props {
    label: string,
    value: string,
    className?: string
    register?: any
}



const ProfileInput = ({label, value, className, register}: Props) => {
    return (
        <label className={`flex flex-col w-[18.421vw] text-[0.947vw] sm:text-[5vw] sm:w-full space-y-[0.526vw] ${className}`}>
        <span className="text-[0.947vw] sm:text-[5vw]">{label}:</span>
        <input 
        type="text"
        {...register}
        defaultValue={value}
        className="py-[0.526vw] px-[0.526vw] sm:py-[2.333vw] sm:px-[2.333vw]  outline-none sm:bg-[#DCD8D4]"
        />
    </label>

    );
}
export default ProfileInput;