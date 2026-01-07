import React from 'react';
import TransactionScroller from './TransactionScroller';
import ConverterCard from './ConverterCard'; 
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
        
        <div className="tp-split-layout">
            
            <div className="tp-left">
                <ConverterCard />
            </div>

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