import React, { useState, useEffect } from 'react';
import { ArrowDown, RefreshCw, X, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { ZelligePattern } from '../constants';

const RATES: Record<string, number> = {
  'USD': 9.05,
  'EUR': 10.80,
  'GBP': 12.45,
  'CAD': 6.65
};

interface CurrencyConverterProps {
  onClose?: () => void;
  className?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onClose, className = '' }) => {
  const [amount, setAmount] = useState<string>('100');
  const [currency, setCurrency] = useState('USD');
  
  // Stock Price Simulation State (MASI - Moroccan All Shares Index)
  const [stockPrice, setStockPrice] = useState<number>(12150.45);
  const [priceChange, setPriceChange] = useState<number>(0);

  const converted = amount ? (parseFloat(amount) * RATES[currency]).toFixed(2) : '0.00';

  useEffect(() => {
    // Simulate real-time stock price updates every 3 seconds
    const interval = setInterval(() => {
      setStockPrice(prev => {
        const change = (Math.random() - 0.5) * 5; // Random fluctuation between -2.5 and +2.5
        setPriceChange(change);
        return parseFloat((prev + change).toFixed(2));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-teal-100 p-5 relative overflow-hidden ${className}`}>
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <RefreshCw size={16} />
             </div>
             <h3 className="font-display font-bold text-stone-800 text-lg">Currency Converter</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full text-stone-400">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-2">
           <div className="flex-1">
              <label className="block text-xs font-bold text-stone-400 mb-1">From</label>
              <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200 px-3 py-2 focus-within:border-teal-500 transition-colors">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent font-bold text-stone-700 outline-none mr-2 w-full appearance-none"
                  style={{ backgroundImage: 'none' }}
                >
                  {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ArrowDown size={14} className="text-stone-400" />
              </div>
           </div>
           
           <div className="flex-1">
             <label className="block text-xs font-bold text-stone-400 mb-1">Amount</label>
             <input 
               type="number" 
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="w-full bg-stone-50 rounded-lg border border-stone-200 px-3 py-2 font-bold text-stone-800 focus:border-teal-500 outline-none transition-colors"
             />
           </div>
        </div>

        <div className="flex justify-center -my-3 relative z-20">
           <div className="bg-white p-1 rounded-full border border-stone-200 shadow-sm text-stone-400">
             <ArrowDown size={16} />
           </div>
        </div>

        <div className="bg-teal-900 text-white rounded-xl p-4 mt-2 text-center shadow-md relative overflow-hidden">
            <div className="absolute inset-0 text-white/10">
                <ZelligePattern />
            </div>
            <div className="relative z-10">
              <span className="text-xs text-teal-200 uppercase tracking-wide font-bold">Approximately</span>
              <div className="text-3xl font-display font-bold my-1">{converted} <span className="text-lg">MAD</span></div>
              <div className="text-[10px] text-teal-200 flex items-center justify-center gap-1">
                1 {currency} ≈ {RATES[currency]} MAD
              </div>
            </div>
        </div>
        
        {/* Real-time Stock Ticker (Market Data) */}
        <div className="mt-4 border-t border-stone-100 pt-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <BarChart3 size={14} className="text-stone-400" />
               <span className="text-xs font-bold text-stone-600">MASI Index (Stock)</span>
            </div>
            <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-md">
               <span className="text-xs font-mono font-bold text-stone-800">{stockPrice.toLocaleString()}</span>
               {priceChange >= 0 ? (
                 <TrendingUp size={12} className="text-green-600" />
               ) : (
                 <TrendingDown size={12} className="text-red-600" />
               )}
            </div>
          </div>
          <p className="text-[9px] text-stone-300 text-right mt-1">Live updates every 3s</p>
        </div>

      </div>
    </div>
  );
};

export default CurrencyConverter;