import React from 'react';
import TransactionScroller from './TransactionScroller';
import ConverterCard from './ConverterCard'; // <--- Yeni komponent
import './css/TransactionsPage.css';

const TransactionsPage = () => {
  return (
    <section className="transactions-page" id="transactions-section">
      <div className="transactions-container">
        
        <div className="tp-header">
            <h2 className="transactions-title">Bazar və Alətlər</h2>
            <p className="transactions-subtitle">
                Canlı məzənnələr və sürətli çevirmə alətləri.
            </p>
        </div>
        
        {/* YENİ LAYOUT: SOL və SAĞ */}
        <div className="tp-split-layout">
            
            {/* SOL TƏRƏF: Magic Converter */}
            <div className="tp-left">
                <ConverterCard />
            </div>

            {/* SAĞ TƏRƏF: Market Scroller */}
            <div className="tp-right">
                <div className="market-label">Bazar İcmalı</div>
                <TransactionScroller />
            </div>

        </div>

      </div>
    </section>
  );
};

export default TransactionsPage;