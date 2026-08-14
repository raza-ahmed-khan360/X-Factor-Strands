'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, Trash2, Image as ImageIcon, Loader2, Search, Pencil, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { addProduct, deleteProduct, updateProduct } from './actions';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Form State
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    id: '',
    name: '',
    category: '',
    description: '',
    existingImageUrl: '',
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [variants, setVariants] = React.useState<any[]>([{ size: '10mg', price: 0 }]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variants (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as any);
    } catch (err) {
      console.error('Error fetching products', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const data = new FormData();
      data.append('id', isEditing ? formData.id : formData.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('variants', JSON.stringify(variants));
      data.append('existingImageUrl', formData.existingImageUrl);

      if (imageFile) {
        data.append('imageFile', imageFile);
      }

      const res = isEditing ? await updateProduct(data) : await addProduct(data);

      if (res.success) {
        toast.success(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        setIsAdding(false);
        setIsEditing(false);
        setFormData({ id: '', name: '', category: '', description: '', existingImageUrl: '' });
        setImageFile(null);
        setVariants([{ size: '10mg', price: 0 }]);
        fetchProducts();
      } else {
        const errorMsg = res.error || (isEditing ? 'Failed to update product' : 'Failed to add product');
        toast.error(errorMsg);
        setFormError(errorMsg);
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '',
      existingImageUrl: product.image_url || '',
    });
    setVariants(product.variants && product.variants.length > 0 ? product.variants : [{ size: '10mg', price: 0 }]);
    setImageFile(null);
    setFormError(null);
    setIsEditing(true);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          toast.success('Product deleted');
          fetchProducts();
        } else {
          toast.error(res.error || 'Failed to delete product');
        }
      } catch (err) {
        console.error('Error deleting product', err);
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">Products</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your catalog, variants, and pricing.</p>
        </div>
        <Button
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setIsEditing(false);
              setFormError(null);
              setFormData({ id: '', name: '', category: '', description: '', existingImageUrl: '' });
              setVariants([{ size: '10mg', price: 0 }]);
            }
          }}
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 text-xs sm:text-sm h-10"
        >
          {isAdding ? (
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Cancel
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Product
            </span>
          )}
        </Button>
      </div>

      {/* Add / Edit Form Card */}
      {isAdding && (
        <Card className="bg-card border-border border-l-4 border-l-accent animate-in fade-in slide-in-from-top-4 shadow-xl">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-white text-lg sm:text-xl">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      if (isEditing) {
                        setFormData({ ...formData, name: e.target.value });
                      } else {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                        });
                      }
                    }}
                    className="w-full bg-background border border-border rounded-lg px-3 sm:px-4 py-2.5 text-white focus:outline-none focus:border-accent text-sm"
                    placeholder="e.g. BPC-157"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Product ID (Slug)</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    disabled={isEditing}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 sm:px-4 py-2.5 text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    placeholder="e.g. bpc-157"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 sm:px-4 py-2.5 text-white focus:outline-none focus:border-accent text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="Weight Management">Weight Management</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Performance">Performance</option>
                    <option value="Sleep">Sleep</option>
                    <option value="Focus & Cognitive">Focus & Cognitive</option>
                    <option value="Energy">Energy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">Product Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer border border-dashed border-border hover:border-accent rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 text-muted-foreground transition-colors bg-background">
                      <ImageIcon className="w-5 h-5 shrink-0 text-accent" />
                      <span className="text-xs sm:text-sm truncate">
                        {imageFile ? imageFile.name : formData.existingImageUrl ? 'Change Image...' : 'Upload Image...'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-3 sm:p-4 text-white focus:outline-none focus:border-accent h-28 sm:h-32 resize-none text-sm"
                  placeholder="Product description and purity details..."
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-semibold text-white">Variants & Pricing</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                    className="bg-background border-border text-foreground hover:text-accent text-xs h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Variant
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-4 bg-background/50 p-2.5 rounded-lg border border-border/60">
                      <div className="flex-1 space-y-1">
                        <label className="text-[11px] text-muted-foreground">Size / Format</label>
                        <input
                          type="text"
                          required
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-white text-xs sm:text-sm"
                          placeholder="e.g. 5mg"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[11px] text-muted-foreground">Price ($)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-white text-xs sm:text-sm"
                          placeholder="e.g. 49.99"
                        />
                      </div>
                      <div className="pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                          disabled={variants.length === 1}
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 pt-4 border-t border-border">
                {formError && (
                  <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg text-xs sm:text-sm sm:flex-1 text-left">
                    {formError}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white min-w-[140px] text-sm h-11 sm:h-10"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Catalog Search and List */}
      <Card className="bg-card border-border shadow-lg">
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-white text-lg sm:text-xl">Product Catalog</CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-accent" /> Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Package className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No products found.</p>
              <Button onClick={() => setIsAdding(true)} variant="link" className="text-accent mt-1 text-xs">
                Add your first product
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile View: Responsive Cards (md:hidden) */}
              <div className="divide-y divide-border md:hidden">
                {filteredProducts.map((product) => {
                  const sortedVariants = [...(product.variants || [])].sort((a, b) => Number(a.price) - Number(b.price));
                  const basePrice = sortedVariants.length > 0 ? sortedVariants[0].price : 0;

                  return (
                    <div key={product.id} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
                          <span className="text-[11px] text-muted-foreground font-mono truncate block">{product.id}</span>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium border border-accent/20">
                              {product.category}
                            </span>
                            <span className="text-xs font-bold text-emerald-400 font-mono">
                              ${Number(basePrice).toFixed(2)}+
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              ({product.variants?.length || 0} variants)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="flex-1 h-9 border-border text-xs gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5 text-accent" /> Edit Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="h-9 px-3 border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View: Full Table (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-muted-foreground">
                  <thead className="text-xs uppercase bg-background/50 text-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Product</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Variants</th>
                      <th className="px-6 py-4 font-medium">Base Price</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map((product) => {
                      const sortedVariants = [...(product.variants || [])].sort((a, b) => Number(a.price) - Number(b.price));
                      const basePrice = sortedVariants.length > 0 ? sortedVariants[0].price : 0;

                      return (
                        <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-white">{product.name}</div>
                                <div className="text-xs text-muted-foreground font-mono">{product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">{product.variants?.length || 0} variant(s)</td>
                          <td className="px-6 py-4 font-mono font-semibold text-white">${Number(basePrice).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                                className="text-muted-foreground hover:text-white hover:bg-white/10 h-8 px-2.5 text-xs gap-1.5"
                              >
                                <Pencil className="w-3.5 h-3.5 text-accent" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2.5 text-xs gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
