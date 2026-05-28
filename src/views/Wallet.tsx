'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  AlertCircle, ArrowUpRight, ArrowDownLeft, RefreshCcw, Download, 
  CreditCard, Building, Settings, CheckCircle2, Smartphone, Wallet2, X, Plus, Trash2 
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import './WalletMarketplace.css';
import './WalletDashboard.css';

// ── MOCK DATA ──
const MOCK_TRANSACTIONS = [
  { id: 'TX-1001', type: 'addition', amount: 500, date: '2026-05-10', status: 'Completed', description: 'Wallet Funded via Credit Card' },
  { id: 'TX-1002', type: 'payment', amount: -50, date: '2026-05-09', status: 'Completed', description: 'Interview Escrow - John Doe' },
  { id: 'TX-1003', type: 'addition', amount: 1000, date: '2026-05-05', status: 'Completed', description: 'Wallet Funded via Bank Transfer' },
  { id: 'TX-1004', type: 'withdrawal', amount: -200, date: '2026-05-01', status: 'Completed', description: 'Withdrawal to HDFC Bank' },
  { id: 'TX-1005', type: 'payment', amount: -25, date: '2026-04-28', status: 'Completed', description: 'Premium Listing Fee' },
];

const INITIAL_ACCOUNTS = [
  { id: 'acc-1', name: 'HDFC Bank', type: 'Bank', details: 'Checking •••• 4021', icon: <Building size={20}/> },
  { id: 'acc-2', name: 'Visa Credit Card', type: 'Card', details: 'Card •••• 1024', icon: <CreditCard size={20}/> }
];

const createTransactionId = () => {
  const buffer = new Uint32Array(1);
  globalThis.crypto?.getRandomValues(buffer);
  const suffix = ((buffer[0] || Date.now()) % 9000) + 1000;
  return `TX-${suffix}`;
};

