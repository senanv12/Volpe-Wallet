import React from 'react';
import './css/InputCard.css';

const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '#### #### #### ####';
    const raw = cardNumber.replace(/\D/g, '');
    return raw.replace(/(\d{4})/g, '$1 ').trim() || '#### #### #### ####';
};

// --- LEOBANK ---
export const LeoCard = ({ cardData, isFlipped, onClick, style, showCvv, onCvvClick }) => {
  const isMaster = cardData.cardNumber.replace(/\D/g, '').startsWith('5522');

  return (
    // onClick hadisəsi ən xarici div-ə verilir
    <div className={`virtual-card ${isFlipped ? 'is-flipped' : ''} leobank-style`} onClick={onClick} style={style}>
      
      {/* ÖN TƏRƏF */}
      <div className="card-face card-front">
        <div className="leobank-front-design">
          <div className="leo-header">
             <div className="leo-brand">Leobank</div>
             {isMaster ? (
               <div className="mastercard-logo"><div className="mc-circle mc-red"></div><div className="mc-circle mc-orange"></div></div>
             ) : (<div className="visa-logo">VISA</div>)}
          </div>
          <div className="chip"></div>
        </div>
      </div>

      {/* ARXA TƏRƏF */}
      <div className="card-face card-back">
        <div className="leobank-back-design">
          <div className="magnetic-strip"></div>
          <div className="leo-main-number">{formatCardNumber(cardData.cardNumber)}</div>
          <div className="leo-footer-row">
            <div className="leo-info-group text-left"><div className="leo-value">{cardData.expiry}</div></div>
            <div className="leo-info-group text-right">
                <div className="leo-cvv-pill" onClick={onCvvClick}>
                    {showCvv ? cardData.cvv : '***'}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KAPITAL BANK (YENİ QIRMIZI DİZAYN) ---
export const KapitalCard = ({ cardData, isFlipped, onClick, style, showCvv, onCvvClick }) => {
  return (
    <div className={`virtual-card ${isFlipped ? 'is-flipped' : ''} kapital-style`} onClick={onClick} style={style}>
      
      {/* ÖN TƏRƏF */}
      <div className="card-face card-front">
        <div className="kapital-front-design-red">
          <div className="kb-header-new">
              <span className="birbank-text">birbank</span>
              <span className="visa-text">VISA</span>
          </div>
          <div className="chip-silver-new"></div>
          <div className="kb-footer-new">
             <div className="kb-number-large">{formatCardNumber(cardData.cardNumber)}</div>
             <div className="kb-sub-info">
                <span className="kb-holder">{cardData.cardHolder || 'AD SOYAD'}</span>
                <span className="kb-expiry">{cardData.expiry || 'MM/YY'}</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* ARXA TƏRƏF */}
      <div className="card-face card-back">
        <div className="kapital-back-design-red">
           <div className="black-strip"></div>
           <div className="kb-back-content-new">
             <div className="kb-cvv-box-new" onClick={onCvvClick}>
                <span className="kb-cvv-label">CVV</span>
                {showCvv ? cardData.cvv : '***'}
             </div>
             <div className="azn-text">AZN</div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- ABB ---
export const AbbCard = ({ cardData, isFlipped, onClick, style, showCvv, onCvvClick }) => (
  <div className={`virtual-card ${isFlipped ? 'is-flipped' : ''} abb-style`} onClick={onClick} style={style}>
    <div className="card-face card-front">
      <div className="abb-front-design">
        <div className="abb-header"><div className="abb-brand-logo">ABB</div></div>
        <div className="tam-text">tam</div>
        <div className="abb-footer-info">
           <div className="abb-number">{formatCardNumber(cardData.cardNumber)}</div>
           <div className="abb-name">{cardData.cardHolder || 'AD SOYAD'}</div>
        </div>
      </div>
    </div>
    <div className="card-face card-back">
        <div className="abb-back-wrapper">
            <div className="black-strip"></div>
            <div className="horizontal-back-content">
                <div className="cvv-strip" onClick={onCvvClick}>{showCvv ? cardData.cvv : '***'}</div>
            </div>
        </div>
    </div>
  </div>
);

// --- DEFAULT ---
export const DefaultCard = ({ cardData, isFlipped, onClick, style, showCvv, onCvvClick }) => (
  <div className={`virtual-card ${isFlipped ? 'is-flipped' : ''} default-generic`} onClick={onClick} style={style}>
    <div className="card-face card-front">
      <div className="default-front-design">
        <div className="chip"></div>
        <div className="num-front">{formatCardNumber(cardData.cardNumber)}</div>
        <div className="visa-logo">CARD</div>
      </div>
    </div>
    <div className="card-face card-back">
        <div className="abb-back-wrapper" style={{background:'inherit'}}>
            <div className="black-strip"></div>
            <div className="horizontal-back-content">
                <div className="cvv-strip" onClick={onCvvClick}>{showCvv ? cardData.cvv : '***'}</div>
            </div>
        </div>
    </div>
  </div>
);