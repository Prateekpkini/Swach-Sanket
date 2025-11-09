// import React, { useState } from 'react';
// import { Plus, Trash2, MapPin, TrendingUp, AlertCircle, CheckCircle, Mail, Lock, Eye, EyeOff, Copy, Check } from 'lucide-react';

// export default function MRFDashboard() {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showAddMRF, setShowAddMRF] = useState(false);
//   const [copiedPassword, setCopiedPassword] = useState(null);
//   const [showPassword, setShowPassword] = useState({});
  
//   const [mrfs, setMrfs] = useState([
//     {
//       id: 1,
//       name: 'Central MRF Station',
//       email: 'central.mrf@zillapanchayat.gov',
//       password: 'MRF#2024$Cen',
//       location: 'Zone A - Main Street',
//       capacity: 500,
//       currentLoad: 380,
//       status: 'operational',
//       collections: 145,
//       lastCollection: '2 hours ago',
//       createdDate: '2024-01-15'
//     },
//     {
//       id: 2,
//       name: 'East Side MRF',
//       email: 'eastside.mrf@zillapanchayat.gov',
//       password: 'MRF#2024$Eas',
//       location: 'Zone B - Industrial Area',
//       capacity: 400,
//       currentLoad: 320,
//       status: 'operational',
//       collections: 98,
//       lastCollection: '4 hours ago',
//       createdDate: '2024-02-20'
//     },
//     {
//       id: 3,
//       name: 'West Point MRF',
//       email: 'westpoint.mrf@zillapanchayat.gov',
//       password: 'MRF#2024$Wes',
//       location: 'Zone C - Residential',
//       capacity: 350,
//       currentLoad: 290,
//       status: 'maintenance',
//       collections: 76,
//       lastCollection: '1 day ago',
//       createdDate: '2024-03-10'
//     },
//     {
//       id: 4,
//       name: 'North Hub MRF',
//       email: 'northhub.mrf@zillapanchayat.gov',
//       password: 'MRF#2024$Nor',
//       location: 'Zone D - Commercial',
//       capacity: 450,
//       currentLoad: 180,
//       status: 'operational',
//       collections: 112,
//       lastCollection: '3 hours ago',
//       createdDate: '2024-04-05'
//     }
//   ]);

//   const [collections] = useState([
//     { id: 1, mrfName: 'Central MRF Station', type: 'Plastic', weight: 45, date: '2025-11-08', time: '09:30' },
//     { id: 2, mrfName: 'East Side MRF', type: 'Paper', weight: 78, date: '2025-11-08', time: '10:15' },
//     { id: 3, mrfName: 'Central MRF Station', type: 'Metal', weight: 32, date: '2025-11-08', time: '11:00' },
//     { id: 4, mrfName: 'North Hub MRF', type: 'Glass', weight: 56, date: '2025-11-08', time: '08:45' },
//     { id: 5, mrfName: 'West Point MRF', type: 'Plastic', weight: 41, date: '2025-11-07', time: '14:20' },
//     { id: 6, mrfName: 'East Side MRF', type: 'Organic', weight: 92, date: '2025-11-07', time: '16:30' }
//   ]);

//   const [newMRF, setNewMRF] = useState({
//     name: '',
//     email: '',
//     location: '',
//     capacity: ''
//   });

//   const [generatedPassword, setGeneratedPassword] = useState('');
//   const [formStep, setFormStep] = useState(1);

//   const generatePassword = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
//     let password = 'MRF#';
//     for (let i = 0; i < 8; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return password;
//   };

//   const totalCapacity = mrfs.reduce((sum, mrf) => sum + mrf.capacity, 0);
//   const totalLoad = mrfs.reduce((sum, mrf) => sum + mrf.currentLoad, 0);
//   const totalCollections = collections.length;
//   const operationalMRFs = mrfs.filter(m => m.status === 'operational').length;

//   const handleNextStep = () => {
//     if (newMRF.name && newMRF.email && newMRF.location && newMRF.capacity) {
//       const password = generatePassword();
//       setGeneratedPassword(password);
//       setFormStep(2);
//     }
//   };

