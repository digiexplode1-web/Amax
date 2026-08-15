import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, setDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useShop } from '../../context/ShopContext';
import { 
  Trash2, Search, Filter, Upload, X, Link as LinkIcon, Check, Copy, Plus, 
  Eye, Save, ShoppingBag, Calendar, ChevronRight, TrendingUp, DollarSign, 
  RefreshCw, LayoutTemplate, Smartphone, Monitor, ShieldCheck, Phone, Mail, MapPin, 
  Sparkles, Layers, ListFilter
} from 'lucide-react';

// ============================================================================
// 1. MEDIA LIBRARY COMPONENT
// ============================================================================
export const MediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Jalis');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Default fallback curated media assets if database is empty
  const defaultAssets = [
    {
      id: 'def-1',
      name: 'Geometric Laser Cut Jali Partition',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      category: 'Jalis',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'def-2',
      name: 'Curved Teak Room Divider Screen',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      category: 'Dividers',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'def-3',
      name: 'Matte Golden Staircase Balcony Strip',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      category: 'Railing',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'def-4',
      name: 'Exterior Architectural Facade Panel',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      category: 'Facade',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'def-5',
      name: 'Indian Wedding Ceremony Backdrop Mandap',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      category: 'Wedding',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMediaList(data);
      setLoading(false);
    }, (error) => {
      console.warn("Media listener status:", error.message || error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Url = reader.result as string;
        await addDoc(collection(db, 'media'), {
          name: file.name.split('.')[0].replace(/[-_]/g, ' '),
          url: base64Url,
          category: 'Uploads',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to upload file to Firestore:", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newName) return;
    setUploading(true);
    try {
      await addDoc(collection(db, 'media'), {
        name: newName,
        url: newUrl,
        category: newCategory,
        createdAt: new Date().toISOString()
      });
      setNewUrl('');
      setNewName('');
      setIsAddingLink(false);
    } catch (err) {
      console.error("Failed to add link:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('def-')) {
      alert("Curated assets cannot be deleted. Upload custom files to test deletion.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this media file?')) {
      try {
        await deleteDoc(doc(db, 'media', id));
      } catch (err) {
        console.error("Failed to delete media:", err);
      }
    }
  };

  // Combine Firestore uploads with preset fallback assets
  const combinedMedia = [...mediaList, ...defaultAssets.filter(def => !mediaList.some(m => m.name === def.name))];

  const filteredMedia = combinedMedia.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Media Library</h1>
          <p className="text-[#756A64] text-sm mt-1">Upload and manage visual assets for jali designs & categories.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddingLink(!isAddingLink)}
            className="px-4 py-2 border border-[#F4E3DD] text-[#756A64] hover:bg-[#FFF9F0] rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
            Add Image Link
          </button>
          <button
            onClick={() => document.getElementById('media-direct-upload')?.click()}
            className="px-4 py-2 bg-[#751C2F] text-white hover:bg-[#591423] rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
          <input
            type="file"
            id="media-direct-upload"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {isAddingLink && (
        <form onSubmit={handleAddLink} className="bg-white p-5 rounded-xl border border-[#F4E3DD] shadow-sm space-y-4 max-w-xl">
          <h3 className="font-semibold text-sm text-[#25201E]">Add Web Image Asset</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#756A64] mb-1">Asset Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Laser Cut Mandap Jali"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs border border-[#F4E3DD] p-2 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#756A64] mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs border border-[#F4E3DD] p-2 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
              >
                <option value="Jalis">CNC Jalis</option>
                <option value="Dividers">Room Partitions</option>
                <option value="Railing">Railing Strips</option>
                <option value="Facade">Facade Screens</option>
                <option value="Wedding">Wedding Accessories</option>
                <option value="Uploads">General Uploads</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#756A64] mb-1">Direct Image URL</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full text-xs border border-[#F4E3DD] p-2 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
            />
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddingLink(false)}
              className="px-3 py-1.5 border border-[#F4E3DD] text-[#756A64] rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#751C2F] text-white rounded-lg text-xs hover:bg-[#591423]"
            >
              Add Asset
            </button>
          </div>
        </form>
      )}

      {/* Upload Drag & Drop Box */}
      {!isAddingLink && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('media-direct-upload')?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-[#C7953E] bg-[#FFF9F0]' 
              : 'border-[#F4E3DD] hover:border-[#C7953E] bg-white hover:bg-[#FFF9F0]/20'
          }`}
        >
          {uploading ? (
            <div className="space-y-2">
              <RefreshCw className="w-8 h-8 mx-auto text-[#C7953E] animate-spin" />
              <p className="text-sm font-medium text-[#25201E]">Uploading image file to server...</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-[#756A64] mb-2" />
              <p className="text-sm font-semibold text-[#25201E]">Drag and drop files here, or click to browse</p>
              <p className="text-xs text-[#756A64] mt-1">Image files are processed locally and stored in database</p>
            </>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-[#F4E3DD] shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756A64]" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg text-xs focus:outline-none focus:border-[#C7953E] text-[#25201E]"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'jalis', 'dividers', 'railing', 'facade', 'wedding', 'uploads'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#751C2F] text-white'
                  : 'bg-[#FFF9F0] text-[#756A64] hover:bg-[#F4E3DD]/40 border border-[#F4E3DD]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-8 h-8 text-[#751C2F] animate-spin" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] py-16 text-center">
          <p className="text-sm text-[#756A64]">No media assets matching the filters were found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#F4E3DD] overflow-hidden group shadow-sm flex flex-col justify-between">
              <div className="relative aspect-square w-full bg-[#FFF9F0] overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
                  {item.category}
                </div>
                {/* Overlay Options */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    className="p-1.5 bg-white text-[#25201E] rounded-md hover:bg-[#FFF9F0] cursor-pointer"
                    title="Copy Image Address"
                  >
                    {copySuccess === item.url ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#756A64]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                    title="Delete Media File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-[#25201E] text-xs truncate" title={item.name}>{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#756A64]/70">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {copySuccess === item.url && (
                    <span className="text-[10px] text-emerald-600 font-medium">Copied Link!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ============================================================================
// 2. ADMIN ORDERS MANAGEMENT COMPONENT
// ============================================================================
export const Orders: React.FC = () => {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Default mock test orders if database has no active checkout orders yet
  const defaultOrders = [
    {
      id: 'AMAX-49102',
      customerName: 'Ayush Goel',
      customerEmail: 'ayushg1020@gmail.com',
      customerPhone: '+91 98765 43210',
      address: 'Suite 203, Block B, Gold Plaza, New Delhi - 110001',
      items: [
        {
          productName: 'CNC Laser Cut Geometric Room Divider Jali',
          price: 12500,
          quantity: 2,
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
          selectedFinish: 'Antique Brass'
        }
      ],
      totalAmount: 29500, // including gst
      paymentMethod: 'WhatsApp Direct / Bank Transfer',
      status: 'Pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 'AMAX-48391',
      customerName: 'Meera Nair',
      customerEmail: 'meera@nairdesigns.co',
      customerPhone: '+91 91234 56789',
      address: 'Penthouse A, Skyline Heights, Bangalore, Karnataka - 560001',
      items: [
        {
          productName: 'Traditional Royal Floral Mandap Jali Panel',
          price: 18900,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
          selectedFinish: 'Royal Metallic Gold'
        },
        {
          productName: 'Staircase Designer Railing Strips Set',
          price: 7500,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
          selectedFinish: 'Satin Gold'
        }
      ],
      totalAmount: 31150,
      paymentMethod: 'UPI Direct / GPay',
      status: 'Processing',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'AMAX-47201',
      customerName: 'Siddharth Sen',
      customerEmail: 'siddharth@modernarch.in',
      customerPhone: '+91 88776 65544',
      address: '7C, Sea Breeze Apartments, Bandra West, Mumbai, Maharashtra - 400050',
      items: [
        {
          productName: 'Modern Designer Balcony Privacy Screen',
          price: 9800,
          quantity: 3,
          imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
          selectedFinish: 'UV Weatherproof Black Matte'
        }
      ],
      totalAmount: 34692,
      paymentMethod: 'Bank Wire Transfer',
      status: 'Completed',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrdersList(data);
      setLoading(false);
    }, (error) => {
      console.warn("Orders listener status:", error.message || error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (orderId.startsWith('AMAX-')) {
      alert("Sample/Mock orders cannot be modified. Submit a real order in the storefront checkout to test full state modification.");
      return;
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (orderId.startsWith('AMAX-')) {
      alert("Sample/Mock orders cannot be deleted.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this order from database history?')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        setSelectedOrder(null);
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };

  // Merge Firestore live data with premium mock items
  const combinedOrders = [...ordersList, ...defaultOrders.filter(def => !ordersList.some(o => o.customerEmail === def.customerEmail))];

  const filteredOrders = combinedOrders.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(term) ||
      order.customerEmail?.toLowerCase().includes(term) ||
      order.id?.toLowerCase().includes(term);
    const matchesStatus = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Analytics helper calculations
  const totalSalesRevenue = combinedOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingCount = combinedOrders.filter(o => o.status === 'Pending').length;
  const processingCount = combinedOrders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const completedCount = combinedOrders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Admin Orders</h1>
          <p className="text-[#756A64] text-sm mt-1">Review customer orders, update delivery milestones, and confirm custom CAD finishes.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#F4E3DD] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#FFF9F0] rounded-xl text-[#C7953E]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#756A64]">Gross Revenue</p>
            <p className="text-xl font-serif font-bold text-[#25201E] mt-0.5">₹{totalSalesRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#F4E3DD] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#FFF9F0] rounded-xl text-amber-600">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#756A64]">Pending Confirmation</p>
            <p className="text-xl font-serif font-bold text-[#25201E] mt-0.5">{pendingCount} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#F4E3DD] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#FFF9F0] rounded-xl text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#756A64]">In Production</p>
            <p className="text-xl font-serif font-bold text-[#25201E] mt-0.5">{processingCount} Active</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#F4E3DD] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#756A64]">Completed Orders</p>
            <p className="text-xl font-serif font-bold text-[#25201E] mt-0.5">{completedCount} Dispatched</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-[#F4E3DD] shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756A64]" />
          <input
            type="text"
            placeholder="Search customer name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg text-xs focus:outline-none focus:border-[#C7953E] text-[#25201E]"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#751C2F] text-white font-semibold'
                  : 'bg-[#FFF9F0] text-[#756A64] hover:bg-[#F4E3DD]/40 border border-[#F4E3DD]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Order List Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-8 h-8 text-[#751C2F] animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-[#756A64]/40 mx-auto mb-2" />
          <p className="text-sm text-[#756A64]">No active customer orders match the current filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#F4E3DD] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FFF9F0]/60 border-b border-[#F4E3DD]">
                  <th className="p-4 font-bold text-[#25201E]">Order ID</th>
                  <th className="p-4 font-bold text-[#25201E]">Customer</th>
                  <th className="p-4 font-bold text-[#25201E]">Items</th>
                  <th className="p-4 font-bold text-[#25201E]">Total Amount</th>
                  <th className="p-4 font-bold text-[#25201E]">Milestone Status</th>
                  <th className="p-4 font-bold text-[#25201E] text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E3DD]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFF9F0]/20 transition-colors group">
                    <td className="p-4 font-mono font-semibold text-[#751C2F]">
                      #{order.id.slice(0, 10).toUpperCase()}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-[#25201E]">{order.customerName}</p>
                      <p className="text-[10px] text-[#756A64]/70 mt-0.5">{order.customerEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-[#25201E] truncate max-w-xs">
                        {order.items?.map((it: any) => `${it.productName} (x${it.quantity})`).join(', ') || 'No Items'}
                      </p>
                    </td>
                    <td className="p-4 font-semibold text-[#25201E]">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 text-xs border border-[#F4E3DD] text-[#751C2F] hover:bg-[#751C2F] hover:text-white rounded-lg transition-colors cursor-pointer font-medium"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#F4E3DD] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 bg-[#FFF9F0] border-b border-[#F4E3DD] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C7953E] tracking-wider">Order Audit Panel</span>
                <h3 className="font-serif font-bold text-lg text-[#751C2F]">Order details - #{selectedOrder.id.slice(0, 10).toUpperCase()}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-[#F4E3DD] text-[#756A64] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Grid 1: Customer details & Status change */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#756A64]">Customer Profile</h4>
                  <div className="space-y-2 text-xs">
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#C7953E]" /> {selectedOrder.customerPhone}</p>
                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#C7953E]" /> {selectedOrder.customerEmail}</p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C7953E] mt-0.5" /> 
                      <span className="leading-relaxed">{selectedOrder.address}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#756A64]">Update Fulfilment Stage</h4>
                  <div>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="w-full text-xs border border-[#F4E3DD] p-2.5 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
                    >
                      <option value="Pending">Pending Confirmation</option>
                      <option value="Processing">In Production / Processing</option>
                      <option value="Shipped">Dispatched / Shipped</option>
                      <option value="Completed">Completed & Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <p className="text-[10px] text-[#756A64] mt-1.5 leading-normal">
                      Changing status alerts our production line. Sample orders starting with <b>AMAX-</b> are mock records for test previews.
                    </p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-4 border-t border-[#F4E3DD]">
                <h4 className="text-xs font-bold uppercase text-[#756A64]">Ordered Items ({selectedOrder.items?.length || 0})</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 p-3 bg-[#FFF9F0]/40 rounded-xl border border-[#F4E3DD]/60 items-center">
                      <img src={item.imageUrl} alt="" className="w-12 h-12 object-cover rounded bg-white shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-[#25201E] truncate">{item.productName}</p>
                        <p className="text-[10px] text-[#756A64] mt-0.5">Finish Option: <b>{item.selectedFinish || 'Standard'}</b></p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-xs text-[#25201E]">₹{item.price?.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-[#756A64] mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary and delete */}
              <div className="pt-4 border-t border-[#F4E3DD] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#756A64]">Payment Method: <b>{selectedOrder.paymentMethod}</b></p>
                  <p className="text-[10px] text-[#756A64] mt-0.5">Created Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-[#756A64]">Grand Total (incl. GST)</p>
                  <p className="text-lg font-serif font-bold text-[#751C2F]">₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-gray-50 border-t border-[#F4E3DD] flex justify-between items-center">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-[#751C2F] text-white hover:bg-[#591423] text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ============================================================================
// 3. VISUAL WEBSITE PAGE EDITOR
// ============================================================================
export const VisualEditor: React.FC = () => {
  const { homepageSettings, updateHomepageSettings } = useShop();
  const [activeTab, setActiveTab] = useState<'settings' | 'layout'>('settings');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Store configurable visual blocks
  const [sections, setSections] = useState({
    promoBanner: true,
    heroSection: true,
    featureCategories: true,
    newArrivals: true,
    statsSection: true,
    aboutUs: true
  });

  const [headerConfig, setHeaderConfig] = useState({
    heading: 'WELCOME TO',
    highlighted: 'AMAX CRAFT',
    subheading: 'Your Home Creating Beautiful Ambience',
    promoText: '🎉 Free Shipping on all orders above ₹50,000! Use code AMAXFREE'
  });

  useEffect(() => {
    if (homepageSettings) {
      setHeaderConfig({
        heading: homepageSettings.hero?.heading || 'WELCOME TO',
        highlighted: homepageSettings.hero?.highlightedWord || 'AMAX CRAFT',
        subheading: homepageSettings.hero?.subheading || 'Your Home Creating Beautiful Ambience',
        promoText: homepageSettings.announcementText || '🎉 Free Shipping on all orders above ₹50,000! Use code AMAXFREE'
      });
    }
  }, [homepageSettings]);

  const handleToggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveLayout = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const payload = {
        hero: {
          heading: headerConfig.heading,
          highlightedWord: headerConfig.highlighted,
          subheading: headerConfig.subheading,
          description: homepageSettings?.hero?.description || 'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision.',
          backgroundImageUrl: homepageSettings?.hero?.backgroundImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          badgeText: homepageSettings?.hero?.badgeText || 'Laser Cut Craftsmanship & Architectural Jalis',
          primaryButtonText: homepageSettings?.hero?.primaryButtonText || 'Explore Full Catalog',
          secondaryButtonText: homepageSettings?.hero?.secondaryButtonText || 'Chat on WhatsApp',
          secondaryButtonLink: homepageSettings?.hero?.secondaryButtonLink || 'https://wa.me/918514000016'
        },
        announcementText: headerConfig.promoText
      };
      await updateHomepageSettings(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Visual Page Editor</h1>
          <p className="text-[#756A64] text-sm mt-1">Configure sections of the customer store, toggle headers, and see changes live.</p>
        </div>
        <button
          onClick={handleSaveLayout}
          disabled={saving}
          className="px-5 py-2.5 bg-[#751C2F] text-white hover:bg-[#591423] rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Publishing...' : 'Publish to Storefront'}
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-medium">
          <Check className="w-4.5 h-4.5 text-emerald-600" />
          Storefront updated successfully! Refresh your customer browser tab to see updates in real-time.
        </div>
      )}

      {/* Editor & Live Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Controls (size 5/12) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-[#F4E3DD] bg-[#FFF9F0]/60 flex">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'settings' 
                  ? 'border-[#751C2F] text-[#751C2F]' 
                  : 'border-transparent text-[#756A64] hover:text-[#751C2F]'
              }`}
            >
              Text & Headings
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'layout' 
                  ? 'border-[#751C2F] text-[#751C2F]' 
                  : 'border-transparent text-[#756A64] hover:text-[#751C2F]'
              }`}
            >
              Toggle Sections
            </button>
          </div>

          <div className="p-5 space-y-4">
            {activeTab === 'settings' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#756A64] mb-1">Top Announcement Bar</label>
                  <input
                    type="text"
                    value={headerConfig.promoText}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, promoText: e.target.value }))}
                    className="w-full text-xs border border-[#F4E3DD] p-2.5 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#756A64] mb-1">Hero Heading Prefix</label>
                  <input
                    type="text"
                    value={headerConfig.heading}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, heading: e.target.value }))}
                    className="w-full text-xs border border-[#F4E3DD] p-2.5 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#756A64] mb-1">Hero Highlighted Word</label>
                  <input
                    type="text"
                    value={headerConfig.highlighted}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, highlighted: e.target.value }))}
                    className="w-full text-xs border border-[#F4E3DD] p-2.5 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#756A64] mb-1">Hero Subheading Statement</label>
                  <textarea
                    rows={2}
                    value={headerConfig.subheading}
                    onChange={(e) => setHeaderConfig(prev => ({ ...prev, subheading: e.target.value }))}
                    className="w-full text-xs border border-[#F4E3DD] p-2.5 rounded-lg bg-white outline-none focus:border-[#C7953E] text-[#25201E]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] text-[#756A64] mb-3 leading-normal">
                  Toggle which dynamic rows show or hide instantly on the public catalog home.
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Announcement Bar', key: 'promoBanner' as const },
                    { label: 'Hero Banner Section', key: 'heroSection' as const },
                    { label: 'Featured Categories row', key: 'featureCategories' as const },
                    { label: 'New Arrivals Product Grid', key: 'newArrivals' as const },
                    { label: 'Architectural Specs Stats Block', key: 'statsSection' as const },
                    { label: 'About Us / Brand Story Frame', key: 'aboutUs' as const }
                  ].map((row) => (
                    <label key={row.key} className="flex items-center justify-between p-2.5 bg-[#FFF9F0]/30 rounded-lg border border-[#F4E3DD] hover:bg-[#FFF9F0]/60 transition-colors cursor-pointer">
                      <span className="text-xs font-medium text-[#25201E]">{row.label}</span>
                      <input
                        type="checkbox"
                        checked={sections[row.key]}
                        onChange={() => handleToggleSection(row.key)}
                        className="rounded border-[#F4E3DD] text-[#751C2F] focus:ring-[#C7953E] cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Beautiful Simulated Frame (size 7/12) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#756A64] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C7953E]" /> Interactive Storefront Live Preview
            </span>
            <div className="bg-white border border-[#F4E3DD] p-1 rounded-lg flex gap-1 shadow-sm">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md cursor-pointer ${previewDevice === 'desktop' ? 'bg-[#FFF9F0] text-[#751C2F]' : 'text-[#756A64]'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-md cursor-pointer ${previewDevice === 'mobile' ? 'bg-[#FFF9F0] text-[#751C2F]' : 'text-[#756A64]'}`}
                title="Mobile Aspect Frame"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`mx-auto bg-white border border-[#F4E3DD] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
            previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'
          }`}>
            {/* Announcement bar */}
            {sections.promoBanner && (
              <div className="bg-[#751C2F] text-[#FFF9F0] text-[9px] py-1 text-center font-bold font-sans overflow-hidden whitespace-nowrap text-ellipsis px-4">
                {headerConfig.promoText}
              </div>
            )}

            {/* Logo bar */}
            <div className="px-4 py-2 bg-[#FFF9F0]/60 border-b border-[#F4E3DD]/40 flex justify-between items-center">
              <span className="font-serif font-bold text-[11px] text-[#751C2F]">AMAX CRAFT</span>
              <div className="flex gap-2 text-[8px] font-semibold text-[#756A64]">
                <span>Home</span>
                <span>Shop</span>
                <span>Categories</span>
              </div>
            </div>

            {/* Main view area */}
            <div className="p-4 space-y-4 bg-[#FFF9F0]/20 min-h-[300px]">
              
              {/* Hero Banner preview */}
              {sections.heroSection ? (
                <div className="relative bg-stone-900 rounded-xl overflow-hidden text-center py-8 px-4 text-white">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center" />
                  <div className="relative space-y-2 z-10">
                    <span className="text-[7px] font-bold tracking-widest uppercase text-[#C7953E] bg-[#FFF9F0]/10 px-2 py-0.5 rounded-full">
                      PREMIUM CNC ARCHITECTURAL JALIS
                    </span>
                    <h2 className="text-sm font-serif font-extrabold leading-tight">
                      {headerConfig.heading} <span className="text-[#C7953E]">{headerConfig.highlighted}</span>
                    </h2>
                    <p className="text-[8px] text-white/80 max-w-xs mx-auto line-clamp-2">
                      {headerConfig.subheading}
                    </p>
                    <div className="pt-2 flex justify-center gap-1.5 text-[8px]">
                      <span className="px-2.5 py-1 bg-[#751C2F] text-white font-bold rounded-md">Shop Catalog</span>
                      <span className="px-2.5 py-1 bg-white/20 text-white font-bold rounded-md backdrop-blur-sm">Contact</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-[#F4E3DD] rounded-xl p-4 text-center text-[10px] text-[#756A64]/50">
                  Hero Section is hidden from storefront homepage.
                </div>
              )}

              {/* Featured Categories preview */}
              {sections.featureCategories && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-[#25201E]">Featured Collections</span>
                    <span className="text-[8px] text-[#751C2F]">View all</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'CNC Laser Jalis', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Room Partitions', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Railing Strips', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80' }
                    ].map((cat, i) => (
                      <div key={i} className="bg-white rounded-lg border border-[#F4E3DD] p-1 text-center">
                        <img src={cat.img} alt="" className="w-full h-10 object-cover rounded" />
                        <span className="text-[7px] font-semibold text-[#25201E] mt-1 block truncate">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New arrivals grid */}
              {sections.newArrivals && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-[#25201E]">Designer Crafts & New Arrivals</span>
                    <span className="text-[8px] text-[#751C2F]">Explore</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Modern Geometric Divider Screen', price: '₹12,500', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Curved Teak Folding Jali', price: '₹14,200', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80' }
                    ].map((prod, i) => (
                      <div key={i} className="bg-white rounded-lg border border-[#F4E3DD] overflow-hidden">
                        <img src={prod.img} alt="" className="w-full h-12 object-cover" />
                        <div className="p-1.5 space-y-0.5">
                          <p className="text-[7px] font-bold text-[#25201E] truncate">{prod.name}</p>
                          <p className="text-[7px] font-semibold text-[#751C2F]">{prod.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Section */}
              {sections.statsSection && (
                <div className="grid grid-cols-3 gap-1 p-2 bg-[#751C2F] text-white rounded-xl text-center">
                  <div>
                    <p className="text-[9px] font-bold text-[#C7953E]">15+</p>
                    <p className="text-[6px] text-white/80">Premium Materials</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#C7953E]">100%</p>
                    <p className="text-[6px] text-white/80">CAD Tailored Sizes</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#C7953E]">24/7</p>
                    <p className="text-[6px] text-white/80">WhatsApp Consult</p>
                  </div>
                </div>
              )}

              {/* About Section */}
              {sections.aboutUs && (
                <div className="p-2 bg-white rounded-xl border border-[#F4E3DD] text-center space-y-1">
                  <p className="text-[8px] font-serif font-bold text-[#751C2F]">Architectural Craftsmanship</p>
                  <p className="text-[6px] text-[#756A64] leading-normal px-2">
                    Amax Craft delivers CNC-grade custom luxury. Our specialists transform sheet metal, wood, and composite panels into elegant structures.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
