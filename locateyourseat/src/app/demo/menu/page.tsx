export default function MenuPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                        src="/menu.jpeg"
                        alt="Wedding Menu"
                        className="w-full h-144 object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
