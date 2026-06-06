import React, { useState } from 'react';
import { 
  BarChart, Wallet, ShoppingBag, Wrench, FileCheck, RefreshCw, Plus, 
  Trash2, Edit, Save, ToggleLeft, ShieldAlert, CheckCircle, XCircle, 
  UserSquare, Contact, Info, Search 
} from 'lucide-react';
import { Product, Order, Booking, SupportTicket, SolarQuote, CctvQuote } from '../types';

interface AdminProps {
  products: Product[];
  orders: Order[];
  bookings: Booking[];
  savedQuotes: any[];
  tickets: SupportTicket[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: 'pending' | 'assigned' | 'completed', tech?: string) => void;
  onReplyTicket: (id: string, response: string) => void;
  onUpdateQuoteStatus: (id: string, type: 'solar' | 'cctv', status: 'pending' | 'approved' | 'rejected') => void;
}

export default function SeaflowsAdminDashboard({
  products,
  orders,
  bookings,
  savedQuotes,
  tickets,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateBookingStatus,
  onReplyTicket,
  onUpdateQuoteStatus
}: AdminProps) {
  // Access roles state
  const [adminRole, setAdminRole] = useState<'super' | 'manager' | 'technician' | 'support'>('super');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'catalog' | 'quotes' | 'bookings' | 'tickets'>('analytics');

  // New product editing states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // New product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<any>('solar-panel');
  const [newProdPrice, setNewProdPrice] = useState(250000);
  const [newProdBrand, setNewProdBrand] = useState('Seaflows');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Support interaction states
  const [adminTicketReply, setAdminTicketReply] = useState<Record<string, string>>({});

  const formatNgn = (n: number) => '₦' + n.toLocaleString('en-NG');

  // Math aggregates
  const calculateTotalSales = () => orders.reduce((sum, o) => sum + o.totalNgn, 0);
  const getLowStockCount = () => products.filter(p => p.stock <= 15).length;
  const getPendingBookings = () => bookings.filter(b => b.status === 'pending').length;
  const getPendingQuotes = () => savedQuotes.filter(q => q.status === 'pending').length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProduct: Product = {
      id: 'prod-' + Math.floor(Math.random() * 9000 + 1000),
      name: newProdName,
      category: newProdCategory,
      price: newProdPrice,
      brand: newProdBrand,
      stock: newProdStock,
      description: newProdDesc || 'Brand new catalog inventory.',
      rating: 5.0,
      image: 'solar-panel-550w', // fallback
      specifications: {
        'Origin': 'Seaflows Authorized',
        'Sizing Class': 'A1 enterprise'
      },
      reviews: []
    };

    onAddProduct(newProduct);
    setIsAddingProduct(false);
    
    // reset
    setNewProdName('');
    setNewProdDesc('');
    setNewProdStock(50);
    setNewProdPrice(250000);
  };

  const handleSaveStockUpdate = (p: Product, newStock: number) => {
    onUpdateProduct({
      ...p,
      stock: newStock
    });
  };

  const handleQuoteAction = (qId: string, qType: 'solar' | 'cctv', status: 'approved' | 'rejected') => {
    onUpdateQuoteStatus(qId, qType, status);
  };

  const handleBookingSLAUpdate = (bkId: string, status: 'assigned' | 'completed', techName: string) => {
    onUpdateBookingStatus(bkId, status, techName);
  };

  const handleAdminTicketReplySubmit = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    const text = adminTicketReply[ticketId];
    if (!text || !text.trim()) return;

    onReplyTicket(ticketId, text);
    
    // reset text
    setAdminTicketReply({
      ...adminTicketReply,
      [ticketId]: ''
    });
  };

  return (
    <div id="admin-dashboard-root" className="bg-[#060c18] text-white p-6 rounded-2xl border border-gray-800 flex flex-col gap-6 shadow-2xl relative">
      
      {/* Top Controls: Role Selection banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a1120] border border-gray-850 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950/40 text-[#FDB813] border border-amber-900/30 rounded-full animate-pulse">
            <UserSquare size={18} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-sm">Seaflows Central Management Admin Console</h3>
            <span className="text-gray-400 text-[11px] block">Role-based Access Control authorization active</span>
          </div>
        </div>

        {/* Role swift select buttons */}
        <div className="flex items-center gap-1 bg-[#030913] p-1 rounded-lg border border-gray-800">
          {[
            { id: 'super', label: 'Super Admin' },
            { id: 'manager', label: 'Manager' },
            { id: 'technician', label: 'Technician' },
            { id: 'support', label: 'Support Desk' }
          ].map(role => (
            <button
              key={role.id}
              onClick={() => setAdminRole(role.id as any)}
              className={`px-3 py-1.5 rounded text-[9px] font-bold tracking-widest uppercase transition-colors ${
                adminRole === role.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Internal Management tab selects */}
      <div className="flex flex-wrap gap-1.5 bg-[#030812] p-1.5 rounded-lg border border-gray-850/80">
        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-3.5 py-2 rounded-md text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeAdminTab === 'analytics' ? 'bg-[#FDB813] text-[#0A2342]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart size={11} className="inline mr-1" /> Analytics Dashboard
        </button>
        <button
          onClick={() => setActiveAdminTab('catalog')}
          className={`px-3.5 py-2 rounded-md text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeAdminTab === 'catalog' ? 'bg-[#FDB813] text-[#0A2342]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={11} className="inline mr-1" /> Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('quotes')}
          className={`px-3.5 py-2 rounded-md text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeAdminTab === 'quotes' ? 'bg-[#FDB813] text-[#0A2342]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileCheck size={11} className="inline mr-1" /> Custom Quotes Logs ({savedQuotes.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('bookings')}
          className={`px-3.5 py-2 rounded-md text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeAdminTab === 'bookings' ? 'bg-[#FDB813] text-[#0A2342]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Wrench size={11} className="inline mr-1" /> Bookings Schedules ({bookings.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('tickets')}
          className={`px-3.5 py-2 rounded-md text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeAdminTab === 'tickets' ? 'bg-[#FDB813] text-[#0A2342]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Contact size={11} className="inline mr-1" /> Ticket Inboxes ({tickets.length})
        </button>
      </div>

      {/* --- CONTENT SEGMENT 1: ANALYTICS AT-A-GLANCE --- */}
      {activeAdminTab === 'analytics' && (
        <div id="admin-analytics-tab" className="flex flex-col gap-6">
          
          {/* Key Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-[#030913] rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Gross Sales Revenue</span>
              <span className="text-lg font-heading font-extrabold text-emerald-400">{formatNgn(calculateTotalSales())}</span>
              <span className="text-[9px] text-[#16A34A] block mt-1">+14.2% Month-over-Month</span>
            </div>
            
            <div className="p-4 bg-[#030913] rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Checkout Orders</span>
              <span className="text-lg font-heading font-extrabold text-white">{orders.length} Fulfilled</span>
              <span className="text-[9px] text-gray-500 block mt-1">100% processed through Paystack</span>
            </div>

            <div className="p-4 bg-[#030913] rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider flex items-center gap-1">
                <ShieldAlert size={11} className="text-amber-500" /> Low Stock
              </span>
              <span className="text-lg font-heading font-extrabold text-amber-400">{getLowStockCount()} Products</span>
              <span className="text-[9px] text-gray-500 block mt-1">Reorder threshold limit is 15 units</span>
            </div>

            <div className="p-4 bg-[#030913] rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Pending Site Jobs</span>
              <span className="text-lg font-heading font-extrabold text-blue-400">{getPendingBookings()} Slots</span>
              <span className="text-[9px] text-gray-500 block mt-1">Schedules needing technicians</span>
            </div>

            <div className="p-4 bg-[#030913] rounded-xl border border-[#FDB813]/20">
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Quotes Unprocessed</span>
              <span className="text-lg font-heading font-extrabold text-white">{getPendingQuotes()} Records</span>
              <span className="text-[9px] text-[#FDB813] block mt-1">Awaiting physical site vetting</span>
            </div>
          </div>

          {/* Supplier Record Sheet */}
          <div className="bg-[#030913] border border-gray-850 p-5 rounded-xl flex flex-col gap-4">
            <h4 className="text-xs text-[#FDB813] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} /> Registered Strategic Suppliers and Partnerships (Operational Directory)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#0a1120] border border-gray-850 rounded-lg text-xs">
                <span className="font-bold text-white block">Aiko Silicon Panels Corp (Shenzhen)</span>
                <span className="text-gray-400 text-[11px] block mt-1">Lead times: 18 Days Shipping • Class: Tier-1 Monocrystalline</span>
                <span className="text-emerald-400 text-[10px] mt-1.5 block">Approved Account Status: Stable</span>
              </div>

              <div className="p-3 bg-[#0a1120] border border-gray-850 rounded-lg text-xs">
                <span className="font-bold text-white block">Voltify Power Technologies (Hunan)</span>
                <span className="text-gray-400 text-[11px] block mt-1">Supplies: 5kVA, 10kVA Pure Sine Wave Hybrid Inverters with MPPT</span>
                <span className="text-emerald-400 text-[10px] mt-1.5 block">Approved Account Status: Stable</span>
              </div>

              <div className="p-3 bg-[#0a1120] border border-gray-850 rounded-lg text-xs">
                <span className="font-bold text-white block">Hikvision Secure Direct Distributors</span>
                <span className="text-gray-400 text-[11px] block mt-1">Commodity: 4MP Full-color cameras, PTZ Mount domes, SATA hard drives</span>
                <span className="text-emerald-400 text-[10px] mt-1.5 block">Approved Account Status: Active Priority</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- CONTENT SEGMENT 2: PRODUCT CATALOGUE --- */}
      {activeAdminTab === 'catalog' && (
        <div id="admin-catalog-tab" className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-[#070e1b] p-3 rounded-lg border border-gray-850">
            <span className="text-xs text-gray-400 font-bold uppercase">Inventory Control Sheets (Discounts / Stocks)</span>
            
            {adminRole === 'super' || adminRole === 'manager' ? (
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-[#FDB813] text-[#0A2342] text-[11px] font-bold px-4 py-2 rounded hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                <Plus size={12} /> Inject New Item
              </button>
            ) : (
              <span className="text-red-400 text-[10px] font-bold uppercase">Role limits edit access</span>
            )}
          </div>

          {/* Add product form */}
          {isAddingProduct && (
            <form onSubmit={handleCreateProduct} className="bg-[#030913] border border-gray-850 p-5 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
              <div className="md:col-span-12 font-bold text-sm text-white border-b border-gray-900 pb-2">Inject Inventory Device Item</div>
              
              <div className="md:col-span-4">
                <label className="block text-gray-400 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. Seaflows Micro 300W Panel"
                  className="w-full bg-[#0a1120] border border-gray-850 p-2 text-white rounded focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-gray-400 mb-1">Category Group</label>
                <select 
                  value={newProdCategory}
                  onChange={e => setNewProdCategory(e.target.value as any)}
                  className="w-full bg-[#0a1120] border border-gray-850 p-2 text-white rounded focus:outline-none"
                >
                  <option value="solar-panel">Solar Panels</option>
                  <option value="inverter">Hybrid Inverters</option>
                  <option value="battery">Lithium/Gel Batteries</option>
                  <option value="cctv-camera">CCTV Cameras</option>
                  <option value="cctv-recorder">Surveillance Recorders (NVR/DVR)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Price (NGN)</label>
                <input 
                  type="number" 
                  required
                  value={newProdPrice}
                  onChange={e => setNewProdPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#0a1120] border border-gray-850 p-2 text-white rounded focus:outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-gray-400 mb-1">Stock Vol</label>
                <input 
                  type="number" 
                  required
                  value={newProdStock}
                  onChange={e => setNewProdStock(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#0a1120] border border-gray-850 p-2 text-white rounded focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Manufacturer Brand</label>
                <input 
                  type="text" 
                  value={newProdBrand}
                  onChange={e => setNewProdBrand(e.target.value)}
                  className="w-full bg-[#0a1120] border border-gray-850 p-2 text-white rounded focus:outline-none"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-gray-400 mb-1">Technical Spec / Short Description</label>
                <input 
                  type="text" 
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Enter specifications..."
                  className="w-full bg-[#0a1120] border border-gray-850 p-2 text-white rounded focus:outline-none"
                />
              </div>

              <div className="md:col-span-12 flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsAddingProduct(false)} className="bg-gray-800 text-gray-300 py-1.5 px-4 rounded hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="bg-emerald-600 text-white py-1.5 px-4 rounded hover:bg-emerald-500 transition-colors">Secure Release</button>
              </div>
            </form>
          )}

          {/* Product matrix grid list */}
          <div className="bg-[#030913] rounded-xl border border-gray-850 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#09101f] text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-850">
                <tr>
                  <th className="p-3.5">Product ID</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5">Price Group</th>
                  <th className="p-3.5">Brand</th>
                  <th className="p-3.5 text-center">Action Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#070e1b]">
                    <td className="p-3.5 font-mono text-blue-400 font-bold">{p.id}</td>
                    <td className="p-3.5 font-medium text-white max-w-xs truncate">{p.name}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          disabled={adminRole === 'technician' || adminRole === 'support'}
                          value={p.stock}
                          onChange={e => handleSaveStockUpdate(p, Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-14 bg-[#0a1120] border border-gray-850 p-1 rounded font-mono text-white text-center disabled:opacity-50"
                        />
                        {p.stock <= 15 && (
                          <span className="text-[9px] text-amber-400 font-bold uppercase">Trigger limit</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 font-semibold">{formatNgn(p.price)}</td>
                    <td className="p-3.5 text-gray-300 font-serif">{p.brand}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          if (adminRole !== 'super') {
                            alert("Super Admin authorization required to prune catalogs.");
                            return;
                          }
                          onDeleteProduct(p.id);
                        }}
                        disabled={adminRole !== 'super'}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded transition-colors disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTENT SEGMENT 3: CUSTOM QUOTATIONS EVALUATION --- */}
      {activeAdminTab === 'quotes' && (
        <div id="admin-quotes-tab" className="flex flex-col gap-6">
          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Unprocessed Calculator Quotations Dashboard</h4>

          <div className="bg-[#030913] rounded-xl border border-gray-850 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#09101f] text-gray-400 uppercase tracking-widest text-[9px] border-b border-gray-850">
                <tr>
                  <th className="p-3.5">Calculated Date</th>
                  <th className="p-3.5">Client Name</th>
                  <th className="p-3.5">Quotation Layout / Details</th>
                  <th className="p-3.5">Cost NGN</th>
                  <th className="p-3.5 text-center">Security Status</th>
                  <th className="p-3.5 text-center">Vetting Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {savedQuotes.map((q, idx) => (
                  <tr key={idx} className="hover:bg-[#070e1b]">
                    <td className="p-3.5 text-gray-400 font-mono text-[10px]">{q.createdAt || 'Current Cycle'}</td>
                    <td className="p-3.5 font-medium text-white">
                      {q.clientName}
                      <span className="text-[10px] text-gray-500 block leading-tight">{q.clientPhone}</span>
                    </td>
                    <td className="p-3.5 text-gray-300 max-w-xs">
                      <span className="font-bold text-white block truncate text-[11px]">{q.recommendedSize || q.cameraType || 'Solar Load Matrix'}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{q.details || `${q.camerasCount || q.cameras || 4} Units. Backup retention scale.`}</span>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-emerald-400">{formatNgn(q.price)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        q.status === 'approved' 
                          ? 'bg-emerald-950/85 text-emerald-300' 
                          : q.status === 'rejected'
                            ? 'bg-red-950/85 text-red-300'
                            : 'bg-amber-950/85 text-amber-300'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleQuoteAction(q.id, q.type as any, 'approved')}
                          disabled={q.status !== 'pending' || adminRole === 'support'}
                          className="bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white p-1 rounded transition-all text-[10px] font-bold uppercase disabled:opacity-30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleQuoteAction(q.id, q.type as any, 'rejected')}
                          disabled={q.status !== 'pending' || adminRole === 'support'}
                          className="bg-red-1000/20 text-red-400 hover:bg-red-600 hover:text-white p-1 rounded transition-all text-[10px] font-bold uppercase disabled:opacity-30"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {savedQuotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 font-sans">No saved quotation sheets inside database records currently.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTENT SEGMENT 4: BOOKING SCHEDULES --- */}
      {activeAdminTab === 'bookings' && (
        <div id="admin-bookings-tab" className="flex flex-col gap-6">
          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider text-left">Mobilization Schedules & Field Engineers assignments</h4>

          <div className="bg-[#030913] rounded-xl border border-gray-850 overflow-hidden text-xs">
            <table className="w-full text-left font-sans">
              <thead className="bg-[#09101f] text-gray-400 uppercase tracking-widest text-[9px] border-b border-gray-850">
                <tr>
                  <th className="p-3.5">Ref Ticket</th>
                  <th className="p-3.5">Client Location Address</th>
                  <th className="p-3.5">Job Class Type</th>
                  <th className="p-3.5 text-center">Fulfillment State</th>
                  <th className="p-3.5">Field Engineer Assigned</th>
                  <th className="p-3.5 text-center">Coordination action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-xs">
                {bookings.map(bk => (
                  <tr key={bk.id} className="hover:bg-[#070e1b]">
                    <td className="p-3.5 font-mono text-blue-400 font-semibold">{bk.id}</td>
                    <td className="p-3.5 font-medium text-white max-w-xs">
                      {bk.clientName}
                      <span className="text-[10px] text-gray-500 block truncate leading-tight">{bk.message}</span>
                    </td>
                    <td className="p-3.5 font-bold uppercase text-gray-300">
                      {bk.serviceType} site mobilization
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        bk.status === 'completed'
                          ? 'bg-emerald-950/85 text-emerald-300'
                          : bk.status === 'assigned'
                            ? 'bg-blue-950/85 text-blue-300'
                            : 'bg-amber-950/85 text-amber-300'
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        disabled={adminRole === 'technician' || adminRole === 'support'}
                        value={bk.assignedTechnician || 'Allocate...'}
                        onChange={e => handleBookingSLAUpdate(bk.id, 'assigned', e.target.value)}
                        className="bg-[#0a1120] text-gray-200 border border-gray-800 p-1.5 rounded focus:outline-none disabled:opacity-50"
                      >
                        <option value="Allocate...">Allocate...</option>
                        <option value="Engr. Adebayo Chidi">Engr. Adebayo Chidi (Senior Solar Lead)</option>
                        <option value="Tch. Nelson Chukwu">Tch. Nelson Chukwu (CCTV Hardware spec)</option>
                        <option value="Engr. Yusuf Isa">Engr. Yusuf Isa (Power Microgrid designer)</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleBookingSLAUpdate(bk.id, 'completed', bk.assignedTechnician || 'Staff')}
                        disabled={bk.status === 'completed' || adminRole === 'support'}
                        className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-2 py-1.5 rounded text-[10px] font-bold uppercase shadow transition-all disabled:opacity-30"
                      >
                        Close Job Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTENT SEGMENT 5: TICKET COMPLAINTS INBOX --- */}
      {activeAdminTab === 'tickets' && (
        <div id="admin-tickets-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Ticketing Queue Logs:</span>
            
            {tickets.map(tk => (
              <div
                key={tk.id}
                className="bg-[#030913] border border-gray-850 p-4 rounded-xl flex flex-col gap-3 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white font-mono">{tk.id}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    tk.status === 'open' ? 'bg-amber-950/85 text-amber-300' : 'bg-emerald-950/85 text-emerald-300'
                  }`}>
                    {tk.status}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] block font-mono">CLIENT SUBJECT COMPILED</span>
                  <span className="text-white block font-bold leading-normal truncate">{tk.subject}</span>
                  <p className="text-gray-300 text-[11px] leading-relaxed italic mt-1 bg-[#0a1120] p-2 rounded border border-gray-900">"{tk.message}"</p>
                </div>

                {/* Form to submit reaction */}
                <form 
                  onSubmit={e => handleAdminTicketReplySubmit(e, tk.id)}
                  className="flex gap-2 border-t border-gray-900 pt-3 mt-1.5"
                >
                  <input
                    type="text"
                    required
                    value={adminTicketReply[tk.id] || ''}
                    onChange={e => setAdminTicketReply({
                      ...adminTicketReply,
                      [tk.id]: e.target.value
                    })}
                    placeholder="Lodge technical reply..."
                    className="flex-1 bg-[#070e1b] border border-gray-850 rounded p-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-[10px]"
                  >
                    Send
                  </button>
                </form>
              </div>
            ))}

            {tickets.length === 0 && (
              <div className="p-8 text-center bg-[#030913] border border-gray-850 rounded-xl text-gray-500 text-xs">
                Tickets queue is empty.
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4 bg-[#030913] border border-gray-850 rounded-xl p-5 text-xs">
            <h4 className="text-[#FDB813] text-xs font-bold uppercase tracking-wider mb-2">Helpdesk Coordination Matrix Rules</h4>
            
            <div className="flex flex-col gap-4 text-gray-300 leading-normal font-sans">
              <div className="p-3 bg-[#0a1120] rounded border-l-2 border-blue-500">
                <span className="font-bold text-white block">1. SLA Response Horizons:</span>
                <span>All priority complaints on active inverter storage depletion must be addressed by support operators within 15 minutes of logging.</span>
              </div>

              <div className="p-3 bg-[#0a1120] rounded border-l-2 border-emerald-500">
                <span className="font-bold text-white block">2. In-Depth Diagnostics Integration:</span>
                <span>When instructing the customer on system reboots, never advise bypass surgery of bypass switches. Direct clients to utilize remote circuit breakers.</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
