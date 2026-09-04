// import React, { useState, useEffect } from 'react';
// import { getBorrowingRequests } from '../services/api';

// export default function LoansView() {
//   const [activeTab, setActiveTab] = useState('borrowed');
//   const [loans, setLoans] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchLoans();
//   }, [activeTab]);

//   const fetchLoans = async () => {
//     try {
//       const type = activeTab === 'borrowed' ? 'outgoing' : 'incoming';
//       const data = await getBorrowingRequests(type);
//       setLoans(data.filter((r) => r.status !== 'pending'));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const statusColor = (status) => (status === 'approved' ? '#2e7d32' : '#d32f2f');
//   const statusBg = (status) => (status === 'approved' ? '#e8f5e9' : '#fdecea');

//   return (
//     <div className="container" style={{ marginLeft: '260px', padding: '30px', width: 'calc(100% - 260px)', boxSizing: 'border-box' }}>
//       <div style={{ marginBottom: '20px' }}>
//         <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Loan History</h1>
//         <p style={{ fontSize: '14px', color: '#666' }}>Approved and rejected borrowing requests.</p>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//         <button
//           onClick={() => setActiveTab('borrowed')}
//           style={{
//             padding: '8px 16px',
//             borderRadius: '20px',
//             border: 'none',
//             background: activeTab === 'borrowed' ? '#1b4332' : '#f0f0f0',
//             color: activeTab === 'borrowed' ? '#fff' : '#333',
//             cursor: 'pointer',
//             fontWeight: '500'
//           }}
//         >
//           Items I Borrowed
//         </button>
//         <button
//           onClick={() => setActiveTab('lent')}
//           style={{
//             padding: '8px 16px',
//             borderRadius: '20px',
//             border: 'none',
//             background: activeTab === 'lent' ? '#1b4332' : '#f0f0f0',
//             color: activeTab === 'lent' ? '#fff' : '#333',
//             cursor: 'pointer',
//             fontWeight: '500'
//           }}
//         >
//           Items I Lent Out
//         </button>
//       </div>

//       {/* Content Container */}
//       <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '20px' }}>
//         <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
//           {activeTab === 'borrowed' ? 'Items I Borrowed' : 'Items I Lent Out'}
//         </h2>
//         <p style={{ fontSize: '12px', color: '#777', marginBottom: '20px' }}>
//           {activeTab === 'borrowed' ? 'Equipment you borrowed from your neighbours.' : 'Equipment you are currently lending to neighbours.'}
//         </p>

//         {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

//         {loans.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '40px 0' }}>
//             <div style={{ width: '40px', height: '40px', background: '#fdecea', color: '#d32f2f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 'bold' }}>📦</div>
//             <p style={{ color: '#333', fontWeight: '500' }}>No decided requests yet</p>
//             <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Approved or rejected requests will show up here.</p>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//             {loans.map((r) => (
//               <div key={r.id} style={{ border: '1px solid #eaeaea', padding: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
//                 <div>
//                   <p style={{ fontWeight: 'bold', color: '#333' }}>Item #{r.equipment_id}</p>
//                   <p style={{ fontSize: '12px', color: '#666' }}>
//                     {r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}
//                   </p>
//                 </div>
//                 <span style={{
//                   fontSize: '12px',
//                   fontWeight: '500',
//                   padding: '4px 12px',
//                   borderRadius: '20px',
//                   textTransform: 'capitalize',
//                   color: statusColor(r.status),
//                   background: statusBg(r.status),
//                 }}>
//                   {r.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }