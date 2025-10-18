export default function SeatMapPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seat Map</h2>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                        src="/wedding-seat-map.html"
                        className="w-full h-96"
                        title="Wedding Seat Map"
                    />
                </div>
            </div>
        </div>
    );
}
