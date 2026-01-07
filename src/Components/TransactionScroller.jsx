import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Bitcoin } from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../Context/SettingsContext';
import './css/TransactionScroller.css';

const MarketScroller = () => {
  const { rates, currency } = useSettings(); 
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cryptoRes = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot&order=market_cap_desc&per_page=8&page=1&sparkline=false'
        );

        const cryptos = cryptoRes.data.map(coin => ({
          id: coin.id,
          name: coin.symbol.toUpperCase(),
          fullName: coin.name,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          isCrypto: true,
          image: coin.image
        }));

        const fiatList = [
          { code: 'USD', name: 'US Dollar', rate: rates['USD'] || 1 },
          { code: 'EUR', name: 'Euro', rate: rates['EUR'] || 0.92 },
          { code: 'GBP', name: 'British Pound', rate: rates['GBP'] || 0.79 },
          { code: 'RUB', name: 'Russian Ruble', rate: rates['RUB'] || 90.5 },
          { code: 'TRY', name: 'Turkish Lira', rate: rates['TRY'] || 32.5 },
        ];

        const fiats = fiatList.map(f => ({
          id: f.code,
          name: f.code,
          fullName: f.name,
          price: (1 / f.rate).toFixed(2), 
          change: (Math.random() * 2 - 1).toFixed(2), 
          isCrypto: false
        }));

    
        setMarketData([...cryptos, ...fiats]);

      } catch (error) {
        console.error("Market data xətası:", error);
    
        setMarketData([
           { name: 'BTC', fullName: 'Bitcoin', price: 64000, change: 2.5, isCrypto: true },
           { name: 'ETH', fullName: 'Ethereum', price: 3400, change: -1.2, isCrypto: true },
           { name: 'USD', fullName: 'Dollar', price: 1.70, change: 0.05, isCrypto: false }
        ]);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [rates]);


  const infiniteData = [...marketData, ...marketData];

  return (
    <div className="ts-wrapper">
      <div className="ts-grid">
        <div className="ts-column">
          <motion.div
            animate={{ y: "-50%" }}
            transition={{
              duration: 30, 
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            className="ts-motion-list"
          >
            {infiniteData.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="ts-card market-card">
                

                <div className="market-left">
                    <div className="market-icon">
                        {item.isCrypto && item.image ? (
                            <img src={item.image} alt={item.name} />
                        ) : (
                            <div className="fiat-icon">{item.name[0]}</div>
                        )}
                    </div>
                    <div className="market-info">
                        <span className="market-symbol">{item.name}</span>
                        <span className="market-fullname">{item.fullName}</span>
                    </div>
                </div>

                <div className="market-right">
                    <span className="market-price">
                        {item.isCrypto ? `$${item.price.toLocaleString()}` : `${item.price} ₼`}
                    </span>
                    <div className={`market-change ${item.change >= 0 ? 'up' : 'down'}`}>
                        {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(item.change)}%
                    </div>
                </div>

              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MarketScroller;