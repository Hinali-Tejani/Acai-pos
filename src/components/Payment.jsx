import {useState} from 'react';

export default function CheckoutPanel ({totalDue = 0, onPaymentComplete, onClose}) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cashAmount, setCashAmount] = useState('');

    // Track parts of a split payment
    const [splitCashPaid, setSplitCashPaid] = useState(0);

    const total = Number(totalDue) || 0;

    // Remaining total changes if they already locked in some cash
    const currentTotalDue = total - splitCashPaid;

    const receivedCash = Number(cashAmount) || 0;
    const changeDue = receivedCash - currentTotalDue;
    const remainingBalance = currentTotalDue - receivedCash;

    const handleNumPress = (val) => {
        setCashAmount((prev) => {
            if (val === '.' && prev.includes('.')) return prev;
            if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
            return prev + val;
        });
    };

    const handleClear = () => {
        setCashAmount('');
    };

    const handleQuickCash = (amount) => {
        setCashAmount(amount.toFixed(2));
    };

    const handleExactChange = () => {
        setCashAmount(currentTotalDue.toFixed(2));
    };

    // Handles adding partial cash to the split transaction
    const handleApplyPartialCash = () => {
        if (receivedCash <= 0) return;

        if (receivedCash >= currentTotalDue) {
            const payload = {
                method: splitCashPaid > 0 ? 'split' : 'cash',
                amountPaid: total + (receivedCash - currentTotalDue),
                cashPaid: splitCashPaid + receivedCash,
                cardPaid: 0,
                change: receivedCash - currentTotalDue
            };
            onPaymentComplete?.(payload);
            resetAndClose(payload);
        } else {
            // Lock in the cash portion and switch to card for the rest
            setSplitCashPaid((prev) => prev + receivedCash);
            setCashAmount('');
            setPaymentMethod('card');
        }
    };

    const handleResetAll = () => {
        setCashAmount('');
        setSplitCashPaid(0);
        setPaymentMethod('cash');
    };

    const resetAndClose = (payload) => {
        handleResetAll();
        onClose?.();
        onPaymentComplete?.(payload);
    };

    const handleSubmitPayment = () => {
        if (paymentMethod === 'card') {
            const payload = splitCashPaid > 0
                ? {
                    method: 'split',
                    amountPaid: total,
                    cashPaid: splitCashPaid,
                    cardPaid: currentTotalDue,
                    change: 0
                }
                : {method: 'card', amountPaid: total, change: 0};
            resetAndClose(payload);
        } else {
            if (receivedCash < currentTotalDue) return;
            const payload = {
                method: splitCashPaid > 0 ? 'split' : 'cash',
                amountPaid: total,
                cashPaid: splitCashPaid + receivedCash,
                cardPaid: 0,
                change: changeDue
            };
            resetAndClose(payload);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="relative flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl">

                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-500 transition hover:bg-purple-100 active:scale-95"
                    aria-label="Close panel"
                >
                    ✕
                </button>

                {/* LEFT COLUMN */}
                <div className="hidden w-[60%] flex-col justify-between bg-purple-50 p-6 md:flex">
                    {paymentMethod === 'cash' ? (
                        <>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500">Tendered cash</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={cashAmount ? `$${cashAmount}` : '$0.00'}
                                    className="mt-2 w-full rounded-2xl border border-purple-200 bg-white px-4 py-4 text-right text-3xl font-semibold text-purple-800 shadow-sm outline-none"
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-5 gap-2">
                                <button type="button" onClick={handleExactChange} className="rounded-xl border border-purple-200 bg-white px-2 py-3 text-xs font-semibold text-purple-700 hover:bg-purple-100">Exact</button>
                                <button type="button" onClick={() => handleQuickCash(10)} className="rounded-xl border border-purple-200 bg-white px-2 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100">$10</button>
                                <button type="button" onClick={() => handleQuickCash(20)} className="rounded-xl border border-purple-200 bg-white px-2 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100">$20</button>
                                <button type="button" onClick={() => handleQuickCash(50)} className="rounded-xl border border-purple-200 bg-white px-2 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100">$50</button>
                                <button type="button" onClick={() => handleQuickCash(100)} className="rounded-xl border border-purple-200 bg-white px-2 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100">$100</button>
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => handleNumPress(num.toString())}
                                        className="rounded-2xl border border-purple-200 bg-white px-4 py-4 text-xl font-semibold text-purple-800 shadow-sm transition hover:bg-purple-100 active:scale-95"
                                    >
                                        {num}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600 hover:bg-red-100 active:scale-95"
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleNumPress('0')}
                                    className="rounded-2xl border border-purple-200 bg-white px-4 py-4 text-xl font-semibold text-purple-800 shadow-sm transition hover:bg-purple-100 active:scale-95"
                                >
                                    0
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleNumPress('.')}
                                    className="rounded-2xl border border-purple-200 bg-white px-4 py-4 text-xl font-semibold text-purple-800 shadow-sm transition hover:bg-purple-100 active:scale-95"
                                >
                                    .
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-between rounded-3xl border border-dashed border-purple-200 bg-white p-8 text-center">
                            {/* Informational Message */}
                            <div className="my-auto flex flex-col items-center">
                                <div className="mb-4 text-5xl">💳</div>
                                <h4 className="text-xl font-semibold text-purple-900">Standalone Card Mode</h4>
                                <p className="mt-2 max-w-sm text-sm text-purple-600">
                                    Swipe or tap the card on your external payment terminal hardware for
                                    <strong className="text-purple-900 mx-1">${currentTotalDue.toFixed(2)}</strong>.
                                </p>

                                {splitCashPaid > 0 && (
                                    <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 border border-emerald-100">
                                        Successfully recorded <strong>${splitCashPaid.toFixed(2)}</strong> in Cash.
                                    </div>
                                )}
                            </div>

                            {/* Manual Confirmation Override Button */}
                            <button
                                type="button"
                                onClick={handleSubmitPayment}
                                className="w-full max-w-sm rounded-2xl bg-sky-500 py-4 text-base font-bold text-white shadow-md transition hover:bg-sky-400 active:scale-[0.98]"
                            >
                                Confirm External Card Approval
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex w-full flex-col bg-linear-to-br from-purple-400 via-purple-500 to-purple-300 p-6 text-white md:w-[40%]">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-200">Payment</p>
                            <h3 className="text-xl font-semibold">Process transaction</h3>
                        </div>
                        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-purple-100">POS</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-inner">
                        <p className="text-sm text-purple-100">Total bill</p>
                        <p className="mt-2 text-4xl font-bold">${total.toFixed(2)}</p>

                        {/* NEW: Displays the split breakdown inside the bill window */}
                        {splitCashPaid > 0 && (
                            <div className="mt-3 flex justify-between border-t border-white/10 pt-2 text-sm text-purple-100 font-medium">
                                <span>Paid Cash: <strong className="text-emerald-300">${splitCashPaid.toFixed(2)}</strong></span>
                                <span>Remaining Card Due: <strong className="text-amber-300">${currentTotalDue.toFixed(2)}</strong></span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {setPaymentMethod('cash'); handleClear();}}
                            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${paymentMethod === 'cash' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 text-purple-100 hover:bg-white/20'}`}
                        >
                            💵 Cash
                        </button>
                        <button
                            type="button"
                            onClick={() => {setPaymentMethod('card'); handleClear();}}
                            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${paymentMethod === 'card' ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/10 text-purple-100 hover:bg-white/20'}`}
                        >
                            💳 Card
                        </button>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-purple-950/40 p-4">
                        {paymentMethod === 'cash' ? (
                            <>
                                <div className="flex items-center justify-between text-sm text-purple-200">
                                    <span>Amount tendered</span>
                                    <span className="font-semibold text-white">${receivedCash.toFixed(2)}</span>
                                </div>
                                {remainingBalance > 0 ? (
                                    <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm font-semibold text-amber-200">
                                        Remaining: ${remainingBalance.toFixed(2)}
                                    </div>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-200">
                                        Change due: ${Math.abs(changeDue).toFixed(2)}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-3 text-sm text-sky-100">
                                Connect the card reader and authorize the payment for ${currentTotalDue.toFixed(2)}.
                            </div>
                        )}
                    </div>

                    {/* Action Row */}
                    <div className="mt-6 flex flex-col gap-2">
                        {/* 1. Show this button ONLY when typing a partial cash amount */}
                        {paymentMethod === 'cash' && receivedCash > 0 && remainingBalance > 0 && (
                            <button
                                type="button"
                                onClick={handleApplyPartialCash}
                                className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-400 active:scale-[0.98]"
                            >
                                Apply Partial Cash (${receivedCash.toFixed(2)})
                            </button>
                        )}

                        {/* 2. Main workflow button */}
                        <button
                            type="button"
                            onClick={handleSubmitPayment}
                            // Disable only if it's pure cash mode and they haven't handed over enough money yet
                            disabled={paymentMethod === 'cash' && receivedCash < currentTotalDue}
                            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-purple-700 disabled:opacity-50"
                        >
                            {paymentMethod === 'card'
                                ? (splitCashPaid > 0 ? `Complete Split Order (Charge $${currentTotalDue.toFixed(2)} to Card)` : 'Process Card Payment')
                                : 'Complete Cash Payment'
                            }
                        </button>

                        {/* 3. Safety escape route if they make an entry mistake */}
                        {splitCashPaid > 0 && (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="mt-2 text-center text-xs text-purple-200 underline decoration-purple-300 hover:text-white transition"
                            >
                                Cancel Split & Reset Total
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}