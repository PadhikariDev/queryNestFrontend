
const Input = ({ label, type, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={label}
                className="
            mt-1 
            w-full 
            px-4 
            py-2 
            border 
            border-gray-300
            rounded-lg 
            shadow-sm 
            transition 
            duration-150 
            ease-in-out
            focus:border-blue-500 
            focus:ring-2 
            focus:ring-blue-500/50 
            outline-none
            text-gray-700
        "
            />
        </div>
    )
}

export default Input