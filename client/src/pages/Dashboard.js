// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";
// import { 
//   Calendar, 
//   TrendingUp, 
//   Save, 
//   Trash2, 
//   Search, 
//   X, 
//   LogOut, 
//   Plus,
//   Edit3,
//   Home,
//   Clock,
//   ArrowRight,
//   ChevronRight
// } from "lucide-react";

// const MATERIALS = [
//   { category: "Paper", items: ["News Paper", "White & colored paper", "Notebooks & other books", "Cardboard", "Plastic lined board/whiteboard"], color: "#8b5cf6" },
//   { category: "Plastic", items: ["PET bottle", "LDPE/HDPE carry bags", "Milk packets", "HDPE (shampoo bottles, cleaners)", "PVC (plumbing pipes)", "PP (Food containers)", "PP carry bags", "Laminates", "Tetra paks", "Thermocol/PS", "Paper cups/plates", "MLP"], color: "#3b82f6" },
//   { category: "Metal", items: ["Aluminium foils", "Aluminium/tin cans", "Other metals"], color: "#ef4444" },
//   { category: "Glass", items: ["Glass"], color: "#10b981" },
//   { category: "Rubber", items: ["Tyres", "Toys, gloves, others"], color: "#f59e0b" },
//   { category: "Textile", items: ["Textiles (clothes, bags, rags, etc.)"], color: "#ec4899" },
//   { category: "Ceramic", items: ["Ceramic (plates, cups, pots, etc.)"], color: "#14b8a6" },
//   { category: "Leather", items: ["Leather (belts, bags, tyres etc.)"], color: "#a855f7" },
//   { category: "Footwear", items: ["Sandals, shoes, etc."], color: "#6366f1" },
//   { category: "Fibrous organic", items: ["Coconut shells and husks"], color: "#84cc16" },
//   { category: "E-waste", items: ["All kinds of E-waste"], color: "#64748b" },
//   { category: "Others", items: ["Rejects (silt, hair, dust)"], color: "#78716c" },
// ];

// const flatMaterials = MATERIALS.flatMap(cat => 
//   cat.items.map(item => ({ name: item, category: cat.category, color: cat.color }))
// );

// export default function Dashboard() {
//   const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  
//   const [view, setView] = useState("dashboard");
//   const [entries, setEntries] = useState({});
//   const [data, setData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [notification, setNotification] = useState({ show: false, message: "" });
//   const [mode, setMode] = useState("easy");
//   const [categoryIdx, setCategoryIdx] = useState(0);
//   const [itemIdx, setItemIdx] = useState(0);
//   const [inputValue, setInputValue] = useState("");

//   // Load data on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("mrf_data");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setEntries(parsed);
//       setData(parsed[today] || {});
//     }
//   }, [today]);

//   // Auto-save helper
//   const autoSave = useCallback((newData) => {
//     const updated = { ...entries, [today]: newData };
//     localStorage.setItem("mrf_data", JSON.stringify(updated));
//     setEntries(updated);
//   }, [entries, today]);

//   // Notifications
//   const notify = useCallback((message) => {
//     setNotification({ show: true, message });
//     setTimeout(() => setNotification({ show: false, message: "" }), 2500);
//   }, []);

//   // Handle value change
//   const updateValue = useCallback((name, value) => {
//     setData(prev => {
//       const updated = { ...prev, [name]: value };
//       autoSave(updated);
//       return updated;
//     });
//   }, [autoSave]);

//   // Easy mode navigation
//   const nextItem = useCallback(() => {
//     const currentCategory = MATERIALS[categoryIdx];
//     if (itemIdx < currentCategory.items.length - 1) {
//       setItemIdx(itemIdx + 1);
//     } else if (categoryIdx < MATERIALS.length - 1) {
//       setCategoryIdx(categoryIdx + 1);
//       setItemIdx(0);
//       notify(`✅ ${currentCategory.category} completed!`);
//     } else {
//       notify("🎉 All materials completed!");
//     }
//     setInputValue("");
//   }, [categoryIdx, itemIdx, notify]);

//   const saveAndNext = useCallback(() => {
//     const currentMaterial = MATERIALS[categoryIdx].items[itemIdx];
//     if (inputValue) {
//       updateValue(currentMaterial, inputValue);
//     }
//     nextItem();
//   }, [categoryIdx, itemIdx, inputValue, updateValue, nextItem]);

//   const skipItem = useCallback(() => {
//     nextItem();
//   }, [nextItem]);

//   // Delete entry
//   const deleteEntry = useCallback((date) => {
//     const updated = { ...entries };
//     delete updated[date];
//     localStorage.setItem("mrf_data", JSON.stringify(updated));
//     setEntries(updated);
//     notify("🗑️ Entry deleted");
//   }, [entries, notify]);

//   // Computed values
//   const stats = useMemo(() => {
//     const categoryTotals = {};
//     flatMaterials.forEach(({ name, category, color }) => {
//       const weight = parseFloat(data[name]) || 0;
//       if (!categoryTotals[category]) {
//         categoryTotals[category] = { total: 0, color };
//       }
//       categoryTotals[category].total += weight;
//     });
//     const chartData = Object.entries(categoryTotals).map(([category, { total, color }]) => ({
//       category, total, color
//     }));
//     const totalWeight = chartData.reduce((sum, item) => sum + item.total, 0);
//     const filledCount = Object.values(data).filter(v => v && parseFloat(v) > 0).length;
//     return { chartData, totalWeight, filledCount };
//   }, [data]);

//   const historyData = useMemo(() => 
//     Object.keys(entries)
//       .sort()
//       .slice(-7)
//       .map(date => ({
//         date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//         total: Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
//       }))
//   , [entries]);

//   const filteredMaterials = useMemo(() => {
//     if (!searchTerm) return flatMaterials;
//     const term = searchTerm.toLowerCase();
//     return flatMaterials.filter(m =>
//       m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)
//     );
//   }, [searchTerm]);

