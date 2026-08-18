'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Percent,
  DollarSign,
  UserCheck,
  CheckCircle2,
  XCircle,
  Copy,
  RefreshCw,
  Loader2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchDiscountsAction,
  saveDiscountAction,
  deleteDiscountAction,
  toggleDiscountStatusAction,
  DiscountCoupon,
} from './actions';

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    firstTimeOnly: true,
    minOrderAmount: 0,
    isActive: true,
    description: '',
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetchDiscountsAction();
      if (res.success) {
        setCoupons(res.coupons);
      }
    } catch {
      toast.error('Failed to load discount coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      firstTimeOnly: true,
      minOrderAmount: 0,
      isActive: true,
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: DiscountCoupon) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      firstTimeOnly: coupon.firstTimeOnly,
      minOrderAmount: coupon.minOrderAmount,
      isActive: coupon.isActive,
      description: coupon.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await saveDiscountAction({
        id: editingId || undefined,
        ...formData,
      });

      if (res.success) {
        toast.success(editingId ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        setIsModalOpen(false);
        loadCoupons();
      } else {
        toast.error(res.error || 'Failed to save coupon');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error saving coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      try {
        await deleteDiscountAction(id);
        toast.success(`Coupon "${code}" deleted`);
        loadCoupons();
      } catch {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleDiscountStatusAction(id, !currentStatus);
      toast.success(`Coupon ${!currentStatus ? 'Activated' : 'Deactivated'}`);
      loadCoupons();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const firstTimeCoupons = coupons.filter((c) => c.firstTimeOnly).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-accent" /> Discount & Coupon Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create promotional codes, manage percentage/$ off discounts, and enforce 1st-time buyer rules.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button onClick={handleOpenCreate} className="flex-1 sm:flex-none bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm h-10 gap-2 font-semibold">
            <Plus className="w-4 h-4" /> Create Coupon
          </Button>
          <Button onClick={loadCoupons} variant="outline" size="sm" className="border-border text-xs h-10 gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        <Card className="bg-card border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-1 p-4 sm:p-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Codes</CardTitle>
            <Tag className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{totalCoupons}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Configured promo codes</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-1 p-4 sm:p-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Now</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{activeCoupons}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Live for checkout</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-1 p-4 sm:p-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">1st-Time Buyer Only</CardTitle>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">{firstTimeCoupons}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Verified first orders</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-1 p-4 sm:p-5">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Redemptions</CardTitle>
            <Users className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{totalRedemptions}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Times redeemed</p>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card className="bg-card border-border shadow-xl">
        <CardHeader className="p-4 sm:p-6 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg sm:text-xl">Active Coupons & Promo Codes</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Manage discounts applied at customer checkout.</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-accent" /> Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Tag className="w-12 h-12 mb-3 opacity-20 text-accent" />
              <p className="text-sm font-medium text-foreground">No coupons configured</p>
              <p className="text-xs text-muted-foreground mt-1">Click "+ Create Coupon" to add your first promotion.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="p-4 sm:p-6 hover:bg-white/[0.01] transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-2 bg-background border border-border px-3 py-1 rounded-lg">
                        <span className="font-mono text-base font-bold text-white tracking-wider">{coupon.code}</span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="text-muted-foreground hover:text-accent transition-colors"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30 font-mono">
                        {coupon.discountType === 'percentage' ? (
                          <>
                            <Percent className="w-3 h-3" /> {coupon.discountValue}% OFF
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-3 h-3" /> ${coupon.discountValue} OFF
                          </>
                        )}
                      </span>

                      {coupon.firstTimeOnly ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          <Sparkles className="w-3 h-3" /> 1st Order Only
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-border">
                          All Customers
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          coupon.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {coupon.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                        className={`h-8 text-xs font-semibold ${
                          coupon.isActive
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {coupon.isActive ? 'Disable' : 'Enable'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(coupon)}
                        className="h-8 border-border text-xs gap-1 hover:border-accent hover:text-accent"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="h-8 px-2.5 border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground pt-1">
                    {coupon.description && <span>{coupon.description}</span>}
                    <span>
                      Min Subtotal: <strong className="text-white">${coupon.minOrderAmount.toFixed(2)}</strong>
                    </span>
                    <span>
                      Redemptions: <strong className="text-accent font-mono">{coupon.usageCount || 0}</strong> times
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Coupon Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border w-[95vw] sm:max-w-lg p-4 sm:p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-lg sm:text-xl font-display flex items-center gap-2">
              <Tag className="w-5 h-5 text-accent" />
              {editingId ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Coupon Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-white font-mono text-sm uppercase focus:outline-none focus:border-accent"
                placeholder="e.g. WELCOME10, FIRST15, XFACTOR20"
              />
              <p className="text-[11px] text-muted-foreground">Customers will enter this code at checkout.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Dollar Amount ($)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  {formData.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-accent"
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            {/* 1st-Time Buyer Toggle Switch */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">First-Time Buyer Only</span>
                </div>
                <input
                  type="checkbox"
                  id="firstTimeOnly"
                  checked={formData.firstTimeOnly}
                  onChange={(e) => setFormData({ ...formData, firstTimeOnly: e.target.checked })}
                  className="w-4 h-4 rounded text-accent bg-background border-border focus:ring-accent cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                When enabled, the server checks the customer email/phone in the orders database. If any past order exists, the code is strictly blocked.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Minimum Order Subtotal ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-accent"
                placeholder="0.00 (No minimum)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Description (Optional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
                placeholder="e.g. 10% OFF for first-time researchers"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-accent bg-background border-border focus:ring-accent cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs sm:text-sm text-foreground font-medium cursor-pointer">
                Coupon is active and redeemable at checkout
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-border text-xs h-10">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm h-10 px-5">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                {submitting ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