//   const handleAddMRF = () => {
//     const newId = Math.max(...mrfs.map(m => m.id)) + 1;
//     setMrfs([...mrfs, {
//       id: newId,
//       name: newMRF.name,
//       email: newMRF.email,
//       password: generatedPassword,
//       location: newMRF.location,
//       capacity: parseInt(newMRF.capacity),
//       currentLoad: 0,
//       status: 'operational',
//       collections: 0,
//       lastCollection: 'Never',
//       createdDate: new Date().toISOString().split('T')[0]
//     }]);
//     setNewMRF({ name: '', email: '', location: '', capacity: '' });
//     setGeneratedPassword('');
//     setFormStep(1);
//     setShowAddMRF(false);
//   };

//   const handleCloseModal = () => {
//     setShowAddMRF(false);
//     setNewMRF({ name: '', email: '', location: '', capacity: '' });
//     setGeneratedPassword('');
//     setFormStep(1);
//   };

//   const copyToClipboard = (text, id) => {
//     navigator.clipboard.writeText(text);
//     setCopiedPassword(id);
//     setTimeout(() => setCopiedPassword(null), 2000);
//   };

//   const togglePasswordVisibility = (id) => {
//     setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleDeleteMRF = (id) => {
//     if (window.confirm('Are you sure you want to delete this MRF facility?')) {
//       setMrfs(mrfs.filter(mrf => mrf.id !== id));
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'operational': return 'bg-emerald-100 text-emerald-700';
//       case 'maintenance': return 'bg-amber-100 text-amber-700';
//       case 'offline': return 'bg-rose-100 text-rose-700';
//       default: return 'bg-slate-100 text-slate-700';
//     }
//   };

//   const getLoadPercentage = (current, capacity) => {
//     return ((current / capacity) * 100).toFixed(1);
//   };

//   const getLoadColor = (percentage) => {
//     if (percentage >= 80) return 'bg-rose-500';
//     if (percentage >= 60) return 'bg-amber-500';
//     return 'bg-emerald-500';
//   };

//   const getWasteTypeColor = (type) => {
//     const colors = {
//       'Plastic': 'bg-blue-100 text-blue-700',
//       'Paper': 'bg-amber-100 text-amber-700',
//       'Metal': 'bg-slate-100 text-slate-700',
//       'Glass': 'bg-cyan-100 text-cyan-700',
//       'Organic': 'bg-green-100 text-green-700'
//     };
//     return colors[type] || 'bg-gray-100 text-gray-700';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Professional Header */}
//         <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
//                   <span className="text-3xl">🏛️</span>
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-slate-800">Zilla Panchayat</h1>
//                   <p className="text-slate-600">Material Recovery Facility Management</p>
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-slate-500">Last Updated</p>
//               <p className="text-lg font-semibold text-slate-800">Nov 08, 2025</p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <MapPin className="text-blue-600" size={24} />
//               </div>
//               <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
//                 {operationalMRFs}/{mrfs.length} Active
//               </span>
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">Total MRF Facilities</p>
//             <p className="text-4xl font-bold text-slate-800">{mrfs.length}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-emerald-100 p-3 rounded-lg">
//                 <CheckCircle className="text-emerald-600" size={24} />
//               </div>
//               <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
//                 +12 Today
//               </span>
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">Total Collections</p>
//             <p className="text-4xl font-bold text-slate-800">{totalCollections}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <TrendingUp className="text-purple-600" size={24} />
//               </div>
//               <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
//                 Capacity
//               </span>
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">Total Capacity</p>
//             <p className="text-4xl font-bold text-slate-800">{totalCapacity}<span className="text-xl text-slate-500">kg</span></p>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-amber-100 p-3 rounded-lg">
//                 <AlertCircle className="text-amber-600" size={24} />
//               </div>
//               <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
//                 Optimal
//               </span>
//             </div>
//             <p className="text-slate-600 text-sm font-medium mb-1">Average Utilization</p>
//             <p className="text-4xl font-bold text-slate-800">{((totalLoad / totalCapacity) * 100).toFixed(1)}<span className="text-xl text-slate-500">%</span></p>
//           </div>
//         </div>

