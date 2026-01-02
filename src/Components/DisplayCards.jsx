import React from 'react';
import { useData } from '../Context/DataContext';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import './css/DisplayCards.css';

const DisplayCards = () => {
  const { transactions, user } = useData();

  // Yalnız son 4 əməliyyatı götürürük
  const recentTransactions = transactions.slice(0, 4);

  if (!user) return null;

  return (
    <div className="display-cards-wrapper">
      <div className="dc-header">
        <h3>Son Əməliyyatlar</h3>
        <button className="dc-more-btn">Hamısı</button>
      </div>

      <div className="dc-list">
        {recentTransactions.length > 0 ? (
           recentTransactions.map((txn, index) => (
             <div key={txn._id || index} className="dc-card">
               <div className="dc-icon-box" style={{
                   background: txn.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                   color: txn.type === 'income' ? '#10b981' : '#ef4444'
               }}>
                  {txn.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
               </div>
               
               <div className="dc-content">
                 <div className="dc-top">
                    <span className="dc-name">{txn.description || txn.category}</span>
                    <span className={`dc-amount ${txn.type}`}>
                        {txn.type === 'income' ? '+' : '-'}{txn.amount} ₼
                    </span>
                 </div>
                 <div className="dc-bottom">
                    <span className="dc-date">{new Date(txn.date).toLocaleDateString()}</span>
                    <span className="dc-status">Uğurlu</span>
                 </div>
               </div>
             </div>
           ))
        ) : (
            <p className="dc-empty">Hələ ki, əməliyyat yoxdur.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayCards;