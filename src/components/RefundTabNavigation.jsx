export default function RefundTabNavigation({ activeTab, setActiveTab }) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => setActiveTab('items')}
                className={` px-4 py-2 text-sm font-semibold ${activeTab === 'items' ? 'bg-purple-900 text-white' : 'border border-purple-200 text-purple-700'}`}
            >
                Select Items
            </button>
            <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${activeTab === 'search' ? 'bg-purple-900 text-white' : 'border border-purple-200 text-purple-700'}`}
            >
                Search Orders
            </button>
        </div>
    );
}