//   // Views
//   const DashboardView = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard 
//           label="Today's Total" 
//           value={stats.totalWeight.toFixed(2)} 
//           unit="kg"
//           gradient="from-purple-500 to-indigo-600"
//         />
//         <StatCard 
//           label="Materials Logged" 
//           value={stats.filledCount} 
//           unit={`of ${flatMaterials.length}`}
//           gradient="from-pink-500 to-rose-600"
//         />
//         <StatCard 
//           label="Total Entries" 
//           value={Object.keys(entries).length} 
//           unit="days"
//           gradient="from-cyan-500 to-blue-600"
//         />
//       </div>

//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-xl font-bold mb-4">Category Distribution</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={stats.chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="total" radius={[8, 8, 0, 0]}>
//               {stats.chartData.map((entry, idx) => (
//                 <Cell key={idx} fill={entry.color} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {historyData.length > 1 && (
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h3 className="text-xl font-bold mb-4">7-Day Trend</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={historyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );

//   const EntryView = () => {
//     const currentCategory = MATERIALS[categoryIdx];
//     const currentItem = currentCategory?.items[itemIdx];
//     const progress = categoryIdx === MATERIALS.length - 1 && itemIdx === currentCategory.items.length - 1
//       ? 100
//       : ((categoryIdx * 100 + (itemIdx / currentCategory.items.length) * 100) / MATERIALS.length);

//     return (
//       <div className="space-y-6">
//         <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-sm opacity-90">Recording for</div>
//               <div className="text-2xl md:text-3xl font-bold">
//                 {new Date(today).toLocaleDateString('en-US', { 
//                   weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
//                 })}
//               </div>
//             </div>
//             <Calendar size={40} className="opacity-80" />
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-4">
//           <div className="flex gap-2">
//             <button
//               onClick={() => setMode("easy")}
//               className={`flex-1 py-3 rounded-xl font-semibold transition ${
//                 mode === "easy" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//               }`}
//             >
//               ⚡ Easy Entry
//             </button>
//             <button
//               onClick={() => setMode("all")}
//               className={`flex-1 py-3 rounded-xl font-semibold transition ${
//                 mode === "all" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
//               }`}
//             >
//               📝 View All
//             </button>
//           </div>
//         </div>

//         {mode === "easy" ? (
//           <>
//             <div className="bg-white rounded-2xl shadow-lg p-4">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="font-semibold">{currentCategory.category}</span>
//                 <span>{categoryIdx + 1} of {MATERIALS.length} categories</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <div className="text-center mb-6">
//                 <div 
//                   className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
//                   style={{ backgroundColor: currentCategory.color }}
//                 >
//                   {itemIdx + 1}
//                 </div>
//                 <div className="text-sm text-gray-500 mb-1">{currentCategory.category}</div>
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{currentItem}</h2>
//               </div>

