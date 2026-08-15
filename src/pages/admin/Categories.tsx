import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Category } from '../../types';
import { Plus, Edit3, Trash2, Upload, Image as ImageIcon, X, Link as LinkIcon, AlertCircle } from 'lucide-react';

export const Categories: React.FC = () => {
  const { categories, allProducts, addCategory, updateCategory, deleteCategory } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Custom Deletion Confirmation Modal States
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setIsAdding(false);
    setShowUrlInput(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB for optimal database storage.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setImageUrl(c.imageUrl || '');
    setIsAdding(true);
  };

  const openDeleteConfirmation = (c: Category) => {
    setDeletingCat(c);
    setDeleteConfirmOpen(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCat) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCategory(deletingCat.id);
      setDeleteSuccess(`Category "${deletingCat.name}" deleted successfully.`);
      setTimeout(() => {
        setDeleteConfirmOpen(false);
        setDeletingCat(null);
        setDeleteSuccess(null);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      let errMsg = "An unexpected error occurred.";
      if (error?.code === "permission-denied" || error?.message?.includes("permissions") || error?.message?.includes("permission-denied")) {
        errMsg = "Permission Denied: Your admin session is not authorized to delete categories in Firestore.";
      } else if (error?.message) {
        errMsg = error.message;
      }
      setDeleteError(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { name, slug, description, imageUrl };
      if (editingCat && !editingCat.id.startsWith('cat-temp-') && !editingCat.id.startsWith('local-cat-')) {
        await updateCategory(editingCat.id, data);
        alert('Category updated.');
      } else if (editingCat && editingCat.id.startsWith('cat-temp-')) {
        alert("Cannot edit temporary categories.");
      } else if (editingCat && editingCat.id.startsWith('local-cat-')) {
        await updateCategory(editingCat.id, data);
        alert('Category updated.');
      } else {
        await addCategory(data);
        alert('Category added.');
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Categories</h1>
          <p className="text-[#756A64] text-sm mt-1">Manage product collections and navigation.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#751C2F] text-white rounded-lg text-sm font-medium hover:bg-[#591423] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm max-w-2xl">
          <div className="px-6 py-4 border-b border-[#F4E3DD] flex items-center justify-between">
            <h2 className="font-semibold text-[#25201E]">
              {editingCat ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button onClick={resetForm} className="text-sm font-medium text-[#756A64] hover:text-[#751C2F]">
              Cancel
            </button>
          </div>
          <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">Category Name *</label>
              <input type="text" required value={name} onChange={(e) => {
                setName(e.target.value);
                if (!editingCat) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">URL Slug *</label>
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-[#F4E3DD] rounded-lg p-2.5 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25201E] mb-1">Category Image</label>
              
              {imageUrl ? (
                <div className="relative border border-[#F4E3DD] rounded-xl overflow-hidden bg-white group shadow-sm max-w-sm">
                  <img src={imageUrl} alt="Category Preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('category-file-upload') as HTMLInputElement;
                        if (input) input.click();
                      }}
                      className="px-3 py-1.5 bg-white text-[#25201E] rounded-md text-xs font-semibold hover:bg-[#FFF9F0] transition-colors cursor-pointer"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
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
                  onClick={() => document.getElementById('category-file-upload')?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#C7953E] bg-[#FFF9F0]'
                      : 'border-[#F4E3DD] hover:border-[#C7953E] bg-white hover:bg-[#FFF9F0]/20'
                  }`}
                >
                  <Upload className="w-8 h-8 mx-auto text-[#756A64] mb-2" />
                  <p className="text-sm font-medium text-[#25201E]">Upload from Computer</p>
                  <p className="text-xs text-[#756A64] mt-1">Drag and drop or click to select image</p>
                  <p className="text-[10px] text-[#756A64]/70 mt-1">Supports PNG, JPG, WEBP, GIF up to 2MB</p>
                </div>
              )}

              <input
                type="file"
                id="category-file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Secondary option: Image URL */}
              <div className="mt-3">
                {!showUrlInput && !imageUrl ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-xs text-[#751C2F] hover:text-[#591423] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Or use an image web link (URL)
                  </button>
                ) : (
                  (showUrlInput || imageUrl.startsWith('http')) && (
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
                        value={imageUrl.startsWith('data:') ? '' : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full text-xs border border-[#F4E3DD] rounded-md p-2 outline-none focus:border-[#C7953E] text-[#25201E] bg-white"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-[#F4E3DD] flex justify-end gap-3">
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-[#751C2F] text-white rounded-lg text-sm font-medium hover:bg-[#591423] transition-colors disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FFF9F0]/50 border-b border-[#F4E3DD]">
                  <th className="p-4 font-semibold text-[#25201E]">Category Info</th>
                  <th className="p-4 font-semibold text-[#25201E]">Slug</th>
                  <th className="p-4 font-semibold text-[#25201E] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E3DD]">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FFF9F0]/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-[#FFF9F0] border border-[#F4E3DD] overflow-hidden flex-shrink-0">
                          {c.imageUrl && <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-medium text-[#25201E]">{c.name}</div>
                          <div className="text-xs text-[#756A64] line-clamp-1 max-w-sm mt-0.5">{c.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#756A64] font-mono text-xs">{c.slug}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(c)} className="p-1.5 text-[#756A64] hover:text-[#751C2F] hover:bg-[#F4E3DD] rounded transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDeleteConfirmation(c)} className="p-1.5 text-[#756A64] hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && deletingCat && (() => {
        const dependentProducts = allProducts.filter(p => 
          p.categoryId === deletingCat.id || 
          p.categoryId === deletingCat.slug || 
          p.category?.toLowerCase() === deletingCat.name.toLowerCase()
        );
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" id="delete-category-modal">
            <div className="bg-white rounded-2xl border border-[#F4E3DD] shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trash2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#25201E]">Delete Category?</h3>
                  <p className="text-xs text-[#756A64] mt-1">
                    Are you sure you want to delete <span className="font-bold text-[#25201E]">"{deletingCat.name}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Dependent Products Warning */}
              {dependentProducts.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Category is currently in use
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    This category is currently assigned to <span className="font-bold">{dependentProducts.length}</span> {dependentProducts.length === 1 ? 'product' : 'products'}. Deleting the category will preserve the products, but they will no longer be grouped under this category.
                  </p>
                </div>
              )}

              {/* Success / Error Messages */}
              {deleteSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold text-center">
                  {deleteSuccess}
                </div>
              )}

              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs leading-relaxed max-h-24 overflow-y-auto">
                  <p className="font-semibold mb-0.5">Failed to delete category</p>
                  <p className="text-[10px] font-mono">{deleteError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F4E3DD]">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-[#F4E3DD] text-[#756A64] hover:bg-[#FFF9F0] rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting || !!deleteSuccess}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Category'
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
