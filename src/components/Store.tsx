import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, ShoppingCart, Heart, RefreshCw, Eye, Star, Check, 
  Trash2, X, Plus, Minus, CreditCard, ShieldAlert, BadgeInfo, CheckCircle 
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface StoreProps {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  onAddToCart: (p: Product, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateCartQty: (id: string, qty: number) => void;
  onAddToWishlist: (p: Product) => void;
  onRemoveFromWishlist: (id: string) => void;
  onCheckout: (orderDetails: any) => void;
}

export default function SeaflowsStore({
  products,
  cart,
  wishlist,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQty,
  onAddToWishlist,
  onRemoveFromWishlist,
  onCheckout
}: StoreProps) {
  // Auto-scrolling anchor for product catalog variations
  const storeGridRef = React.useRef<HTMLDivElement | null>(null);

  // Navigation & filtering state
  const [activeSegment, setActiveSegment] = useState<'all' | 'solar' | 'cctv'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  React.useEffect(() => {
    if (activeSegment !== 'all' || selectedSubCategory !== 'all') {
      if (storeGridRef.current) {
        storeGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeSegment, selectedSubCategory]);

  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout Form State
  const [paymentGateway, setPaymentGateway] = useState<'paystack' | 'flutterwave' | 'stripe'>('paystack');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Formatting NGN Currency
  const formatNgn = (n: number) => '₦' + n.toLocaleString('en-NG');

  // Filter products
  const filteredProducts = products.filter(p => {
    // Segment check
    if (activeSegment === 'solar' && !p.category.startsWith('solar') && p.category !== 'inverter' && p.category !== 'battery') return false;
    if (activeSegment === 'cctv' && !p.category.startsWith('cctv')) return false;

    // Subcategory check
    if (selectedSubCategory !== 'all' && p.category !== selectedSubCategory) return false;

    // Search check
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Price check
    if (p.price < minPrice || p.price > maxPrice) return false;

    return true;
  });

  const allSubcategories = activeSegment === 'all' 
    ? ['all', 'solar-panel', 'inverter', 'battery', 'solar-accessory', 'cctv-camera', 'cctv-recorder', 'cctv-accessory']
    : activeSegment === 'solar'
      ? ['all', 'solar-panel', 'inverter', 'battery', 'solar-accessory']
      : ['all', 'cctv-camera', 'cctv-recorder', 'cctv-accessory'];

  // Comparison mechanics
  const handleToggleCompare = (product: Product) => {
    const exists = compareList.some(item => item.id === product.id);
    if (exists) {
      setCompareList(compareList.filter(item => item.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 products simultaneously.");
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    
    // Simulate premium financial security processing
    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalNgn: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        paymentMethod: paymentGateway.toUpperCase(),
        clientName: cardName,
        clientAddress: deliveryAddress,
        clientPhone: clientPhone
      };

      onCheckout(orderData);
      
      // Clear forms
      setTimeout(() => {
        setPaymentDone(false);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        // Clear variables
        setCardName('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setDeliveryAddress('');
        setClientPhone('');
      }, 3000);
    }, 2500);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div id="store-ecosystem" className="flex flex-col gap-6 text-white bg-[#060c18] p-6 rounded-2xl border border-gray-800">
      
      {/* Sub Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
            Seaflows Digital Storefront
          </h2>
          <p className="text-gray-400 text-xs">Certified solar microgrids & high-grade bullet surveillance systems with nationwide dispatch.</p>
        </div>

        {/* Action icons shortcut */}
        <div className="flex items-center gap-3">
          <button
            id="compare-trigger"
            onClick={() => setIsCompareOpen(true)}
            className="relative p-2.5 bg-[#0e182a] border border-gray-800 rounded-xl hover:bg-[#15243f] transition-all flex items-center gap-1.5 text-xs text-gray-300 font-bold"
          >
            <RefreshCw size={14} className={compareList.length > 0 ? "animate-spin" : ""} />
            Compare ({compareList.length})
          </button>
          <button
            id="wishlist-trigger"
            className="p-2.5 bg-[#0e182a] border border-gray-800 rounded-xl hover:bg-[#15243f] transition-all flex items-center gap-1.5 text-xs text-gray-300 font-bold"
          >
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            Wishlist ({wishlist.length})
          </button>
          <button
            id="cart-trigger"
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 bg-[#FDB813] text-[#0A2342] rounded-xl hover:bg-amber-400 font-bold flex items-center gap-1.5 text-xs transition-transform transform active:scale-95"
          >
            <ShoppingCart size={14} />
            Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
          </button>
        </div>
      </div>

      {/* Primary Category Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#030812] p-2.5 rounded-xl border border-gray-800/80">
        <div className="flex gap-1.5">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'solar', label: 'Solar Energy Products' },
            { id: 'cctv', label: 'CCTV Security Systems' }
          ].map(seg => (
            <button
              key={seg.id}
              onClick={() => {
                setActiveSegment(seg.id as any);
                setSelectedSubCategory('all');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
                activeSegment === seg.id 
                  ? 'bg-[#FDB813] text-[#0A2342]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#0d1624]'
              }`}
            >
              {seg.label}
            </button>
          ))}
        </div>

        {/* Global Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search panels, AI cameras, NVRs..."
            className="w-full bg-[#0a1120] text-xs text-white pl-9 pr-4 py-2.5 rounded-lg border border-gray-800 focus:outline-none focus:border-[#FDB813] transition-colors"
          />
        </div>
      </div>

      {/* Sub-Category Filters Rail */}
      <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
        {allSubcategories.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubCategory(sub)}
            className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest rounded-full transition-colors border ${
              selectedSubCategory === sub 
                ? 'bg-blue-600/20 text-blue-300 border-blue-500' 
                : 'bg-[#090f1a] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            {sub.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Core Products Grid */}
      <div ref={storeGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scroll-mt-24">
        {filteredProducts.map(p => {
          const isComparing = compareList.some(item => item.id === p.id);
          const inWish = wishlist.some(item => item.id === p.id);
          const inCart = cart.some(item => item.product.id === p.id);

          return (
            <div
              key={p.id}
              className="bg-[#030913] rounded-xl border border-gray-800 hover:border-gray-700/80 p-4 flex flex-col gap-3 transition-all hover:shadow-lg relative"
            >
              {/* Product Badge Category */}
              <div className="flex justify-between items-start gap-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/40">
                  {p.category.split('-')[0]}
                </span>
                
                {/* Low Stock Indicator */}
                {p.stock <= 15 && (
                  <span className="text-[8px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded flex items-center gap-0.5 border border-amber-900/30">
                    <ShieldAlert size={8} /> Only {p.stock} Left
                  </span>
                )}
              </div>

              {/* Minimal Illustration placeholder to avoid missing images */}
              <div className="h-40 bg-[#0a1120] rounded-lg flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#FDB813]/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon mapping based on categories to provide striking visuals */}
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-gray-900/50 rounded-full text-[#FDB813] group-hover:scale-105 transition-transform duration-300">
                    {p.category === 'solar-panel' && (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="12" y1="3" x2="21" y2="12" />
                        <line x1="3" y1="12" x2="12" y2="21" />
                      </svg>
                    )}
                    {p.category === 'inverter' && (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                        <circle cx="7" cy="12" r="2" fill="currentColor" />
                        <circle cx="17" cy="12" r="2" fill="currentColor" />
                        <line x1="11" y1="8" x2="13" y2="16" />
                      </svg>
                    )}
                    {p.category === 'battery' && (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="4" y="6" width="16" height="14" rx="2" strokeWidth="2" />
                        <line x1="8" y1="3" x2="8" y2="6" strokeWidth="3"/>
                        <line x1="16" y1="3" x2="16" y2="6" strokeWidth="3"/>
                        <line x1="8" y1="13" x2="16" y2="13" strokeWidth="2" />
                        <line x1="12" y1="10" x2="12" y2="16" strokeWidth="2" />
                      </svg>
                    )}
                    {p.category.startsWith('cctv') && (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2Z" />
                        <circle cx="12" cy="13" r="4" strokeWidth="2"/>
                        <circle cx="21" cy="9" r="1" fill="currentColor"/>
                      </svg>
                    )}
                    {!['solar-panel', 'inverter', 'battery', 'cctv-camera', 'cctv-recorder'].includes(p.category) && (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12,2 2,22 22,22" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono text-center tracking-wider">{p.brand} GENUINE</span>
                </div>

                {/* Floating quick actions */}
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleToggleCompare(p)}
                    className={`p-1.5 rounded-lg border text-white transition-colors ${
                      isComparing ? 'bg-blue-600 border-blue-500' : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                    }`}
                    title="Compare specifications"
                  >
                    <RefreshCw size={11} />
                  </button>
                  <button
                    onClick={() => inWish ? onRemoveFromWishlist(p.id) : onAddToWishlist(p)}
                    className="p-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 text-rose-500 transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart size={11} fill={inWish ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-heading font-bold text-xs text-white line-clamp-2 leading-snug hover:text-[#FDB813] cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  {p.name}
                </h3>
                
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                  <Star size={10} className="text-[#FDB813] fill-[#FDB813]" />
                  <span className="font-semibold text-white">{p.rating}</span>
                  <span>({p.reviews.length} reviews)</span>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-850 flex justify-between items-end">
                  <span className="text-sm font-heading font-extrabold text-emerald-400">{formatNgn(p.price)}</span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{p.brand}</span>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => setSelectedProduct(p)}
                  className="bg-[#0b1424] hover:bg-[#111f38] border border-gray-800 py-2 rounded-lg text-[11px] font-bold text-gray-300 flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye size={12} /> View Details
                </button>
                <button
                  onClick={() => onAddToCart(p, 1)}
                  className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                    inCart 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-[#FDB813] hover:bg-amber-400 text-[#0A2342]'
                  }`}
                >
                  {inCart ? <CheckCircle size={12} /> : <Plus size={12} />}
                  {inCart ? 'In Cart' : 'Buy Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- CART DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-md bg-[#070e1b] border-l border-gray-800 h-full flex flex-col p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-[#FDB813]" size={20} />
                  <span className="font-heading font-extrabold text-white text-base">Your Cart Items</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.product.id} className="bg-[#030913] p-3 rounded-lg border border-gray-800 flex justify-between items-center gap-3">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-white block line-clamp-1">{item.product.name}</span>
                      <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">{formatNgn(item.product.price)}</span>
                    </div>

                    {/* Qty selectors */}
                    <div className="flex items-center gap-2 bg-[#0a1120] px-2 py-1 rounded-md border border-gray-800 shrink-0">
                      <button onClick={() => onUpdateCartQty(item.product.id, Math.max(1, item.quantity - 1))} className="text-gray-400 hover:text-white p-1">
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                      <button onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)} className="text-gray-400 hover:text-white p-1">
                        <Plus size={11} />
                      </button>
                    </div>

                    <button onClick={() => onRemoveFromCart(item.product.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {cart.length === 0 && (
                  <div className="h-full flex flex-col justify-center items-center text-center p-8 text-gray-500">
                    <ShoppingCart size={40} className="text-gray-700 mb-2" />
                    <span className="text-xs">Your shopping cart is currently empty. Add products to get started.</span>
                  </div>
                )}
              </div>

              {/* Sum & checkout checkout info */}
              {cart.length > 0 && (
                <div className="border-t border-gray-800 pt-5 mt-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-xs text-gray-400 uppercase">Subtotal Accumulation</span>
                    <span className="text-lg text-[#FDB813] font-heading font-extrabold">{formatNgn(cartTotal)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-[#FDB813] hover:bg-amber-400 text-[#0A2342] py-3 rounded-xl text-xs font-heading font-extrabold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    Secure Online Checkout <CreditCard size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SIDE-BY-SIDE COMPARE DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#070e1b] border border-gray-800 w-full max-w-4xl p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                <span className="font-heading font-extrabold text-white text-base">Specifications Side-by-Side Comparison</span>
                <button onClick={() => setIsCompareOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-y-auto">
                {compareList.map(item => (
                  <div key={item.id} className="bg-[#030913] p-4 rounded-xl border border-gray-850 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1 mb-2">
                        <span className="text-[10px] font-mono text-[#FDB813] uppercase">{item.brand}</span>
                        <button onClick={() => handleToggleCompare(item)} className="text-red-400 hover:text-red-300 p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">{item.name}</h4>
                      <span className="text-lg font-extrabold text-emerald-400 block mb-4">{formatNgn(item.price)}</span>

                      <div className="flex flex-col gap-2.5 text-[11px] border-t border-gray-850 pt-3">
                        {Object.entries(item.specifications).map(([k, v]) => (
                          <div key={k} className="border-b border-gray-900 pb-1.5">
                            <span className="text-gray-400 block text-[9px] uppercase tracking-wider">{k}</span>
                            <span className="text-gray-200 font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(item, 1)}
                      className="w-full bg-[#101b30] hover:bg-blue-900 border border-gray-800 py-2 rounded-lg text-xs font-bold font-heading text-white transition-colors mt-6"
                    >
                      Add to Basket
                    </button>
                  </div>
                ))}

                {compareList.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-500">
                    <RefreshCw size={40} className="mx-auto text-gray-700 mb-2" />
                    <span>No products chosen. Tap the comparison icon on any product in the store.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DETAILED PRODUCT DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#070e1b] border border-gray-800 w-full max-w-2xl p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-5"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="font-heading font-extrabold text-white text-base">Product Technical Sheet</span>
                <button onClick={() => setSelectedProduct(null)} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#FDB813] font-mono text-[11px] tracking-wider uppercase font-bold">{selectedProduct.brand} ORIGINAL</span>
                    <span className="text-[10px] text-gray-400">STOCK IN NIGERIA: {selectedProduct.stock} UNITS</span>
                  </div>
                  <h3 className="text-sm font-heading font-extrabold text-white">{selectedProduct.name}</h3>
                </div>

                <div className="p-4 bg-[#030913] rounded-xl border border-gray-850 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Catalog Spot price</span>
                    <span className="text-xl font-heading font-extrabold text-emerald-400">{formatNgn(selectedProduct.price)}</span>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="bg-[#FDB813] text-[#0A2342] hover:bg-amber-400 px-5 py-2.5 rounded-lg text-xs font-bold leading-none uppercase tracking-wider transition-colors"
                  >
                    Add to Cart basket
                  </button>
                </div>

                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800 pb-1.5 mb-2">Description / Engineering</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{selectedProduct.description}</p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800 pb-1.5 mb-2">Technical Matrix Specification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedProduct.specifications).map(([k, v]) => (
                      <div key={k} className="p-2.5 bg-[#030913] border border-gray-850 text-xs rounded-lg flex justify-between">
                        <span className="text-gray-400">{k}</span>
                        <span className="text-white font-bold text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews listing */}
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800 pb-1.5 mb-2">Customer Feedback Review</h4>
                  {selectedProduct.reviews.map(rev => (
                    <div key={rev.id} className="bg-[#030913] p-3 rounded-lg border border-gray-850 flex flex-col gap-1.5 mb-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{rev.user}</span>
                        <div className="flex gap-0.5 text-[#FDB813]">
                          {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={10} className="fill-current" />)}
                        </div>
                      </div>
                      <p className="text-gray-300 italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-gray-500 font-mono text-right">{rev.date}</span>
                    </div>
                  ))}
                  {selectedProduct.reviews.length === 0 && (
                    <span className="text-xs text-gray-500 italic">No reviews compiled for this physical item yet. Feel free to leave a post-purchase log.</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SECURE CHECKOUT POPUP / FORM --- */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#070e1b] border border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
                <span className="font-heading font-extrabold text-white text-base">Secure Gateway E-Checkout</span>
                <button onClick={() => setIsCheckoutOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {paymentDone ? (
                <div id="payment-success" className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="p-3 bg-emerald-900/40 text-emerald-300 rounded-full border border-emerald-800 animate-bounce">
                    <CheckCircle size={36} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">Payment Authorized Successfully!</h3>
                    <p className="text-gray-400 text-xs mt-1">Thank you. An automated representative will reach out to you within 2 hour cycles to verify your site address coordinates.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4 text-xs">
                  
                  {/* Total Value */}
                  <div className="p-4 bg-[#0a1528] rounded-xl border border-gray-800 flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Grand Total Outlay</span>
                    <span className="text-lg font-heading font-extrabold text-[#FDB813]">{formatNgn(cartTotal)}</span>
                  </div>

                  {/* Payment gateway select */}
                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-2">Integrated Gateway Router</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'paystack', label: 'Paystack' },
                        { id: 'flutterwave', label: 'Flutterwave' },
                        { id: 'stripe', label: 'Stripe' }
                      ].map(g => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setPaymentGateway(g.id as any)}
                          className={`py-2 px-1 rounded-lg border text-center font-bold tracking-wider transition-colors uppercase text-[9px] ${
                            paymentGateway === g.id 
                              ? 'bg-blue-600/20 text-blue-300 border-blue-500' 
                              : 'bg-[#030913] text-gray-400 border-gray-850 hover:border-gray-700'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-850 my-1"/>

                  {/* Client Info */}
                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Active Phone/WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      className="w-full bg-[#030913] border border-gray-850 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FDB813]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Physical Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. 15 Allen Avenue, Ikeja, Lagos"
                      className="w-full bg-[#030913] border border-gray-850 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Card values inputs */}
                  <div className="p-3 bg-[#030913] rounded-xl border border-gray-850 flex flex-col gap-3">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block border-b border-gray-900 pb-1.5 flex items-center gap-1">
                      <CreditCard size={10} /> Debit / Credit Secure Card Details
                    </span>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Cardholders Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        placeholder="e.g. Chinedu Yusuf Adeleke"
                        className="w-full bg-[#070e1b] border border-gray-850 rounded-md p-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">16-Digit Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        placeholder="4321 0000 8731 2294"
                        className="w-full bg-[#070e1b] border border-gray-850 rounded-md p-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          maxLength={5}
                          placeholder="09/29"
                          className="w-full bg-[#070e1b] border border-gray-850 rounded-md p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">CVV Pin</label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          maxLength={3}
                          placeholder="***"
                          className="w-full bg-[#070e1b] border border-gray-850 rounded-md p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full bg-[#FDB813] hover:bg-amber-400 text-[#0A2342] py-3 rounded-xl text-xs font-heading font-extrabold uppercase tracking-widest transition-opacity flex items-center justify-center gap-1.5"
                  >
                    {isPaying ? 'Authenticating payment...' : `PAY ${formatNgn(cartTotal)} SECURELY`}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
