
const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-white bg-opacity-80 fixed top-0 left-0 z-[10000]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="mt-4 text-gray-600 font-semibold text-sm animate-pulse">Loading...</div>
            </div>
        </div>
    );
};

export default Loader;