//               <div className="max-w-md mx-auto mb-6">
//                 <div className="relative">
//                   <input
//                     type="number"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && saveAndNext()}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     autoFocus
//                     className="w-full text-4xl md:text-5xl font-bold text-center border-4 border-purple-200 rounded-2xl px-6 py-6 focus:outline-none focus:border-purple-500"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">kg</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-6">
//                 {[0.5, 1, 2, 5, 10, 20, 50, 100].map(num => (
//                   <button
//                     key={num}
//                     onClick={() => setInputValue(num.toString())}
//                     className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-3 rounded-xl transition"
//                   >
//                     {num}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex gap-3 max-w-md mx-auto">
//                 <button
//                   onClick={skipItem}
//                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition"
//                 >
//                   Skip
//                 </button>
//                 <button
//                   onClick={saveAndNext}
//                   className="flex-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl transition flex items-center justify-center gap-2"
//                 >
//                   Next <ArrowRight size={20} />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search materials..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 bg-white shadow-md"
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2">
//                   <X size={20} className="text-gray-400" />
//                 </button>
//               )}
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredMaterials.map(({ name, category, color }) => (
//                   <div key={name} className="bg-gray-50 p-4 rounded-xl" style={{ borderLeft: `4px solid ${color}` }}>
//                     <div className="text-xs text-gray-500 mb-1">{category}</div>
//                     <label className="block text-sm font-semibold mb-2">{name}</label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="number"
//                         value={data[name] || ""}
//                         onChange={(e) => updateValue(name, e.target.value)}
//                         placeholder="0.00"
//                         min="0"
//                         step="0.01"
//                         className="flex-1 text-lg font-semibold border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
//                       />
//                       <span className="text-sm text-gray-500">kg</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   const HistoryView = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <h3 className="text-2xl font-bold mb-6">Saved Entries</h3>
//       {Object.keys(entries).length === 0 ? (
//         <div className="text-center py-16">
//           <div className="text-6xl mb-4">📊</div>
//           <p className="text-xl text-gray-500 mb-4">No entries yet</p>
//           <button
//             onClick={() => setView("entry")}
//             className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
//           >
//             Start Entering Data
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Object.keys(entries).sort((a, b) => b.localeCompare(a)).map((date) => {
//             const total = Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
//             const count = Object.values(entries[date]).filter(v => v && parseFloat(v) > 0).length;
//             return (
//               <div key={date} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition">
//                 <div className="text-sm text-gray-500 mb-2">
//                   {new Date(date).toLocaleDateString('en-US', { 
//                     weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
//                   })}
//                 </div>
//                 <div className="flex items-baseline gap-2 mb-3">
//                   <span className="text-4xl font-bold">{total.toFixed(2)}</span>
//                   <span className="text-lg text-gray-500">kg</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-4">{count} materials</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => { setView("entry"); }}
//                     className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
//                   >
//                     <Edit3 size={16} /> Edit
//                   </button>
//                   <button
//                     onClick={() => deleteEntry(date)}
//                     className="bg-red-50 text-red-600 px-4 rounded-xl hover:bg-red-100"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl sticky top-0 z-50">
//         <div className="container mx-auto px-4 md:px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold">MRF Dashboard</h1>
//               <p className="text-purple-100 text-xs md:text-sm">Zilla Panchayat Material Recovery</p>
//             </div>
//             <button 
//               onClick={() => {
//                 localStorage.clear();
//                 window.location.reload();
//               }}
//               className="bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-2"
//             >
//               <LogOut size={18} />
//               <span className="hidden md:inline">Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <nav className="bg-white shadow-md sticky top-[72px] md:top-[88px] z-40">
//         <div className="container mx-auto px-4 md:px-6 flex">
//           {[
//             { id: "dashboard", icon: Home, label: "Dashboard" },
//             { id: "entry", icon: Plus, label: "Entry" },
//             { id: "history", icon: Clock, label: "History" }
//           ].map(({ id, icon: Icon, label }) => (
//             <button
//               key={id}
//               onClick={() => setView(id)}
//               className={`flex-1 py-3 md:py-4 font-semibold transition flex items-center justify-center gap-2 ${
//                 view === id ? 'text-purple-600 border-b-4 border-purple-600' : 'text-gray-600'
//               }`}
//             >
//               <Icon size={18} />
//               <span className="text-sm md:text-base">{label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>

//       <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
//         {view === "dashboard" && <DashboardView />}
//         {view === "entry" && <EntryView />}
//         {view === "history" && <HistoryView />}
//       </main>

//       {notification.show && (
//         <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in">
//           {notification.message}
//         </div>
//       )}
//     </div>
//   );
// }

// const StatCard = ({ label, value, unit, gradient }) => (
//   <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg p-6`}>
//     <div className="text-sm opacity-90 mb-2">{label}</div>
//     <div className="text-4xl md:text-5xl font-bold mb-1">{value}</div>
//     <div className="text-sm opacity-75">{unit}</div>
//   </div>
// );

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie, Legend
} from "recharts";
import {
  Calendar, Search, X, Clock, Home, Plus,
  LogOut, Trash2, CheckCircle, Eye, Download,
  TrendingUp, Award, Zap, Target, BarChart3, Activity, DollarSign, Users,
  Package, Truck, MapPin, IndianRupee
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useI18n } from "../i18n/I18nProvider";

import {
  getEntryByDate,
  upsertEntry,
  deleteEntryByDate,
  getEntriesHistory,
} from "../services/entriesService";
import {
  getTransactionsByDate,
  createTransaction,
  getTransactionsHistory,
  deleteTransaction,
} from "../services/transactionsService";

// -------------------- Static Material Data --------------------
const MATERIALS = [
  { category: "Paper", items: ["News Paper", "White & colored paper", "Notebooks & other books", "Cardboard", "Plastic lined board/whiteboard"], color: "#8b5cf6" },
  { category: "Plastic", items: ["PET bottle", "LDPE/HDPE carry bags", "Milk packets", "HDPE (shampoo bottles, cleaners)", "PVC (plumbing pipes)", "PP (Food containers)", "PP carry bags", "Laminates", "Tetra paks", "Thermocol/PS", "Paper cups/plates", "MLP"], color: "#3b82f6" },
  { category: "Metal", items: ["Aluminium foils", "Aluminium/tin cans", "Other metals"], color: "#ef4444" },
  { category: "Glass", items: ["Glass"], color: "#10b981" },
  { category: "Rubber", items: ["Tyres", "Toys, gloves, others"], color: "#f59e0b" },
  { category: "Textile", items: ["Textiles (clothes, bags, rags, etc.)"], color: "#ec4899" },
  { category: "Ceramic", items: ["Ceramic (plates, cups, pots, etc.)"], color: "#14b8a6" },
  { category: "Leather", items: ["Leather (belts, bags, tyres etc.)"], color: "#a855f7" },
  { category: "Footwear", items: ["Sandals, shoes, etc."], color: "#6366f1" },
  { category: "Fibrous organic", items: ["Coconut shells and husks"], color: "#84cc16" },
  { category: "E-waste", items: ["All kinds of E-waste"], color: "#64748b" },
  { category: "Others", items: ["Rejects (silt, hair, dust)"], color: "#78716c" },
];

const flatMaterials = MATERIALS.flatMap(cat =>
  cat.items.map(item => ({ name: item, category: cat.category, color: cat.color }))
);

// -------------------- Main Component --------------------
export default function Dashboard() {
  const { t, lang, setLang } = useI18n();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [view, setView] = useState("dashboard");
  const [entries, setEntries] = useState({});
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedDate, setSelectedDate] = useState(today); // Allow selecting any date
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dashboardRef = useRef(null);
  
  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    itemName: "",
    destination: "",
    quantity: "",
    cost: "",
    date: today,
    notes: "",
  });
  const [savingTransaction, setSavingTransaction] = useState(false);

  // ✅ Notification helper
  const notify = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  }, []);

  // 🚀 Fetch data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const todayEntry = await getEntryByDate(today);
        const historyList = await getEntriesHistory(30);
        const todayData = todayEntry?.data || {};

        setData(todayData);
        setOriginalData(todayData);

        const entriesMap = {};
        historyList.forEach((e) => {
          if (e.dateKey && e.data && Object.keys(e.data).length > 0) {
            entriesMap[e.dateKey] = e.data;
          }
        });

        if (Object.keys(todayData).length > 0) entriesMap[today] = todayData;

        setEntries(entriesMap);

        // Fetch transactions
        try {
          const transactionsList = await getTransactionsHistory(100);
          setTransactions(transactionsList);
        } catch (txnErr) {
          console.error("Error fetching transactions:", txnErr);
          // Don't fail the whole load if transactions fail
        }
      } catch (err) {
        console.error("Error fetching entries:", err);
        notify("❌ Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [today, notify]);

  // Fetch entry data when selected date changes
  useEffect(() => {
    if (view === "entry" && selectedDate) {
      async function fetchEntryData() {
        try {
          const entry = await getEntryByDate(selectedDate);
          const entryData = entry?.data || {};
          setData(entryData);
          setOriginalData(entryData);
        } catch (err) {
          console.error("Error fetching entry:", err);
          setData({});
          setOriginalData({});
        }
      }
      fetchEntryData();
    }
  }, [selectedDate, view]);

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [data, originalData]);

  // Update value handler
  const updateValue = useCallback((name, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    setData(prev => ({
      ...prev,
      [name]: value === "" ? "" : (isNaN(numericValue) ? 0 : numericValue),
    }));
  }, []);

  // Submit handler - now uses selectedDate instead of today
  const handleSubmit = async () => {
    if (!window.confirm(`Are you sure you want to submit the data for ${new Date(selectedDate).toLocaleDateString()}?`)) return;

    setSaving(true);
    try {
      const cleanedData = {};
      Object.keys(data).forEach(key => {
        const val = parseFloat(data[key]);
        if (!isNaN(val) && val > 0) cleanedData[key] = val;
      });

      await upsertEntry(selectedDate, cleanedData);
      setOriginalData(cleanedData);
      setData(cleanedData);
      setEntries(prev => ({ ...prev, [selectedDate]: cleanedData }));
      notify(`✅ Data saved successfully for ${new Date(selectedDate).toLocaleDateString()}!`, "success");
      setHasUnsavedChanges(false);
      setTimeout(() => setView("dashboard"), 1000);
    } catch (err) {
      console.error("Save failed:", err);
      notify("❌ Save failed. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Transaction handlers
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!transactionForm.itemName || !transactionForm.destination || !transactionForm.cost) {
      notify("Please fill in all required fields", "error");
      return;
    }

    setSavingTransaction(true);
    try {
      const transactionData = {
        itemName: transactionForm.itemName,
        destination: transactionForm.destination,
        quantity: parseFloat(transactionForm.quantity) || 0,
        cost: parseFloat(transactionForm.cost) || 0,
        date: transactionForm.date,
        notes: transactionForm.notes || "",
      };

      await createTransaction(transactionData);
      const updatedTransactions = await getTransactionsHistory(100);
      setTransactions(updatedTransactions);
      
      setTransactionForm({
        itemName: "",
        destination: "",
        quantity: "",
        cost: "",
        date: today,
        notes: "",
      });
      notify("✅ Transaction saved successfully!", "success");
    } catch (err) {
      console.error("Transaction save failed:", err);
      notify("❌ Failed to save transaction. Please try again.", "error");
    } finally {
      setSavingTransaction(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      const updatedTransactions = await getTransactionsHistory(100);
      setTransactions(updatedTransactions);
      notify("✅ Transaction deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      notify("❌ Delete failed", "error");
    }
  };

  // Delete handler
  const handleDelete = useCallback(async (date) => {
    if (!window.confirm(`Delete entry for ${new Date(date).toLocaleDateString()}?`)) return;
    try {
      await deleteEntryByDate(date);
      const updated = { ...entries };
      delete updated[date];
      setEntries(updated);
      notify("🗑️ Entry deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      notify("❌ Delete failed", "error");
    }
  }, [entries, notify]);

  // Stats calculations
  const stats = useMemo(() => {
    const categoryTotals = {};
    flatMaterials.forEach(({ name, category, color }) => {
      const weight = parseFloat(data[name]) || 0;
      if (!categoryTotals[category]) categoryTotals[category] = { total: 0, color };
      categoryTotals[category].total += weight;
    });

    const chartData = Object.entries(categoryTotals)
      .map(([category, { total, color }]) => ({ category, total, color }))
      .filter(item => item.total > 0);

    const totalWeight = chartData.reduce((sum, i) => sum + i.total, 0);
    const filledCount = Object.values(data).filter(v => v && parseFloat(v) > 0).length;

    return { chartData, totalWeight, filledCount };
  }, [data]);

  const historyData = useMemo(() => {
    const sortedDates = Object.keys(entries).sort();
    return sortedDates.slice(-7).map(date => {
      const entryData = entries[date] || {};
      const total = Object.values(entryData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total,
      };
    });
  }, [entries]);

  // Calculate insights and highlights
  const highlights = useMemo(() => {
    const totalDays = Object.keys(entries).length;
    const avgDailyWeight = totalDays > 0 ? stats.totalWeight / totalDays : 0;
    const completionRate = (stats.filledCount / flatMaterials.length) * 100;
    
    return [
      {
        icon: TrendingUp,
        title: "Today's Collection",
        description: `Total weight collected today: ${stats.totalWeight.toFixed(2)} kg. ${completionRate.toFixed(1)}% of materials logged.`,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        icon: Activity,
        title: "Active Recording",
        description: `${stats.filledCount} materials logged out of ${flatMaterials.length} total materials available.`,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        icon: Calendar,
        title: "Historical Data",
        description: `${totalDays} days of data recorded. Average daily collection: ${avgDailyWeight.toFixed(2)} kg.`,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        icon: Target,
        title: "Progress Tracking",
        description: `7-day trend shows ${historyData.length > 1 ? 'consistent' : 'initial'} data collection patterns.`,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
    ];
  }, [stats, entries, flatMaterials, historyData]);

  const keyPoints = useMemo(() => {
    const totalDays = Object.keys(entries).length;
    const completionRate = (stats.filledCount / flatMaterials.length) * 100;
    const topCategory = stats.chartData.length > 0 ? stats.chartData[0]?.category : "N/A";
    
    return [
      {
        type: "success",
        text: `Today's total collection: ${stats.totalWeight.toFixed(2)} kg`,
      },
      {
        type: "info",
        text: `${stats.filledCount} materials logged out of ${flatMaterials.length} total`,
      },
      {
        type: "success",
        text: `${topCategory} is the top category with highest weight collected`,
      },
      {
        type: completionRate < 50 ? "warning" : "success",
        text: `Completion rate: ${completionRate.toFixed(1)}% - ${completionRate >= 50 ? 'Good progress' : 'More data needed'}`,
      },
      {
        type: "info",
        text: `${totalDays} days of historical data recorded`,
      },
      {
        type: "success",
        text: `7-day trend shows ${historyData.length > 1 ? historyData[historyData.length - 1].total.toFixed(2) : '0'} kg on latest day`,
      },
    ];
  }, [stats, flatMaterials, entries, historyData]);

  const recommendations = useMemo(() => [
    "Continue logging materials daily to maintain accurate records",
    "Focus on completing all material categories for comprehensive data",
    "Review 7-day trends to identify collection patterns",
    "Ensure all categories are represented in daily entries",
    "Use historical data to forecast future collection volumes",
  ], []);

  // PDF Generation Function
  const captureChartContainer = async (container) => {
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 10000,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing chart:", error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // short wait to ensure any last UI renders
      await new Promise((resolve) => setTimeout(resolve, 400));

      const pdf = new jsPDF("p", "mm", "a4");
      // Hint PDF viewers to fit width so users see the whole page without manual zooming
      if (typeof pdf.setDisplayMode === "function") {
        try { pdf.setDisplayMode("fullwidth", "continuous"); } catch (_e) {}
      }
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pdfWidth - margin * 2;
      let y = margin;

      const addHeader = (title, subtitle) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(title, margin, y);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        if (subtitle) {
          pdf.text(subtitle, margin, y + 6);
          y += 10;
        } else {
          y += 8;
        }
        pdf.setDrawColor(180);
        pdf.line(margin, y, pdfWidth - margin, y);
        y += 6;
      };

      const ensureSpace = (needed) => {
        if (y + needed > pdfHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      const addSectionTitle = (text) => {
        ensureSpace(12);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(text, margin, y);
        y += 6;
        pdf.setDrawColor(220);
        pdf.line(margin, y, margin + 50, y);
        y += 4;
      };

      const addKeyValue = (label, value) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        const labelWidth = pdf.getTextWidth(label + ": ");
        ensureSpace(6);
        pdf.text(label + ":", margin, y);
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(String(value ?? ""), contentWidth - labelWidth);
        pdf.text(lines, margin + labelWidth, y);
        y += 5.5 + Math.max(0, (lines.length - 1) * 3.8);
      };

      const addBullets = (items) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        items.forEach((it) => {
          const lines = pdf.splitTextToSize("• " + it, contentWidth);
          ensureSpace(6 + (lines.length - 1) * 3.8);
          pdf.text(lines, margin, y);
          y += 6 + (lines.length - 1) * 3.8;
        });
      };

      // Header
      addHeader(
        "MRF Dashboard Report",
        `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} | Date: ${new Date(today).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
      );

      // Summary
      addSectionTitle("Summary");
      addKeyValue("Today's Total", `${stats.totalWeight.toFixed(2)} kg`);
      addKeyValue("Materials Logged", `${stats.filledCount} of ${flatMaterials.length}`);
      addKeyValue("Total Days Recorded", Object.keys(entries).length);
      addKeyValue("Active Categories", stats.chartData.length);
      const totalTxnCost = transactions.reduce((sum, txn) => sum + (parseFloat(txn.cost) || 0), 0);
      addKeyValue("Transactions", transactions.length);
      addKeyValue("Transaction Revenue", `₹${totalTxnCost.toFixed(2)}`);

      // Highlights
      addSectionTitle("Highlights");
      addBullets(
        highlights.map((h) => `${h.title} – ${h.description}`)
      );

      // Key Points
      addSectionTitle("Key Points");
      addBullets(keyPoints.map((k) => k.text));

      // Recommendations
      addSectionTitle("Recommendations");
      addBullets(recommendations);

      // Transactions (compact table)
      addSectionTitle("Transactions & Shipments");
      if (transactions.length === 0) {
        addBullets(["No transactions recorded yet."]);
      } else {
        // Table headers
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10.5);
        const colX = [margin, margin + 35, margin + 100, margin + 160];
        const headers = ["Date", "Item", "Destination", "Cost (₹)"];
        ensureSpace(8);
        headers.forEach((h, i) => pdf.text(h, colX[i], y));
        y += 5;
        pdf.setDrawColor(220);
        pdf.line(margin, y, pdfWidth - margin, y);
        y += 3;

        pdf.setFont("helvetica", "normal");
        const rows = transactions.slice(0, 20).map((t) => ({
          date: new Date(t.date || t.dateKey || today).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          item: t.itemName || "—",
          dest: t.destination || "—",
          cost: (t.cost || 0).toFixed(2),
        }));

        rows.forEach((r) => {
          const itemLines = pdf.splitTextToSize(r.item, colX[2] - colX[1] - 2);
          const destLines = pdf.splitTextToSize(r.dest, colX[3] - colX[2] - 2);
          const rowHeight = 5 + Math.max(itemLines.length - 1, destLines.length - 1) * 4;
          ensureSpace(rowHeight + 2);
          pdf.text(r.date, colX[0], y);
          pdf.text(itemLines, colX[1], y);
          pdf.text(destLines, colX[2], y);
          pdf.text(r.cost, colX[3], y, { align: "left" });
          y += rowHeight;
          pdf.setDrawColor(245);
          pdf.line(margin, y, pdfWidth - margin, y);
          y += 2;
        });
      }

      // Charts page (optional, cleaner presentation)
      const chartCards = dashboardRef.current?.querySelectorAll('.bg-white.rounded-2xl.shadow-lg');
      if (chartCards && chartCards.length > 0) {
        pdf.addPage();
        y = margin;
        addSectionTitle("Charts & Visualizations");
        for (let i = 0; i < chartCards.length; i++) {
          const card = chartCards[i];
          const titleElement = card.querySelector('h3');
          const chartTitle = titleElement ? titleElement.textContent : `Chart ${i + 1}`;
          try {
            const chartImage = await captureChartContainer(card);
            if (chartImage) {
              // If not enough space for title + chart, move to next page to avoid clipping
              ensureSpace(110);
              pdf.setFont("helvetica", "bold");
              pdf.setFontSize(11);
              pdf.text(chartTitle, margin, y);
              y += 6;
              const maxW = contentWidth;
              const img = new Image();
              img.src = chartImage;
              await new Promise((resolve) => {
                img.onload = () => {
                  // Constrain image height to avoid running off the page (slightly smaller to leave footer space)
                  const maxH = Math.min(95, pdfHeight - y - margin - 8);
                  const ratio = Math.min(maxW / img.width, maxH / img.height);
                  const w = img.width * ratio;
                  const h = img.height * ratio;
                  pdf.addImage(chartImage, "PNG", margin, y, w, h);
                  y += h + 10;
                  resolve();
                };
              });
            }
          } catch (e) {
            // skip chart if render fails
          }
          if (y > pdfHeight - margin - 36 && i < chartCards.length - 1) {
            pdf.addPage();
            y = margin;
          }
        }
      }

      // Add page numbers (footer)
      const pageCount = pdf.getNumberOfPages();
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setTextColor(120);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pdfWidth - margin,
          pdfHeight - 8,
          { align: "right" }
        );
      }

      const fileName = `MRF_Dashboard_Report_${today}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      notify("Failed to generate PDF. Please try again.", "error");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t("app.title")}</h1>
            <p className="text-purple-100 text-xs md:text-sm">{t("app.subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            {view === "dashboard" && (
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                <Download size={18} />
                <span className="hidden md:inline">{isGeneratingPDF ? t("actions.saving") : t("actions.downloadPdf")}</span>
              </button>
            )}
            <button
              onClick={() => {
                if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Proceed to logout?")) return;
                localStorage.removeItem("auth_token");
                window.location.href = "/";
              }}
              className="bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">{t("actions.logout")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="bg-white shadow-md sticky top-[64px] md:top-[72px] z-40">
        <div className="flex">
          {[{ id: "dashboard", icon: Home, label: t("nav.dashboard") },
            { id: "entry", icon: Plus, label: t("nav.entry") },
            { id: "transactions", icon: Truck, label: t("nav.transactions") },
            { id: "history", icon: Clock, label: t("nav.history") }].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                if (hasUnsavedChanges && view === "entry" && id !== "entry") {
                  if (!window.confirm("You have unsaved changes. Discard them?")) return;
                }
                setView(id);
              }}
              className={`flex-1 py-3 md:py-4 font-semibold flex items-center justify-center gap-2 ${
                view === id ? "text-purple-600 border-b-4 border-purple-600" : "text-gray-600"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm md:text-base">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 md:py-8" ref={view === "dashboard" ? dashboardRef : null}>
        {view === "dashboard" && <DashboardView stats={stats} historyData={historyData} entries={entries} flatMaterials={flatMaterials} highlights={highlights} keyPoints={keyPoints} recommendations={recommendations} transactions={transactions} today={today} t={t} />}
        {view === "entry" && (
          <EntryView
            MATERIALS={MATERIALS}
            data={data}
            updateValue={updateValue}
            handleSubmit={handleSubmit}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            saving={saving}
            hasUnsavedChanges={hasUnsavedChanges}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            today={today}
          />
        )}
        {view === "transactions" && (
          <TransactionsView
            transactions={transactions}
            transactionForm={transactionForm}
            setTransactionForm={setTransactionForm}
            handleTransactionSubmit={handleTransactionSubmit}
            handleDeleteTransaction={handleDeleteTransaction}
            savingTransaction={savingTransaction}
            today={today}
            flatMaterials={flatMaterials}
          />
        )}
        {view === "history" && (
          <HistoryView entries={entries} handleDelete={handleDelete} setView={setView} today={today} />
        )}
      </main>

      {notification.show && (
        <div
          className={`fixed bottom-6 right-6 ${
            notification.type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : "bg-gradient-to-r from-green-500 to-emerald-600"
          } text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

const DashboardView = ({ stats, historyData, entries, flatMaterials, highlights, keyPoints, recommendations, transactions, today, t }) => {
  const totalDays = Object.keys(entries).length;
  const completionRate = (stats.filledCount / flatMaterials.length) * 100;
  const avgDailyWeight = totalDays > 0 ? stats.totalWeight / totalDays : 0;
  const totalTransactionCost = transactions.reduce((sum, txn) => sum + (parseFloat(txn.cost) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label={t("common.todayTotal")} value={stats.totalWeight.toFixed(2)} unit={t("common.kg")} gradient="from-purple-500 to-indigo-600" />
        <StatCard label={t("common.materialsLogged")} value={stats.filledCount} unit={`of ${flatMaterials.length}`} gradient="from-pink-500 to-rose-600" />
        <StatCard label={t("common.totalDays")} value={totalDays} unit={t("common.recorded")} gradient="from-cyan-500 to-blue-600" />
      </div>

      {/* Summary Highlights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t("sections.highlights")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className={`${highlight.bgColor} rounded-xl p-6 border-l-4 border-purple-600`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-white ${highlight.color}`}>
                  <highlight.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-gray-700 text-sm">{highlight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Points */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t("sections.keyPoints")}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    point.type === "success"
                      ? "text-green-600"
                      : point.type === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                />
                <p className="text-gray-700 text-sm">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.chartData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Today's Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {stats.chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {historyData.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">7-Day Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t("sections.performance")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Collection Metrics</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <MetricItem label="Today's Total" value={`${stats.totalWeight.toFixed(2)} kg`} />
              <MetricItem label="Completion Rate" value={`${completionRate.toFixed(1)}%`} />
              <MetricItem label="Materials Logged" value={`${stats.filledCount}/${flatMaterials.length}`} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Historical Data</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <MetricItem label="Total Days" value={totalDays.toString()} />
              <MetricItem label="Avg Daily Weight" value={`${avgDailyWeight.toFixed(2)} kg`} />
              <MetricItem label="Categories Active" value={stats.chartData.length.toString()} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Trend Analysis</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <MetricItem label="7-Day Trend" value={historyData.length > 1 ? "Active" : "Insufficient"} />
              <MetricItem label="Latest Day" value={historyData.length > 1 ? `${historyData[historyData.length - 1].total.toFixed(2)} kg` : "N/A"} />
              <MetricItem label="Top Category" value={stats.chartData.length > 0 ? stats.chartData[0]?.category : "N/A"} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Summary */}
      {transactions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t("sections.recentTransactions")}</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
                <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">₹{totalTransactionCost.toFixed(2)}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                <div className="text-sm text-gray-600 mb-1">Avg per Transaction</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{transactions.length > 0 ? (totalTransactionCost / transactions.length).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Item</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Destination</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((txn, idx) => (
                    <tr key={txn._id || idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">
                        {new Date(txn.date || txn.dateKey || today).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900">{txn.itemName || "N/A"}</td>
                      <td className="px-3 py-2 text-gray-600">{txn.destination || "N/A"}</td>
                      <td className="px-3 py-2 text-right font-semibold text-green-600">₹{(txn.cost || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions.length > 5 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Showing 5 of {transactions.length} transactions</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t("sections.recommendations")}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-gray-700 flex-1">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stats.totalWeight === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No data for today</h3>
          <p className="text-gray-500 mb-6">Start by entering material weights for today</p>
        </div>
      )}
    </div>
  );
};

const MetricItem = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
};

const StatCard = ({ label, value, unit, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg p-6`}>
    <div className="text-sm opacity-90 mb-2">{label}</div>
    <div className="text-4xl md:text-5xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-75">{unit}</div>
  </div>
);

const EntryView = ({ MATERIALS, data, updateValue, handleSubmit, searchTerm, setSearchTerm, saving, hasUnsavedChanges, selectedDate, setSelectedDate, today }) => {
  const [viewMode, setViewMode] = useState("table");
  const inputRefs = React.useRef({});
  
  const flatMaterials = MATERIALS.flatMap(cat =>
    cat.items.map(item => ({ name: item, category: cat.category, color: cat.color }))
  );

  const filteredMaterials = useMemo(() => {
    if (!searchTerm) return flatMaterials;
    const term = searchTerm.toLowerCase();
    return flatMaterials.filter(m =>
      m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)
    );
  }, [searchTerm, flatMaterials]);

  const filledCount = Object.values(data).filter(v => v && parseFloat(v) > 0).length;
  const totalCount = flatMaterials.length;
  const progress = (filledCount / totalCount) * 100;

  const handleKeyDown = (e, currentName) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = filteredMaterials.findIndex(m => m.name === currentName);
      if (currentIndex < filteredMaterials.length - 1) {
        const nextName = filteredMaterials[currentIndex + 1].name;
        inputRefs.current[nextName]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = filteredMaterials.findIndex(m => m.name === currentName);
      if (currentIndex > 0) {
        const prevName = filteredMaterials[currentIndex - 1].name;
        inputRefs.current[prevName]?.focus();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="text-sm opacity-90 mb-2">Recording for</div>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ colorScheme: 'dark' }}
              />
              <div className="text-xl md:text-2xl font-bold">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}
              </div>
              {selectedDate !== today && (
                <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Past Date
                </span>
              )}
            </div>
          </div>
          <Calendar size={40} className="opacity-80" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{filledCount} of {totalCount} materials</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 bg-white shadow-md"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={20} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 bg-white rounded-xl shadow-md p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "table" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            📊 Table View
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "cards" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🎴 Card View
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No materials found matching "{searchTerm}"
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">S.No</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Material Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map(({ name, category, color }, index) => (
                  <tr 
                    key={name} 
                    className={`border-b hover:bg-gray-50 transition ${
                      data[name] && parseFloat(data[name]) > 0 ? 'bg-green-50' : ''
                    }`}
                    style={{ borderLeft: `4px solid ${color}` }}
                  >
                    <td className="px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-gray-500">{category}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{name}</td>
                    <td className="px-4 py-3">
                      <input
                        ref={el => inputRefs.current[name] = el}
                        type="number"
                        value={data[name] || ""}
                        onChange={(e) => updateValue(name, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, name)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full text-right text-lg font-semibold border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-right text-gray-700">
                    Total Weight:
                  </td>
                  <td className="px-4 py-4 text-right text-purple-600 text-xl">
                    {Object.values(data).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)} kg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map(({ name, category, color }) => (
              <div key={name} className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition" style={{ borderLeft: `4px solid ${color}` }}>
                <div className="text-xs text-gray-500 mb-1">{category}</div>
                <label className="block text-sm font-semibold mb-2">{name}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={data[name] || ""}
                    onChange={(e) => updateValue(name, e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 text-lg font-semibold border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-sm text-gray-500 font-medium">kg</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewMode === "table" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Excel-like shortcuts:</strong> Press <kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> or 
            <kbd className="px-2 py-1 bg-white rounded border ml-1">↓</kbd> to move to next row, 
            <kbd className="px-2 py-1 bg-white rounded border ml-1">↑</kbd> to move up
          </p>
        </div>
      )}

      <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 to-transparent pt-6 pb-4">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={saving || !hasUnsavedChanges}
            className={`flex-1 ${
              saving || !hasUnsavedChanges
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl"
            } text-white font-bold py-4 px-8 rounded-xl transition flex items-center justify-center gap-2`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Submit & Save
              </>
            )}
          </button>
        </div>
        {!hasUnsavedChanges && (
          <p className="text-center text-sm text-gray-500 mt-2">No changes to save</p>
        )}
      </div>
    </div>
  );
};

const HistoryView = ({ entries, handleDelete, setView, today }) => {
  return (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold">Saved Entries</h3>
      <div className="text-sm text-gray-500">
        Total: {Object.keys(entries).length} entries
      </div>
    </div>
    {Object.keys(entries).length === 0 ? (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-xl text-gray-500 mb-4">No entries yet</p>
        <button
          onClick={() => setView("entry")}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          Start Entering Data
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(entries)
          .sort((a, b) => b.localeCompare(a))
          .map((date) => {
            const total = Object.values(entries[date]).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
            const count = Object.values(entries[date]).filter((v) => v && parseFloat(v) > 0).length;
            const isToday = date === today;
            
            return (
              <div
                key={date}
                className={`bg-gradient-to-br from-white to-gray-50 border-2 ${
                  isToday ? "border-purple-300" : "border-gray-100"
                } rounded-2xl p-6 hover:shadow-xl transition`}
              >
                {isToday && (
                  <div className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    Today
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold">{total.toFixed(2)}</span>
                  <span className="text-lg text-gray-500">kg</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{count} materials logged</p>
                <div className="flex gap-2">
                  {isToday ? (
                    <button
                      onClick={() => setView("entry")}
                      className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2 transition"
                    >
                      <Plus size={16} /> Edit Today
                    </button>
                  ) : (
                    <button
                      className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      disabled
                      title="Can only edit today's entry"
                    >
                      <Eye size={16} /> View Only
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(date)}
                    className="bg-red-50 text-red-600 px-4 rounded-xl hover:bg-red-100 transition"
                    title="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    )}
  </div>
);
};

const TransactionsView = ({ transactions, transactionForm, setTransactionForm, handleTransactionSubmit, handleDeleteTransaction, savingTransaction, today, flatMaterials }) => {
  const totalCost = transactions.reduce((sum, txn) => sum + (parseFloat(txn.cost) || 0), 0);
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date || a.dateKey || 0);
    const dateB = new Date(b.date || b.dateKey || 0);
    return dateB - dateA;
  });
  const itemOptions = useMemo(() => {
    const unique = new Set(flatMaterials.map(item => item.name));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [flatMaterials]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6">
          <div className="text-sm opacity-90 mb-2">Total Transactions</div>
          <div className="text-4xl md:text-5xl font-bold mb-1">{transactions.length}</div>
          <div className="text-sm opacity-75">records</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg p-6">
          <div className="text-sm opacity-90 mb-2">Total Cost</div>
          <div className="text-4xl md:text-5xl font-bold mb-1">₹{totalCost.toFixed(2)}</div>
          <div className="text-sm opacity-75">all transactions</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg p-6">
          <div className="text-sm opacity-90 mb-2">Avg Cost</div>
          <div className="text-4xl md:text-5xl font-bold mb-1">
            ₹{transactions.length > 0 ? (totalCost / transactions.length).toFixed(2) : "0.00"}
          </div>
          <div className="text-sm opacity-75">per transaction</div>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Add New Transaction</h2>
        </div>
        <form onSubmit={handleTransactionSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <select
                  value={itemOptions.includes(transactionForm.itemName) ? transactionForm.itemName : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setTransactionForm({ ...transactionForm, itemName: value });
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white"
                >
                  <option value="">Select material from list</option>
                  {itemOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="text"
                  value={transactionForm.itemName}
                  onChange={(e) => setTransactionForm({ ...transactionForm, itemName: e.target.value })}
                  placeholder="Or type a custom item name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                /> */}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionForm.destination}
                onChange={(e) => setTransactionForm({ ...transactionForm, destination: e.target.value })}
                placeholder="e.g., Recycling Plant A, Buyer XYZ, etc."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity (kg)
              </label>
              <input
                type="number"
                value={transactionForm.quantity}
                onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cost (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  value={transactionForm.cost}
                  onChange={(e) => setTransactionForm({ ...transactionForm, cost: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={transactionForm.date}
                onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                max={today}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={transactionForm.notes}
                onChange={(e) => setTransactionForm({ ...transactionForm, notes: e.target.value })}
                placeholder="Additional information..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingTransaction}
            className={`w-full ${
              savingTransaction
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl"
            } text-white font-bold py-4 px-8 rounded-xl transition flex items-center justify-center gap-2`}
          >
            {savingTransaction ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Save Transaction
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          </div>
          <div className="text-sm text-gray-500">
            {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
          </div>
        </div>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-gray-500 mb-4">No transactions yet</p>
            <p className="text-gray-400">Add your first transaction using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Item</th>
                  <th className="px-4 py-3 text-left font-semibold">Destination</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantity (kg)</th>
                  <th className="px-4 py-3 text-right font-semibold">Cost (₹)</th>
                  <th className="px-4 py-3 text-left font-semibold">Notes</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((txn, idx) => (
                  <tr
                    key={txn._id || idx}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(txn.date || txn.dateKey || today).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{txn.itemName || "N/A"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{txn.destination || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">
                      {(txn.quantity || 0).toFixed(2)} kg
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      ₹{(txn.cost || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {txn.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(txn._id || txn.id)}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-right text-gray-700">
                    Total:
                  </td>
                  <td className="px-4 py-4 text-right text-gray-700">
                    {sortedTransactions.reduce((sum, txn) => sum + (parseFloat(txn.quantity) || 0), 0).toFixed(2)} kg
                  </td>
                  <td className="px-4 py-4 text-right text-purple-600 text-xl">
                    ₹{totalCost.toFixed(2)}
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};