//         {/* Main Content Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
//           {/* Tabs */}
//           <div className="border-b border-slate-200">
//             <div className="flex px-6">
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={`py-4 px-6 font-semibold border-b-2 transition-all ${
//                   activeTab === 'overview'
//                     ? 'border-blue-600 text-blue-600'
//                     : 'border-transparent text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 MRF Facilities
//               </button>
//               <button
//                 onClick={() => setActiveTab('collections')}
//                 className={`py-4 px-6 font-semibold border-b-2 transition-all ${
//                   activeTab === 'collections'
//                     ? 'border-blue-600 text-blue-600'
//                     : 'border-transparent text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 Collection Records
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'overview' && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-slate-800">Registered MRF Facilities</h2>
//                     <p className="text-slate-600 text-sm mt-1">Manage and monitor all Material Recovery Facilities</p>
//                   </div>
//                   <button
//                     onClick={() => setShowAddMRF(true)}
//                     className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-semibold"
//                   >
//                     <Plus size={20} />
//                     Register New MRF
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {mrfs.map((mrf) => {
//                     const loadPercentage = getLoadPercentage(mrf.currentLoad, mrf.capacity);
//                     return (
//                       <div key={mrf.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all">
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                               <h3 className="text-xl font-bold text-slate-800">{mrf.name}</h3>
//                               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mrf.status)}`}>
//                                 {mrf.status.charAt(0).toUpperCase() + mrf.status.slice(1)}
//                               </span>
//                             </div>
//                             <div className="flex flex-col gap-1 text-sm text-slate-600">
//                               <p className="flex items-center gap-2">
//                                 <MapPin size={14} className="text-slate-400" />
//                                 {mrf.location}
//                               </p>
//                               <p className="flex items-center gap-2">
//                                 <Mail size={14} className="text-slate-400" />
//                                 {mrf.email}
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => handleDeleteMRF(mrf.id)}
//                             className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="md:col-span-2">
//                             <div className="mb-2">
//                               <div className="flex justify-between text-sm mb-2">
//                                 <span className="font-medium text-slate-700">Capacity Utilization</span>
//                                 <span className="font-bold text-slate-800">{loadPercentage}%</span>
//                               </div>
//                               <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
//                                 <div
//                                   className={`h-3 rounded-full transition-all ${getLoadColor(loadPercentage)}`}
//                                   style={{ width: `${loadPercentage}%` }}
//                                 ></div>
//                               </div>
//                               <p className="text-xs text-slate-500 mt-2">
//                                 {mrf.currentLoad}kg of {mrf.capacity}kg capacity used
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex gap-4 md:justify-end items-center">
//                             <div className="text-center">
//                               <p className="text-xs text-slate-600 mb-1">Collections</p>
//                               <p className="text-2xl font-bold text-slate-800">{mrf.collections}</p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-xs text-slate-600 mb-1">Last Active</p>
//                               <p className="text-sm font-semibold text-slate-800">{mrf.lastCollection}</p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mt-4 pt-4 border-t border-slate-200">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <Lock size={14} className="text-slate-400" />
//                               <span className="text-xs text-slate-600">Login Credentials:</span>
//                               <span className="text-sm font-mono bg-white px-3 py-1 rounded border border-slate-200">
//                                 {showPassword[mrf.id] ? mrf.password : '••••••••••'}
//                               </span>
//                               <button
//                                 onClick={() => togglePasswordVisibility(mrf.id)}
//                                 className="text-slate-400 hover:text-slate-600 p-1"
//                               >
//                                 {showPassword[mrf.id] ? <EyeOff size={14} /> : <Eye size={14} />}
//                               </button>
//                               <button
//                                 onClick={() => copyToClipboard(mrf.password, mrf.id)}
//                                 className="text-slate-400 hover:text-blue-600 p-1"
//                               >
//                                 {copiedPassword === mrf.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
//                               </button>
//                             </div>
//                             <span className="text-xs text-slate-500">Registered: {mrf.createdDate}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'collections' && (
//               <div>
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-slate-800">Collection Activity Log</h2>
//                   <p className="text-slate-600 text-sm mt-1">Track all waste collection transactions across facilities</p>
//                 </div>
//                 <div className="overflow-x-auto rounded-xl border border-slate-200">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-slate-50 border-b border-slate-200">
//                         <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Collection ID</th>
//                         <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">MRF Facility</th>
//                         <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Waste Category</th>
//                         <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Weight</th>
//                         <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Date</th>
//                         <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Time</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {collections.map((collection, index) => (
//                         <tr key={collection.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
//                           <td className="py-4 px-6 text-slate-600 font-medium">#{collection.id.toString().padStart(4, '0')}</td>
//                           <td className="py-4 px-6 text-slate-800 font-medium">{collection.mrfName}</td>
//                           <td className="py-4 px-6">
//                             <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getWasteTypeColor(collection.type)}`}>
//                               {collection.type}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 text-slate-800 font-bold">{collection.weight} kg</td>
//                           <td className="py-4 px-6 text-slate-600">{collection.date}</td>
//                           <td className="py-4 px-6 text-slate-600">{collection.time}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add MRF Modal */}
//       {showAddMRF && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
//             {formStep === 1 ? (
//               <div className="p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
//                     <Plus className="text-white" size={24} />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-slate-800">Register New MRF</h2>
//                     <p className="text-slate-600 text-sm">Fill in the facility details</p>
//                   </div>
//                 </div>

//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">
//                       Facility Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={newMRF.name}
//                       onChange={(e) => setNewMRF({...newMRF, name: e.target.value})}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="e.g., South Zone MRF"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">
//                       Official Email Address *
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
//                       <input
//                         type="email"
//                         value={newMRF.email}
//                         onChange={(e) => setNewMRF({...newMRF, email: e.target.value})}
//                         className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         placeholder="facility@zillapanchayat.gov"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">
//                       Location *
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
//                       <input
//                         type="text"
//                         value={newMRF.location}
//                         onChange={(e) => setNewMRF({...newMRF, location: e.target.value})}
//                         className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         placeholder="e.g., Zone E - Market Area"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">
//                       Storage Capacity (kg) *
//                     </label>
//                     <input
//                       type="number"
//                       value={newMRF.capacity}
//                       onChange={(e) => setNewMRF({...newMRF, capacity: e.target.value})}
//                       className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="e.g., 500"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-3 mt-8">
//                   <button
//                     onClick={handleCloseModal}
//                     className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleNextStep}
//                     disabled={!newMRF.name || !newMRF.email || !newMRF.location || !newMRF.capacity}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Generate Credentials
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="p-8">
//                 <div className="text-center mb-6">
//                   <div className="inline-block bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-full mb-4">
//                     <CheckCircle className="text-white" size={32} />
//                   </div>
//                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Credentials Generated!</h2>
//                   <p className="text-slate-600">Save these credentials securely</p>
//                 </div>

//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-xs font-semibold text-slate-600 mb-2">FACILITY NAME</p>
//                       <p className="text-lg font-bold text-slate-800">{newMRF.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold text-slate-600 mb-2">EMAIL ADDRESS</p>
//                       <p className="text-sm font-mono text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200">{newMRF.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold text-slate-600 mb-2">AUTO-GENERATED PASSWORD</p>
//                       <div className="flex items-center gap-2">
//                         <p className="flex-1 text-sm font-mono font-bold text-blue-600 bg-white px-3 py-2 rounded-lg border-2 border-blue-300">{generatedPassword}</p>
//                         <button
//                           onClick={() => copyToClipboard(generatedPassword, 'new')}
//                           className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
//                         >
//                           {copiedPassword === 'new' ? <Check size={18} /> : <Copy size={18} />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
//                   <div className="flex gap-3">
//                     <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
//                     <p className="text-sm text-amber-800">
//                       <strong>Important:</strong> Please save these credentials securely. The password cannot be recovered later. Share with the facility administrator only.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleCloseModal}
//                     className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAddMRF}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
//                   >
//                     Complete Registration
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, TrendingUp, AlertCircle, CheckCircle, Mail, Lock, Eye, EyeOff, Copy, Check, RefreshCw } from 'lucide-react';

export default function MRFDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMRF, setShowAddMRF] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  
  const [mrfs, setMrfs] = useState([
    {
      id: 1,
      name: 'Yedapadavu MRF',
      plantId: 'yedapadavu',
      email: 'yedapadavu.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Yed',
      location: 'Yedapadavu, Karnataka',
      capacity: 500,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Narikombu MRF',
      plantId: 'narikombu',
      email: 'narikombu.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Nar',
      location: 'Narikombu, Karnataka',
      capacity: 400,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Ujire MRF',
      plantId: 'ujire',
      email: 'ujire.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Uji',
      location: 'Ujire, Karnataka',
      capacity: 350,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Kedambadi MRF',
      plantId: 'kedambadi',
      email: 'kedambadi.mrf@zillapanchayat.gov',
      password: 'MRF#2024$Ked',
      location: 'Kedambadi, Karnataka',
      capacity: 450,
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Loading...',
      createdDate: '2024-04-05'
    }
  ]);

  const [collections] = useState([
    { id: 1, mrfName: 'Yedapadavu MRF', type: 'Plastic', weight: 45, date: '2025-11-08', time: '09:30' },
    { id: 2, mrfName: 'Narikombu MRF', type: 'Paper', weight: 78, date: '2025-11-08', time: '10:15' },
    { id: 3, mrfName: 'Yedapadavu MRF', type: 'Metal', weight: 32, date: '2025-11-08', time: '11:00' },
    { id: 4, mrfName: 'Kedambadi MRF', type: 'Glass', weight: 56, date: '2025-11-08', time: '08:45' },
    { id: 5, mrfName: 'Ujire MRF', type: 'Plastic', weight: 41, date: '2025-11-07', time: '14:20' },
    { id: 6, mrfName: 'Narikombu MRF', type: 'Organic', weight: 92, date: '2025-11-07', time: '16:30' }
  ]);

  const [newMRF, setNewMRF] = useState({
    name: '',
    email: '',
    location: '',
    capacity: ''
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formStep, setFormStep] = useState(1);

  // Fetch data from API
  useEffect(() => {
    fetchPlantData();
  }, [selectedDateRange]);

  const fetchPlantData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:5000"; // ⚠️ UPDATE THIS WITH YOUR ACTUAL API URL
      let url = `${API_BASE_URL}/api/entries/aggregate-all-plants`;
      
      if (selectedDateRange === 'today') {
        // Let backend default to today
        url += 'plants=yedapadavu,narikombu,ujire,kedambadi';
      } else if (selectedDateRange === 'week') {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        url += `from=${weekAgo.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}&plants=yedapadavu,narikombu,ujire,kedambadi`;
      } else if (selectedDateRange === 'month') {
        const today = new Date();
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        url += `from=${monthAgo.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}&plants=yedapadavu,narikombu,ujire,kedambadi`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      
      const data = await response.json();
      setApiData(data);
      
      // Update MRF data with API response
      if (data.counts && data.counts.perPlant) {
        setMrfs(prevMrfs => prevMrfs.map(mrf => {
          const plantData = data.counts.perPlant[mrf.plantId];
          if (plantData) {
            const totalWeight = Object.values(plantData).reduce((sum, val) => sum + val, 0);
            const itemCount = Object.keys(plantData).length;
            return {
              ...mrf,
              currentLoad: Math.round(totalWeight),
              collections: itemCount,
              lastCollection: 'Recently'
            };
          }
          return mrf;
        }));
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching plant data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = 'MRF#';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const totalCapacity = mrfs.reduce((sum, mrf) => sum + mrf.capacity, 0);
  const totalLoad = mrfs.reduce((sum, mrf) => sum + mrf.currentLoad, 0);
  const totalCollections = collections.length;
  const operationalMRFs = mrfs.filter(m => m.status === 'operational').length;

  const handleNextStep = () => {
    if (newMRF.name && newMRF.email && newMRF.location && newMRF.capacity) {
      const password = generatePassword();
      setGeneratedPassword(password);
      setFormStep(2);
    }
  };

  const handleAddMRF = () => {
    const newId = Math.max(...mrfs.map(m => m.id)) + 1;
    setMrfs([...mrfs, {
      id: newId,
      name: newMRF.name,
      email: newMRF.email,
      password: generatedPassword,
      location: newMRF.location,
      capacity: parseInt(newMRF.capacity),
      currentLoad: 0,
      status: 'operational',
      collections: 0,
      lastCollection: 'Never',
      createdDate: new Date().toISOString().split('T')[0]
    }]);
    setNewMRF({ name: '', email: '', location: '', capacity: '' });
    setGeneratedPassword('');
    setFormStep(1);
    setShowAddMRF(false);
  };

  const handleCloseModal = () => {
    setShowAddMRF(false);
    setNewMRF({ name: '', email: '', location: '', capacity: '' });
    setGeneratedPassword('');
    setFormStep(1);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPassword(id);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteMRF = (id) => {
    if (window.confirm('Are you sure you want to delete this MRF facility?')) {
      setMrfs(mrfs.filter(mrf => mrf.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return 'bg-emerald-100 text-emerald-700';
      case 'maintenance': return 'bg-amber-100 text-amber-700';
      case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getLoadPercentage = (current, capacity) => {
    return ((current / capacity) * 100).toFixed(1);
  };

  const getLoadColor = (percentage) => {
    if (percentage >= 80) return 'bg-rose-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      'Plastic': 'bg-blue-100 text-blue-700',
      'Paper': 'bg-amber-100 text-amber-700',
      'Metal': 'bg-slate-100 text-slate-700',
      'Glass': 'bg-cyan-100 text-cyan-700',
      'Organic': 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                  <span className="text-3xl">🏛️</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Zilla Panchayat</h1>
                  <p className="text-slate-600">Material Recovery Facility Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Data Range</p>
                <select 
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="text-sm font-semibold text-slate-800 border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <button
                onClick={fetchPlantData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="text-rose-600" size={18} />
              <p className="text-sm text-rose-800">Error loading data: {error}</p>
            </div>
          )}
          
          {apiData && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-medium">
                ✓ Showing data from {apiData.meta?.entriesCount || 0} entries
                {apiData.query?.dateKey && ` for ${apiData.query.dateKey}`}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {operationalMRFs}/{mrfs.length} Active
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total MRF Facilities</p>
            <p className="text-4xl font-bold text-slate-800">{mrfs.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Live Data
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Collections</p>
            <p className="text-4xl font-bold text-slate-800">{totalCollections}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Capacity
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Capacity</p>
            <p className="text-4xl font-bold text-slate-800">{totalCapacity}<span className="text-xl text-slate-500">kg</span></p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                ((totalLoad / totalCapacity) * 100) > 70 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
              }`}>
                {((totalLoad / totalCapacity) * 100) > 70 ? 'High' : 'Optimal'}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Current Load</p>
            <p className="text-4xl font-bold text-slate-800">{totalLoad}<span className="text-xl text-slate-500">kg</span></p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 font-semibold border-b-2 transition-all ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                MRF Facilities
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`py-4 px-6 font-semibold border-b-2 transition-all ${
                  activeTab === 'collections'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Collection Records
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Registered MRF Facilities</h2>
                    <p className="text-slate-600 text-sm mt-1">Live data from Material Recovery Facilities</p>
                  </div>
                  <button
                    onClick={() => setShowAddMRF(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-semibold"
                  >
                    <Plus size={20} />
                    Register New MRF
                  </button>
                </div>

                {/* API Data Summary Cards */}
                {apiData && apiData.counts && apiData.counts.perPlant && Object.keys(apiData.counts.perPlant).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {Object.entries(apiData.counts.perPlant).map(([plantId, data]) => {
                      const totalWeight = Object.values(data).reduce((sum, val) => sum + val, 0);
                      const itemTypes = Object.keys(data).length;
                      return (
                        <div key={plantId} className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                          <h4 className="font-bold text-slate-800 capitalize mb-2">{plantId}</h4>
                          <p className="text-2xl font-bold text-emerald-600">{totalWeight.toFixed(1)} kg</p>
                          <p className="text-xs text-slate-600 mt-1">{itemTypes} waste categories</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Overall Summary */}
                {apiData && apiData.counts && apiData.counts.overall && Object.keys(apiData.counts.overall).length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Waste Collection Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {Object.entries(apiData.counts.overall).map(([wasteName, weight]) => (
                        <div key={wasteName} className="bg-white rounded-lg p-3 border border-blue-100">
                          <p className="text-xs text-slate-600 mb-1 truncate" title={wasteName}>{wasteName}</p>
                          <p className="text-lg font-bold text-blue-600">{weight} kg</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {mrfs.map((mrf) => {
                    const loadPercentage = getLoadPercentage(mrf.currentLoad, mrf.capacity);
                    return (
                      <div key={mrf.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-800">{mrf.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mrf.status)}`}>
                                {mrf.status.charAt(0).toUpperCase() + mrf.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                              <p className="flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400" />
                                {mrf.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400" />
                                {mrf.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMRF(mrf.id)}
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <div className="mb-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-700">Capacity Utilization</span>
                                <span className="font-bold text-slate-800">{loadPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all ${getLoadColor(loadPercentage)}`}
                                  style={{ width: `${loadPercentage}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                {mrf.currentLoad}kg of {mrf.capacity}kg capacity used
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 md:justify-end items-center">
                            <div className="text-center">
                              <p className="text-xs text-slate-600 mb-1">Collections</p>
                              <p className="text-2xl font-bold text-slate-800">{mrf.collections}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 mb-1">Last Active</p>
                              <p className="text-sm font-semibold text-slate-800">{mrf.lastCollection}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Lock size={14} className="text-slate-400" />
                              <span className="text-xs text-slate-600">Login Credentials:</span>
                              <span className="text-sm font-mono bg-white px-3 py-1 rounded border border-slate-200">
                                {showPassword[mrf.id] ? mrf.password : '••••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(mrf.id)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                {showPassword[mrf.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(mrf.password, mrf.id)}
                                className="text-slate-400 hover:text-blue-600 p-1"
                              >
                                {copiedPassword === mrf.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <span className="text-xs text-slate-500">Registered: {mrf.createdDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'collections' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Collection Activity Log</h2>
                  <p className="text-slate-600 text-sm mt-1">Track all waste collection transactions across facilities</p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Collection ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">MRF Facility</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Waste Category</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Weight</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Date</th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.map((collection, index) => (
                        <tr key={collection.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-4 px-6 text-slate-600 font-medium">#{collection.id.toString().padStart(4, '0')}</td>
                          <td className="py-4 px-6 text-slate-800 font-medium">{collection.mrfName}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getWasteTypeColor(collection.type)}`}>
                              {collection.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-800 font-bold">{collection.weight} kg</td>
                          <td className="py-4 px-6 text-slate-600">{collection.date}</td>
                          <td className="py-4 px-6 text-slate-600">{collection.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add MRF Modal */}
      {showAddMRF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {formStep === 1 ? (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                    <Plus className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Register New MRF</h2>
                    <p className="text-slate-600 text-sm">Fill in the facility details</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Facility Name *
                    </label>
                    <input
                      type="text"
                      value={newMRF.name}
                      onChange={(e) => setNewMRF({...newMRF, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., South Zone MRF"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Official Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={newMRF.email}
                        onChange={(e) => setNewMRF({...newMRF, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="facility@zillapanchayat.gov"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={newMRF.location}
                        onChange={(e) => setNewMRF({...newMRF, location: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., Zone E - Market Area"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Storage Capacity (kg) *
                    </label>
                    <input
                      type="number"
                      value={newMRF.capacity}
                      onChange={(e) => setNewMRF({...newMRF, capacity: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!newMRF.name || !newMRF.email || !newMRF.location || !newMRF.capacity}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Credentials
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-full mb-4">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Credentials Generated!</h2>
                  <p className="text-slate-600">Save these credentials securely</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">FACILITY NAME</p>
                      <p className="text-lg font-bold text-slate-800">{newMRF.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">EMAIL ADDRESS</p>
                      <p className="text-sm font-mono text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200">{newMRF.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">AUTO-GENERATED PASSWORD</p>
                      <div className="flex items-center gap-2">
                        <p className="flex-1 text-sm font-mono font-bold text-blue-600 bg-white px-3 py-2 rounded-lg border-2 border-blue-300">{generatedPassword}</p>
                        <button
                          onClick={() => copyToClipboard(generatedPassword, 'new')}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                        >
                          {copiedPassword === 'new' ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> Please save these credentials securely. The password cannot be recovered later. Share with the facility administrator only.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMRF}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
                  >
                    Complete Registration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}