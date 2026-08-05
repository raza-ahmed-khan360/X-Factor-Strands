'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, Trash2, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { addProduct, deleteProduct, updateProduct } from './actions';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

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
        fetchProducts(); // Refresh list
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
        toast.error('An error occurred');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-wide">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog and inventory.</p>
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
          className="bg-accent hover:bg-accent/90 text-white shadow-[0_0_15px_rgba(11,95,255,0.3)]"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Product</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-card border-border border-l-4 border-l-accent animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-white">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      if (isEditing) {
                        setFormData({ ...formData, name: e.target.value });
                      } else {
                        setFormData({ ...formData, name: e.target.value, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') });
                      }
                    }}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g. BPC-157"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product ID (Slug)</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    disabled={isEditing}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. bpc-157"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent appearance-none"
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer border border-dashed border-border hover:border-accent rounded-lg px-4 py-2 flex items-center justify-center gap-2 text-muted-foreground transition-colors bg-background">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm truncate">
                        {imageFile ? imageFile.name : (formData.existingImageUrl ? 'Change Image...' : 'Upload Image...')}
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent h-32 resize-none"
                  placeholder="Product description..."
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Variants</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant} className="bg-background border-border text-foreground hover:bg-white/5 hover:text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Variant
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-muted-foreground">Size/Format</label>
                        <input
                          type="text"
                          required
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent text-sm"
                          placeholder="e.g. 5mg"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-muted-foreground">Price ($)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent text-sm"
                          placeholder="e.g. 49.99"
                        />
                      </div>
                      <div className="pt-5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                          disabled={variants.length === 1}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 pt-4 border-t border-border">
                {formError && (
                  <div className="text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg text-sm sm:flex-1 text-left">
                    {formError}
                  </div>
                )}
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white min-w-[150px] shrink-0">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {submitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <CardTitle className="text-white">Product Catalog</CardTitle>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p>No products found in the database.</p>
              <Button onClick={() => setIsAdding(true)} variant="link" className="text-accent mt-2">Add your first product</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {products
                    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((product) => {
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
                              <div className="text-xs text-muted-foreground">{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {product.variants?.length || 0} variant(s)
                        </td>
                        <td className="px-6 py-4">
                          ${Number(basePrice).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="text-muted-foreground hover:text-white hover:bg-white/10 h-8 px-2"
                            >
                              <Pencil className="w-4 h-4 mr-1.5" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