export const Wallet: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { walletBalance, addFunds, user } = useAuth();
  
  const [floaters, setFloaters] = useState<{ id: number; text: string; type: 'add' | 'sub' }[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [linkedAccounts, setLinkedAccounts] = useState(INITIAL_ACCOUNTS);

  // Modal States
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  
  // Top Up Flow State
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [processing, setProcessing] = useState(false);

  // Transfer State
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('100');
  const [transferNote, setTransferNote] = useState('');
  const [transferStep, setTransferStep] = useState<'input' | 'confirm'>('input');
  
  const BANKS = ['SBI Net Banking', 'HDFC Net Banking', 'ICICI Net Banking', 'Axis Net Banking', 'Kotak Net Banking'];

  // New Account State
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<'Bank' | 'Card'>('Bank');
  const [newAccDetails, setNewAccDetails] = useState('');

  // Filtered Transactions
  const filteredTxs = useMemo(() => {
    if (filterType === 'all') return transactions;
    return transactions.filter(tx => tx.type === filterType);
  }, [transactions, filterType]);

  // ── HANDLERS ──
  const handleAddFunds = (amount: number, method: string) => {
    setProcessing(true);
    setTimeout(() => {
      addFunds(amount);
      triggerFloater(`+${formatCurrency(amount)}`, 'add');
      const newTx = { id: createTransactionId(), type: 'addition', amount, date: new Date().toISOString().split('T')[0], status: 'Completed', description: `Wallet Funded via ${method}` };
      setTransactions(prev => [newTx, ...prev]);
      setProcessing(false);
      setShowTopUpModal(false);
    }, 1500);
  };

  const handleTransfer = () => {
    setProcessing(true);
    setTimeout(() => {
      const amt = Number(transferAmount);
      triggerFloater(`-${formatCurrency(amt)}`, 'sub');
      const newTx = { id: createTransactionId(), type: 'payment', amount: -amt, date: new Date().toISOString().split('T')[0], status: 'Completed', description: `Transfer to ${transferTo}${transferNote ? ' — ' + transferNote : ''}` };
      setTransactions(prev => [newTx, ...prev]);
      setProcessing(false);
      setTransferSuccess(true);
      setTimeout(() => { setTransferSuccess(false); setShowTransferModal(false); setTransferStep('input'); setTransferTo(''); setTransferAmount('100'); setTransferNote(''); }, 2000);
    }, 1500);
  };

  const handlePayWithWallet = () => {
    setProcessing(true);
    setTimeout(() => {
      const amt = 99;
      triggerFloater(`-${formatCurrency(amt)}`, 'sub');
      const newTx = { id: createTransactionId(), type: 'payment', amount: -amt, date: new Date().toISOString().split('T')[0], status: 'Completed', description: 'VIJ Premium — Pay with VijWallet' };
      setTransactions(prev => [newTx, ...prev]);
      setProcessing(false);
      setPaySuccess(true);
      setTimeout(() => { setPaySuccess(false); setShowPayModal(false); }, 2500);
    }, 1500);
  };

  const handleAddAccount = () => {
    const newAcc = {
      id: `acc-${Date.now()}`,
      name: newAccName || 'New Account',
      type: newAccType,
      details: newAccDetails || '•••• 0000',
      icon: newAccType === 'Bank' ? <Building size={20}/> : <CreditCard size={20}/>
    };
    setLinkedAccounts(prev => [...prev, newAcc]);
    setShowAddAccountModal(false);
    setNewAccName('');
    setNewAccDetails('');
  };

  const handleDeleteAccount = (id: string) => {
    setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const handleWithdraw = (amount: number) => {
    if (walletBalance < amount) {
      alert("Insufficient funds for withdrawal.");
      return;
    }
    triggerFloater(`-${formatCurrency(amount)}`, 'sub');
    
    const newTx = {
      id: createTransactionId(),
      type: 'withdrawal',
      amount: -amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      description: 'Withdrawal to Bank'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const triggerFloater = (text: string, type: 'add'|'sub') => {
    const newFloat = { id: Date.now(), text, type };
    setFloaters(prev => [...prev, newFloat]);
    setTimeout(() => { setFloaters(prev => prev.filter(f => f.id !== newFloat.id)); }, 1000);
  };

  // ── EXPORT TO CSV ──
  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Amount', 'Status', 'Description'];
    const rows = filteredTxs.map(tx => [
      tx.id,
      tx.date,
      tx.type,
      tx.amount.toString(),
      tx.status,
      tx.description
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VIJ_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── 3D CARD ANIMATION ──
  const x = useMotionValue(200);
  const y = useMotionValue(100);
  const rotateX = useTransform(y, [0, 200], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    x.set(cx); y.set(cy);
    event.currentTarget.style.setProperty('--mouse-x', `${(cx / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--mouse-y', `${(cy / rect.height) * 100}%`);
  }

  function handleMouseLeave() { x.set(200); y.set(100); }

  return (
    <PageTransition>
      <div className="wallet-page">
        
        {!user ? (
          <div className="alert-zone">
            <GlassCard className="alert-box danger-alert">
              <AlertCircle size={20} />
              <span>You must be logged in to access the Wallet.</span>
            </GlassCard>
          </div>
        ) : (
          <>
            <div className="wallet-header">
              {/* 3D Wallet Card */}
              <div className="card-container" onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}>
                <motion.div className="digital-card" style={{ rotateX, rotateY, z: 100 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <div className="hologram-mesh"></div>
                  <div className="glint"></div>
                  <div className="card-top">
                    <span>VIJ Virtual Wallet</span>
                    <div className="card-chip"></div>
                  </div>
                  <div className="card-balance">
                    <motion.div className="rolling-balance" key={walletBalance} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                      {formatCurrency(walletBalance)}
                    </motion.div>
                  </div>
                  <div className="card-bottom">
                    <span>{user.name}</span>
                    <span className="card-id">**** **** {user?.id?.slice(-4) || '1024'}</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Wallet Actions */}
              <div className="wallet-actions">
                <h2>Manage Funds</h2>
                <p>Add funds, transfer to others, or pay seamlessly across VIJ.</p>

                <div className="wlt-security-badge">
                  <CheckCircle2 size={14} /> 256-bit SSL Encrypted · PCI-DSS Compliant
                </div>
                
                <div className="action-buttons" style={{ position: 'relative' }}>
                  <div className="wlt-btn-wrap" title="Add money using UPI, Card, or Net Banking">
                    <GlassButton variant="primary" onClick={() => setShowTopUpModal(true)}>
                      <ArrowDownLeft size={16}/> Add Funds
                    </GlassButton>
                  </div>
                  <div className="wlt-btn-wrap" title="Withdraw ₹100 to your linked bank account">
                    <GlassButton onClick={() => handleWithdraw(100)}>
                      <ArrowUpRight size={16}/> Withdraw {formatCurrency(100, true)}
                    </GlassButton>
                  </div>
                  <div className="wlt-btn-wrap" title="Send money to a UPI ID or saved wallet">
                    <GlassButton onClick={() => { setShowTransferModal(true); setTransferStep('input'); }}>
                      <RefreshCcw size={16}/> Transfer Money
                    </GlassButton>
                  </div>
                  <div className="wlt-btn-wrap" title="Use your VijWallet balance for purchases on the platform">
                    <GlassButton variant="primary" onClick={() => setShowPayModal(true)}>
                      <Wallet2 size={16}/> Pay with VijWallet
                    </GlassButton>
                  </div>

                  {floaters.map(f => (
                    <motion.div key={f.id} initial={{ opacity: 1, y: 0, x: 20 }} animate={{ opacity: 0, y: -40, x: 20 }} transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ position: 'absolute', top: '-10px', left: f.type === 'add' ? '0' : '150px', color: f.type === 'add' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                      {f.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── WALLET DASHBOARD ── */}
            <div className="wallet-dashboard">
              <div className="wallet-grid">
                
                {/* LEFT COL: TRANSACTIONS */}
                <GlassCard className="dashboard-panel">
                  <div className="tx-controls">
                    <h3 className="wallet-section-title" style={{ margin: 0 }}>Transaction History</h3>
                    <div className="tx-filters">
                      <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="all">All Transactions</option>
                        <option value="addition">Additions</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="payment">Payments</option>
                      </select>
                      <button className="gn-btn-sm outline" onClick={exportToCSV}>
                        <Download size={14}/> Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="tx-list">
                    <div className="tx-ledger-header">
                      <span>Description</span><span>Date</span><span>Recipient</span><span>Amount</span><span>Status</span>
                    </div>
                    {filteredTxs.map(tx => {
                      const parts = tx.description.split(' — ');
                      const recipient = parts.length > 1 ? parts[1] : (tx.type === 'addition' ? 'Self' : 'Platform');
                      return (
                        <div key={tx.id} className="tx-item">
                          <div className="tx-info">
                            <div className={`tx-icon ${tx.type}`}>
                              {tx.type === 'addition' && <ArrowDownLeft size={18}/>}
                              {tx.type === 'withdrawal' && <ArrowUpRight size={18}/>}
                              {tx.type === 'payment' && <RefreshCcw size={18}/>}
                            </div>
                            <div className="tx-details">
                              <h4>{parts[0]}</h4>
                              <p>{tx.id}</p>
                            </div>
                          </div>
                          <span className="tx-ledger-date">{tx.date}</span>
                          <span className="tx-ledger-recipient">{recipient}</span>
                          <div className={`tx-amount ${tx.amount > 0 ? 'positive' : ''}`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount), true)}
                          </div>
                          <span className={`tx-status-pill ${tx.status === 'Completed' ? 'done' : 'pending'}`}>{tx.status}</span>
                        </div>
                      );
                    })}
                    {filteredTxs.length === 0 && (
                      <div className="gn-empty" style={{ padding: '40px' }}>No transactions found.</div>
                    )}
                  </div>
                </GlassCard>

                {/* RIGHT COL: ACCOUNTS & SETTINGS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Linked Accounts */}
                  <GlassCard className="dashboard-panel">
                    <h3 className="wallet-section-title">Linked Accounts</h3>
                    
                    <div className="accounts-list">
                      {linkedAccounts.map(acc => (
                        <div key={acc.id} className="linked-acc">
                          <div className="linked-acc-icon">{acc.icon}</div>
                          <div className="linked-acc-info">
                            <h4>{acc.name}</h4>
                            <p>{acc.details}</p>
                          </div>
                          <div className="acc-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                            <div style={{ color: '#10b981' }}><CheckCircle2 size={16}/></div>
                            <button className="delete-acc-btn" onClick={() => handleDeleteAccount(acc.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="gn-btn-sm outline" style={{ width: '100%', marginTop: '8px' }} onClick={() => setShowAddAccountModal(true)}>
                      <Plus size={14} style={{ marginRight: '6px' }}/> Link New Account
                    </button>
                  </GlassCard>

                  {/* Wallet Settings */}
                  <GlassCard className="dashboard-panel">
                    <h3 className="wallet-section-title"><Settings size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }}/> Wallet Settings</h3>
                    
                    <div className="wallet-settings-row">
                      <div className="wallet-settings-info">
                        <h4>Auto-Reload</h4>
                        <p>When balance drops below $50</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    <div className="wallet-settings-row">
                      <div className="wallet-settings-info">
                        <h4>Email Receipts</h4>
                        <p>Receive transaction invoices</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>

            {/* ── MODALS ── */}
            <AnimatePresence>
              {/* TOP UP MODAL */}
              {showTopUpModal && (
                <div className="modal-overlay" onClick={() => setShowTopUpModal(false)}>
                  <motion.div 
                    className="glass-modal top-up-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="modal-header">
                      <h3>Add Money to Wallet</h3>
                      <button onClick={() => setShowTopUpModal(false)}><X size={20}/></button>
                    </div>
                    
                    <div className="modal-body">
                      <div className="amount-input-group">
                        <label>Enter Amount</label>
                        <div className="amount-input-wrapper">
                          <span>{formatCurrency(0).charAt(0)}</span>
                          <input 
                            type="number" 
                            value={topUpAmount} 
                            onChange={e => setTopUpAmount(e.target.value)}
                            placeholder="500"
                          />
                        </div>
                      </div>

                      <div className="payment-methods">
                        <label>Select Payment Source</label>
                        <div className="methods-grid">
                          <button className={`method-btn ${paymentMethod==='UPI'?'active':''}`} onClick={()=>setPaymentMethod('UPI')} title="Pay via any UPI app">
                            <Smartphone size={20}/><span>UPI</span>
                          </button>
                          <button className={`method-btn ${paymentMethod==='Card'?'active':''}`} onClick={()=>setPaymentMethod('Card')} title="Pay via Credit or Debit Card">
                            <CreditCard size={20}/><span>Card</span>
                          </button>
                          <button className={`method-btn ${paymentMethod==='NetBanking'?'active':''}`} onClick={()=>setPaymentMethod('NetBanking')} title="Pay via your Bank's Net Banking portal">
                            <Building size={20}/><span>Net Banking</span>
                          </button>
                          <button className={`method-btn ${paymentMethod==='Wallet'?'active':''}`} onClick={()=>setPaymentMethod('Wallet')} title="Transfer from PhonePe or PayTM">
                            <Wallet2 size={20}/><span>Wallet</span>
                          </button>
                        </div>
                      </div>

                      {paymentMethod==='UPI' && (
                        <div className="method-detail-input">
                          <input type="text" placeholder="Enter UPI ID (e.g. name@okaxis)" value={upiId} onChange={e=>setUpiId(e.target.value)}/>
                          <small className="method-hint">✓ Supports GPay, PhonePe, Paytm, BHIM</small>
                        </div>
                      )}
                      {paymentMethod==='Card' && (
                        <div className="card-fields">
                          <input className="card-input" placeholder="Card Number" maxLength={19} value={cardNumber} onChange={e=>setCardNumber(e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim())}/>
                          <div className="card-row">
                            <input className="card-input" placeholder="MM / YY" maxLength={5} value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)}/>
                            <input className="card-input" placeholder="CVV" maxLength={3} type="password" value={cardCvv} onChange={e=>setCardCvv(e.target.value)}/>
                          </div>
                          <input className="card-input" placeholder="Name on Card" value={cardName} onChange={e=>setCardName(e.target.value)}/>
                          <small className="method-hint">🔒 Your card details are encrypted end-to-end</small>
                        </div>
                      )}
                      {paymentMethod==='NetBanking' && (
                        <div className="method-detail-input">
                          <select className="nb-select" value={selectedBank} onChange={e=>setSelectedBank(e.target.value)}>
                            <option value="">Select your Bank…</option>
                            {BANKS.map(b=><option key={b} value={b}>{b}</option>)}
                          </select>
                          <small className="method-hint">You will be redirected to your bank's secure portal</small>
                        </div>
                      )}
                      {paymentMethod==='Wallet' && (
                        <div className="method-detail-info">
                          <p>Transfer from connected PayTM or PhonePe wallet.</p>
                        </div>
                      )}
                    </div>

                    <div className="modal-footer">
                      <GlassButton 
                        variant="primary" 
                        style={{ width: '100%' }} 
                        onClick={() => handleAddFunds(Number(topUpAmount), paymentMethod)}
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : `Fund ${formatCurrency(Number(topUpAmount), true)}`}
                      </GlassButton>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* TRANSFER MONEY MODAL */}
              {showTransferModal && (
                <div className="modal-overlay" onClick={()=>setShowTransferModal(false)}>
                  <motion.div className="glass-modal top-up-modal" initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0,y:20}} onClick={e=>e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>{transferStep==='confirm'?'Confirm Transfer':'Transfer Money'}</h3>
                      <button onClick={()=>setShowTransferModal(false)}><X size={20}/></button>
                    </div>
                    {transferSuccess ? (
                      <div className="modal-success"><CheckCircle2 size={48}/><p>Transfer Successful!</p></div>
                    ) : transferStep==='input' ? (
                      <div className="modal-body">
                        <div className="form-group">
                          <label>To (UPI ID or saved wallet)</label>
                          <input type="text" placeholder="e.g. friend@okaxis or select below" value={transferTo} onChange={e=>setTransferTo(e.target.value)}/>
                        </div>
                        <div className="form-group">
                          <label>Saved Wallets</label>
                          <div className="saved-wallets">
                            {['team@vijwallet','recruiter@vijwallet','partner@upi'].map(w=>(
                              <button key={w} className={`saved-wallet-chip ${transferTo===w?'active':''}`} onClick={()=>setTransferTo(w)}>{w}</button>
                            ))}
                          </div>
                        </div>
                        <div className="amount-input-group">
                          <label>Amount</label>
                          <div className="amount-input-wrapper"><span>₹</span><input type="number" value={transferAmount} onChange={e=>setTransferAmount(e.target.value)} placeholder="100"/></div>
                        </div>
                        <div className="form-group">
                          <label>Note (optional)</label>
                          <input type="text" placeholder="e.g. Freelance payment" value={transferNote} onChange={e=>setTransferNote(e.target.value)}/>
                        </div>
                        <div className="modal-footer">
                          <GlassButton variant="primary" style={{width:'100%'}} onClick={()=>setTransferStep('confirm')} disabled={!transferTo||!transferAmount}>
                            Review Transfer
                          </GlassButton>
                        </div>
                      </div>
                    ) : (
                      <div className="modal-body">
                        <div className="transfer-confirm-box">
                          <div className="confirm-row"><span>To</span><strong>{transferTo}</strong></div>
                          <div className="confirm-row"><span>Amount</span><strong>₹{transferAmount}</strong></div>
                          {transferNote && <div className="confirm-row"><span>Note</span><strong>{transferNote}</strong></div>}
                          <div className="confirm-row"><span>Fee</span><strong>₹0 (Free)</strong></div>
                        </div>
                        <div className="modal-footer" style={{flexDirection:'column',gap:'10px'}}>
                          <GlassButton variant="primary" style={{width:'100%'}} onClick={handleTransfer} disabled={processing}>{processing?'Transferring…':'Confirm Transfer'}</GlassButton>
                          <GlassButton style={{width:'100%'}} onClick={()=>setTransferStep('input')}>Edit Details</GlassButton>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* PAY WITH VIJWALLET MODAL */}
              {showPayModal && (
                <div className="modal-overlay" onClick={()=>setShowPayModal(false)}>
                  <motion.div className="glass-modal top-up-modal" initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0,y:20}} onClick={e=>e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Pay with VijWallet</h3>
                      <button onClick={()=>setShowPayModal(false)}><X size={20}/></button>
                    </div>
                    {paySuccess ? (
                      <div className="modal-success"><CheckCircle2 size={48}/><p>Payment Successful! 🎉</p></div>
                    ) : (
                      <div className="modal-body">
                        <div className="pay-wallet-summary">
                          <Wallet2 size={32} style={{color:'var(--accent-azure)'}}/>
                          <div><h4>VIJ Premium Plan</h4><p>Access all features for 30 days</p></div>
                        </div>
                        <div className="transfer-confirm-box">
                          <div className="confirm-row"><span>Plan</span><strong>VIJ Premium</strong></div>
                          <div className="confirm-row"><span>Amount</span><strong>₹99</strong></div>
                          <div className="confirm-row"><span>Wallet Balance</span><strong>{formatCurrency(walletBalance)}</strong></div>
                        </div>
                        {walletBalance < 99 && <p className="pay-error">⚠️ Insufficient balance. Please add funds first.</p>}
                        <div className="modal-footer">
                          <GlassButton variant="primary" style={{width:'100%'}} onClick={handlePayWithWallet} disabled={processing||walletBalance<99}>{processing?'Processing…':'Confirm Payment ₹99'}</GlassButton>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* ADD ACCOUNT MODAL */}
              {showAddAccountModal && (
                <div className="modal-overlay" onClick={() => setShowAddAccountModal(false)}>
                  <motion.div 
                    className="glass-modal add-account-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="modal-header">
                      <h3>Link New Account</h3>
                      <button onClick={() => setShowAddAccountModal(false)}><X size={20}/></button>
                    </div>
                    
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Account Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. ICICI Savings" 
                          value={newAccName}
                          onChange={e => setNewAccName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Type</label>
                        <select value={newAccType} onChange={e => setNewAccType(e.target.value as 'Bank' | 'Card')}>
                          <option value="Bank">Bank Account</option>
                          <option value="Card">Debit/Credit Card</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Details</label>
                        <input 
                          type="text" 
                          placeholder="e.g. •••• 5542" 
                          value={newAccDetails}
                          onChange={e => setNewAccDetails(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <GlassButton variant="primary" style={{ width: '100%' }} onClick={handleAddAccount}>
                        Link Account
                      </GlassButton>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </PageTransition>
  );
};

