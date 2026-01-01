import React, { useState, useMemo } from 'react';
import { useData } from '../Context/DataContext';
import { useSettings } from '../Context/SettingsContext';
import { LeoCard, KapitalCard, AbbCard, DefaultCard } from './CreditCards';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const { cards, transactions, user } = useData();
  const { currentSymbol, convertAmount } = useSettings();
  const [filter, setFilter] = useState('all');
  const [selectedCardId, setSelectedCardId] = useState(cards.length > 0 ? cards[0]._id : null);
  
  // YENİ: Stack üzərinə gələndə kartları aralamaq üçün state
  const [isStackHovered, setIsStackHovered] = useState(false);

  const filteredTransactions = useMemo(() => {
    if (!selectedCardId) return [];
    return transactions.filter(t => t.cardId === selectedCardId && (filter === 'all' || t.type === filter));
  }, [transactions, selectedCardId, filter]);

  const renderMiniCard = (card) => {
    const props = { cardData: card, isFlipped: false, showCvvOverride: false };
    const style = { width: '100%', height: '100%', pointerEvents: 'none' };
    switch (card.cardType) {
      case 'leobank': return <LeoCard {...props} style={style} />;
      case 'kapital': return <KapitalCard {...props} style={style} />;
      case 'abb': return <AbbCard {...props} style={style} />;
      default: return <DefaultCard {...props} style={style} />;
    }
  };

  if (!user || cards.length === 0) return null;

  return (
    <section className="transactions-page" id="transactions-section">
      <div className="transactions-container">
        <h2 className="transactions-title">SON ƏMƏLİYYATLAR</h2>
        
        <div className="transactions-content">
          {/* SOL TƏRƏF (Eynidir) */}
          <div className="left-column">
             <div className="filter-tabs">
                <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Hamısı</button>
                <button className={`filter-tab ${filter === 'income' ? 'active' : ''}`} onClick={() => setFilter('income')}>Gəlir</button>
                <button className={`filter-tab ${filter === 'expense' ? 'active' : ''}`} onClick={() => setFilter('expense')}>Xərc</button>
             </div>
             <div className="transactions-list">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(tr => (
                    <div key={tr._id} className="transaction-item">
                        <div className="transaction-info">
                            <h4 className="transaction-name">{tr.description}</h4>
                            <p className="transaction-category">{tr.category}</p>
                        </div>
                        <span className={`transaction-amount ${tr.type}`}>
                            {tr.type === 'income' ? '+' : '-'} {currentSymbol}{convertAmount(tr.amount).toFixed(2)}
                        </span>
                    </div>
                    ))
                ) : <div className="no-data">Əməliyyat tapılmadı</div>}
             </div>
          </div>

          {/* SAĞ TƏRƏF: STACKED CARDS ANIMATION (YENİLƏNDİ) */}
          <div className="right-column stack-container">
             <h3>Kartı Seçin</h3>
             
             {/* YENİ: onMouseEnter və onMouseLeave əlavə edildi */}
             <div 
               className="cards-stack"
               onMouseEnter={() => setIsStackHovered(true)}
               onMouseLeave={() => setIsStackHovered(false)}
             >
               {cards.map((card, index) => {
                 // Hesablama: Hover olanda 80px, olmayanda 45px məsafə
                 const offset = isStackHovered ? index * 90 : index * 45;
                 
                 // Aktiv kart seçiləndə o da siyahıda qalır, amma biraz qabağa çıxır
                 const isActive = selectedCardId === card._id;

                 return (
                   <div 
                     key={card._id} 
                     className={`stacked-card ${isActive ? 'active' : ''}`}
                     onClick={() => setSelectedCardId(card._id)}
                     style={{ 
                       transform: `translateY(${offset}px) ${isActive && !isStackHovered ? 'scale(1.05)' : 'scale(1)'}`,
                       zIndex: index, // Z-index sadəcə sıraya görə artır
                       // Aktiv kartın kölgəsi fərqli olsun
                       boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.6)' : '0 -5px 10px rgba(0,0,0,0.3)'
                     }}
                   >
                      {/* Kartın üzərinə hover edəndə parıltı effekti */}
                      <div className="card-click-overlay"></div>
                      {renderMiniCard(card)}
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TransactionsPage;