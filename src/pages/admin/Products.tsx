import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, FIRESTORE_DATABASE_ID } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { Plus, Edit3, Trash2, Search, Filter, Upload, Image as ImageIcon, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { uploadProductImage, deleteImage, validateImageFile, compressDataUrl } from '../../services/firebaseStorage';

const parsePrice = (value: any): number | null => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const cleaned = String(value)
    .replace(/[₹,\s]/g, "")
    .trim();
  if (cleaned === "") {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

export const Products: React.FC = () => {
  const { allProducts: products, categories, updateProduct, addProduct } = useShop();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Admin Auth Diagnostic Helper
  useEffect(() => {
    console.log("ADMIN AUTH DIAGNOSTIC:", {
      authenticated: !!auth.currentUser,
      uid: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      isAdmin
    });
  }, [user, isAdmin]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Image handling state
  const [imageUrl, setImageUrl] = useState(''); // Text input URL or stored URL
  const [imageFile, setImageFile] = useState<File | null>(null); // Actual File to upload
  const [imagePreview, setImagePreview] = useState<string>(''); // Browser preview URL
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [thickness, setThickness] = useState('');
  const [finish, setFinish] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isWeddingEssential, setIsWeddingEssential] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Validation State
  const [nameError, setNameError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [originalPriceError, setOriginalPriceError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const defaultCategorySuggestions = [
    { id: 'name-plates', name: 'Name Plates', slug: 'name-plates' },
    { id: 'decorative-lights', name: 'Decoratives Lights', slug: 'decorative-lights' },
    { id: 'wall-interior', name: 'Wall Interior', slug: 'wall-interior' },
    { id: 'staircase-pillars', name: 'Staircase lighting Pillar', slug: 'staircase-pillars' },
    { id: 'main-gate', name: 'Main Gate', slug: 'main-gate' },
    { id: 'room-dividers', name: 'Room Dividers', slug: 'room-dividers' },
    { id: 'balcony-grills', name: 'Balcony Grills', slug: 'balcony-grills' },
    { id: 'garden-outdoor', name: 'Garden & Outdoor Furniture', slug: 'garden-outdoor' },
  ];

  const availableCategories = categories.length > 0 ? categories : defaultCategorySuggestions;

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    const initCatList = categories.length > 0 ? categories : defaultCategorySuggestions;
    setCategory(initCatList[0].name);
    setCategoryId(initCatList[0].slug);
    setImageUrl('');
    setImagePreview('');
    setImageFile(null);
    setUploadProgress(null);
    setMaterial('');
    setDimensions('');
    setThickness('');
    setFinish('');
    setIsFeatured(false);
    setIsNewArrival(false);
    setIsWeddingEssential(false);
    setIsActive(true);
    setIsAdding(false);
    setShowUrlInput(false);
    setFormError(null);
    setNameError(null);
    setPriceError(null);
    setOriginalPriceError(null);
    setValidationError(null);
  };

  const handleSelectedFile = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setFormError(validation.error || "Invalid image selected.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectedFile(file);
    }
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
      handleSelectedFile(file);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setImagePreview('');
    setImageFile(null);
    setUploadProgress(null);
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price !== undefined && p.price !== null ? String(p.price) : '');
    setOriginalPrice(p.originalPrice !== undefined && p.originalPrice !== null ? String(p.originalPrice) : '');
    setCategory(p.category);
    setCategoryId(p.categoryId);
    const initialImg = p.imageUrl || (p.images && p.images[0]) || '';
    setImageUrl(initialImg);
    setImagePreview(initialImg);
    setImageFile(null);
    setUploadProgress(null);
    setMaterial(p.material || '');
    setDimensions(p.dimensions || '');
    setThickness(p.thickness || '');
    setFinish(p.finish || '');
    setIsFeatured(Boolean(p.isFeatured));
    setIsNewArrival(Boolean(p.isNewArrival));
    setIsWeddingEssential(Boolean(p.isWeddingEssential));
    setIsActive(Boolean(p.isActive));
    setIsAdding(true);
    
    // Clear validation states
    setNameError(null);
    setPriceError(null);
    setOriginalPriceError(null);
    setValidationError(null);
    setFormError(null);
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${prodName}?`)) return;
    if (id.startsWith('temp-')) {
      alert("Cannot delete temporary seed product.");
      return;
    }
    if (!isAdmin) {
      alert("Admin authorization required.");
      return;
    }
    try {
      const prodToDelete = products.find(p => p.id === id);
      if (prodToDelete?.imageStoragePath) {
        try {
          await deleteImage(prodToDelete.imageStoragePath);
        } catch (delErr) {
          console.warn("Could not delete image from Storage:", delErr);
        }
      }
      await deleteDoc(doc(db, 'products', id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setNameError(null);
    setPriceError(null);
    setOriginalPriceError(null);
    setValidationError(null);

    if (authLoading) {
      return;
    }

    if (!user) {
      navigate('/admin/login');
      return;
    }

    if (!isAdmin) {
      setFormError('This account does not have administrator permission.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(null);

    let newlyUploadedStoragePath = "";

    try {
      // Validation Block
      let hasError = false;

      const trimmedName = name.trim();
      if (!trimmedName) {
        setNameError("Please enter a product name.");
        hasError = true;
      }

      const parsedPrice = parsePrice(price);
      if (parsedPrice === null) {
        setPriceError("Price is required.");
        hasError = true;
      } else if (parsedPrice <= 0) {
        setPriceError("Enter a price greater than ₹0.");
        hasError = true;
      }

      const parsedOriginalPrice = originalPrice === "" ? null : parsePrice(originalPrice);
      if (originalPrice !== "" && parsedOriginalPrice === null) {
        setOriginalPriceError("Please enter a valid original price.");
        hasError = true;
      }

      if (parsedPrice !== null && parsedOriginalPrice !== null && parsedOriginalPrice < parsedPrice) {
        setOriginalPriceError("Original price cannot be lower than the selling price.");
        hasError = true;
      }

      if (hasError) {
        setValidationError("Please check the fields with errors.");
        setSubmitting(false);
        return;
      }

      let finalCategory = category ? category.trim() : '';
      let finalCategoryId = categoryId ? categoryId.trim() : '';

      if (!finalCategoryId || finalCategoryId === 'custom') {
        finalCategory = finalCategory || 'General';
        finalCategoryId = finalCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';
      }

      // Generate or retrieve product document ID
      let productId = "";
      let isEditMode = false;
      let productDocRef;

      if (editingProduct && !editingProduct.id.startsWith('temp-')) {
        isEditMode = true;
        productId = editingProduct.id;
        productDocRef = doc(db, 'products', productId);
      } else {
        productDocRef = doc(collection(db, 'products'));
        productId = productDocRef.id;
      }

      let finalImageUrl = imageUrl.trim();
      let finalStoragePath = editingProduct?.imageStoragePath || '';

      // Upload image to Storage if a new file is selected
      if (imageFile) {
        console.log("UPLOADING IMAGE TO STORAGE FOR PRODUCT ID:", productId);
        setUploadProgress(0);
        try {
          const uploadResult = await uploadProductImage(imageFile, productId, (progress) => {
            setUploadProgress(progress);
          });
          finalImageUrl = uploadResult.url;
          finalStoragePath = uploadResult.storagePath;
          newlyUploadedStoragePath = uploadResult.storagePath;
          console.log("IMAGE UPLOAD SUCCESSFUL. URL:", finalImageUrl);
        } catch (storageErr: any) {
          console.warn("Storage upload warning, using fallback image format:", storageErr);
        }
      }

      if (finalImageUrl.startsWith('data:image')) {
        finalImageUrl = await compressDataUrl(finalImageUrl, 800, 800, 0.75);
      }

      const productData: Record<string, any> = {
        name: trimmedName,
        description: description.trim(),
        price: parsedPrice,
        category: finalCategory,
        categoryId: finalCategoryId,
        images: finalImageUrl ? [finalImageUrl] : [],
        imageUrl: finalImageUrl || '',
        material: material.trim(),
        dimensions: dimensions.trim(),
        thickness: thickness.trim(),
        finish: finish.trim(),
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        isWeddingEssential: Boolean(isWeddingEssential),
        isActive: Boolean(isActive),
        stock: 10,
        updatedAt: serverTimestamp(),
      };

      if (finalStoragePath) {
        productData.imageStoragePath = finalStoragePath;
      }

      if (parsedOriginalPrice !== null) {
        productData.originalPrice = parsedOriginalPrice;
      }

      // Ensure no undefined values are sent to Firestore
      Object.keys(productData).forEach(
        (key) => productData[key] === undefined && delete productData[key]
      );

      console.log("IMAGE URL TO SAVE:", finalImageUrl);
      console.log("IS BASE64:", finalImageUrl?.startsWith("data:"));
      console.log("PRODUCT JSON SIZE:", new Blob([JSON.stringify(productData)]).size, "bytes");

      if (isEditMode) {
        try {
          await setDoc(productDocRef, productData, { merge: true });
          console.log("PRODUCT UPDATED SUCCESSFULLY IN FIRESTORE:", productId);
        } catch (dbErr: any) {
          console.warn("Direct Firestore setDoc failed, saving product update locally:", dbErr);
          await updateProduct(productId, productData);
        }

        if (imageFile && editingProduct?.imageStoragePath && editingProduct.imageStoragePath !== finalStoragePath) {
          try {
            await deleteImage(editingProduct.imageStoragePath);
          } catch (delErr) {
            console.warn("Failed to delete previous storage image:", delErr);
          }
        }
        alert('Product updated successfully!');
      } else {
        productData.createdAt = serverTimestamp();
        try {
          await setDoc(productDocRef, productData);
          console.log("PRODUCT CREATED SUCCESSFULLY IN FIRESTORE:", productId);
        } catch (dbErr: any) {
          console.warn("Direct Firestore setDoc failed, saving product creation locally:", dbErr);
          await addProduct(productData as any);
        }
        alert('Product saved successfully!');
      }

      resetForm();
    } catch (error: any) {
      console.error("PRODUCT SAVE ERROR:", error?.code, error?.message, error);

      if (newlyUploadedStoragePath) {
        console.warn("Operation failed. Cleaning up orphan storage file:", newlyUploadedStoragePath);
        try {
          await deleteImage(newlyUploadedStoragePath);
        } catch (cleanupErr) {
          console.warn("Failed to delete orphan storage file:", cleanupErr);
        }
      }

      let userMessage = "Unable to save product. Please try again.";
      if (error?.message === "STORAGE_PERMISSION_DENIED") {
        userMessage = "You do not have permission to upload product images.";
      } else if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        userMessage = "You do not have permission to save products.";
      } else if (error?.code === 'unauthenticated' || error?.message?.includes('unauthenticated')) {
        userMessage = "Your session expired. Please login again.";
      } else if (error?.message) {
        userMessage = `Error saving product: ${error.message}`;
      }

      setFormError(userMessage);
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Products</h1>
          <p className="text-[#756A64] text-sm mt-1">Manage your catalogue, pricing, and inventory.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#751C2F] text-white rounded-lg text-sm font-medium hover:bg-[#591423] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm">
          <div className="px-6 py-4 border-b border-[#F4E3DD] flex items-center justify-between">
            <h2 className="font-semibold text-[#25201E]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={resetForm} className="text-sm font-medium text-[#756A64] hover:text-[#751C2F]">
              Cancel
            </button>
          </div>
          <form onSubmit={handleSaveProduct} className="p-6">
            {validationError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">Check Product Details</p>
                  <p className="mt-0.5">{validationError}</p>
                </div>
              </div>
            )}
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Save Failed</p>
                  <p className="mt-0.5">{formError}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#25201E] mb-1">Product Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError(null);
                      setValidationError(null);
                    }} 
                    className={`w-full border rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E] ${nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#F4E3DD]'}`} 
                  />
                  {nameError && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{nameError}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-[#25201E]">Category *</label>
                    <a href="/admin/categories" className="text-xs font-medium text-[#C7953E] hover:underline">
                      Manage Categories
                    </a>
                  </div>
                  <select 
                    value={categoryId} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setCategoryId('custom');
                        setCategory('');
                      } else {
                        setCategoryId(val);
                        const found = availableCategories.find(c => c.slug === val);
                        if (found) {
                          setCategory(found.name);
                        } else {
                          setCategory(val);
                        }
                      }
                    }} 
                    className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]"
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {availableCategories.map(c => (
                      <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
                    ))}
                    <option value="custom">+ Enter Custom Category...</option>
                  </select>
                  {categoryId === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Type custom category name..."
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                        className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none text-sm focus:border-[#C7953E]"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25201E] mb-1">Price (₹) *</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={price} 
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setPriceError(null);
                        setValidationError(null);
                      }} 
                      className={`w-full border rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E] ${priceError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#F4E3DD]'}`} 
                    />
                    {priceError && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{priceError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25201E] mb-1">Original Price</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={originalPrice} 
                      onChange={(e) => {
                        setOriginalPrice(e.target.value);
                        setOriginalPriceError(null);
                        setValidationError(null);
                      }} 
                      className={`w-full border rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E] ${originalPriceError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#F4E3DD]'}`} 
                    />
                    {originalPriceError && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{originalPriceError}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#25201E] mb-1">Description</label>
                  <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
                </div>
              </div>

              {/* Media & Specs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#25201E] mb-1">Product Image</label>
                  
                  {(imagePreview || imageUrl) ? (
                    <div className="relative border border-[#F4E3DD] rounded-xl overflow-hidden bg-white group shadow-sm max-w-sm">
                      <img src={imagePreview || imageUrl} alt="Product Preview" className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('product-file-upload') as HTMLInputElement;
                            if (input) input.click();
                          }}
                          className="px-3 py-1.5 bg-white text-[#25201E] rounded-md text-xs font-semibold hover:bg-[#FFF9F0] transition-colors cursor-pointer"
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('product-file-upload')?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#C7953E] bg-[#FFF9F0]'
                          : 'border-[#F4E3DD] hover:border-[#C7953E] bg-white hover:bg-[#FFF9F0]/20'
                      }`}
                    >
                      <Upload className="w-8 h-8 mx-auto text-[#756A64] mb-2" />
                      <p className="text-sm font-medium text-[#25201E]">Upload from Computer</p>
                      <p className="text-xs text-[#756A64] mt-1">Drag and drop or click to select image</p>
                      <p className="text-[10px] text-[#756A64]/70 mt-1">Supports PNG, JPG, WEBP, GIF up to 5MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="product-file-upload"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadProgress !== null && (
                    <div className="mt-3 space-y-1 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex justify-between text-xs font-medium text-[#751C2F]">
                        <span>Uploading image to Firebase Storage...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-[#F4E3DD] rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#751C2F] h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Secondary option: Image URL */}
                  <div className="mt-3">
                    {!showUrlInput && !imageUrl && !imagePreview ? (
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(true)}
                        className="text-xs text-[#751C2F] hover:text-[#591423] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        Or use an image web link (URL)
                      </button>
                    ) : (
                      (showUrlInput || (imageUrl && imageUrl.startsWith('http'))) && (
                        <div className="space-y-1.5 p-3 bg-white border border-[#F4E3DD] rounded-lg mt-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-xs font-semibold text-[#756A64]">Image Web Link (URL)</label>
                            {!imageUrl && (
                              <button
                                type="button"
                                onClick={() => setShowUrlInput(false)}
                                className="text-[10px] text-[#756A64] hover:text-[#751C2F]"
                              >
                                Hide
                              </button>
                            )}
                          </div>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') ? '' : imageUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImageUrl(val);
                              if (val && !imageFile) {
                                setImagePreview(val);
                              }
                            }}
                            className="w-full text-xs border border-[#F4E3DD] rounded-md p-2 outline-none focus:border-[#C7953E] text-[#25201E] bg-white"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25201E] mb-1">Material</label>
                    <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25201E] mb-1">Finish</label>
                    <input type="text" value={finish} onChange={(e) => setFinish(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25201E] mb-1">Dimensions</label>
                    <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25201E] mb-1">Thickness</label>
                    <input type="text" value={thickness} onChange={(e) => setThickness(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded text-[#751C2F] focus:ring-[#751C2F]" />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="rounded text-[#751C2F] focus:ring-[#751C2F]" />
                    <span className="text-sm font-medium">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isWeddingEssential} onChange={(e) => setIsWeddingEssential(e.target.checked)} className="rounded text-[#751C2F] focus:ring-[#751C2F]" />
                    <span className="text-sm font-medium">Wedding Essential</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-[#F4E3DD] flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-5 py-2 text-sm font-medium text-[#756A64] hover:text-[#25201E] transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-5 py-2 bg-[#751C2F] text-white rounded-lg text-sm font-medium hover:bg-[#591423] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {submitting ? (
                  uploadProgress !== null ? (
                    `Uploading Image (${uploadProgress}%)...`
                  ) : (
                    'Saving Product...'
                  )
                ) : (
                  editingProduct ? 'Update Product' : 'Save Product'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#F4E3DD] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756A64]" />
              <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg text-sm focus:outline-none focus:border-[#C7953E]" />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#F4E3DD] rounded-lg text-sm font-medium text-[#756A64] hover:bg-[#FFF9F0] transition-colors w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FFF9F0]/50 border-b border-[#F4E3DD]">
                  <th className="p-4 font-semibold text-[#25201E]">Product</th>
                  <th className="p-4 font-semibold text-[#25201E]">Category</th>
                  <th className="p-4 font-semibold text-[#25201E]">Price</th>
                  <th className="p-4 font-semibold text-[#25201E]">Status</th>
                  <th className="p-4 font-semibold text-[#25201E] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E3DD]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#756A64]">
                      No products found. Add your first product to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FFF9F0]/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-[#FFF9F0] border border-[#F4E3DD] overflow-hidden flex-shrink-0">
                            <img src={p.imageUrl || p.images?.[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-[#25201E]">{p.name}</div>
                            <div className="text-xs text-[#756A64] font-mono mt-0.5">ID: {p.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#756A64]">{p.category}</td>
                      <td className="p-4 font-semibold text-[#751C2F]">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                          {p.isFeatured && <span className="inline-block px-2 py-0.5 bg-[#F4E3DD] text-[#751C2F] rounded-full text-[10px] font-bold uppercase tracking-wider">Featured</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(p)} className="p-1.5 text-[#756A64] hover:text-[#751C2F] hover:bg-[#F4E3DD] rounded transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-1.5 text-[#756A64] hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#F4E3DD] flex items-center justify-between text-sm text-[#756A64]">
            <div>Showing {products.length} products</div>
          </div>
        </div>
      )}
    </div>
  );
};
