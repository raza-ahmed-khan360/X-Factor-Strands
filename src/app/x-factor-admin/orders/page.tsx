'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Search, Phone, Mail, MapPin, Loader2, CheckCircle, Truck, Clock, XCircle, RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAdminOrdersAction, updateOrderStatusAction, createOrderAction, editOrderAction, deleteOrderAction } from './actions';

type OrderStatus = 'pending' | 'confirmed' | 'on_its_way' | 'delivered' | 'cancelled';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Active edit target
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    status: 'pending' as OrderStatus,
    itemName: 'Semaglutide (GLP-1)',
    itemSize: '5mg',
    itemQuantity: 1,
    itemPrice: 75,
    totalAmount: 80.99,
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminOrdersAction();
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Reset Create Form
  const openCreateModal = () => {
    setFormData({
      orderNumber: `XFP-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      city: '',
      postalCode: '',
      status: 'pending',
      itemName: 'Semaglutide (GLP-1)',
      itemSize: '5mg',
      itemQuantity: 1,
      itemPrice: 75,
      totalAmount: 80.99,
    });
    setIsCreateOpen(true);
  };

  // Pre-fill Edit Form
  const openEditModal = (order: any) => {
    setEditingOrder(order);
    setFormData({
      orderNumber: order.order_number || order.id,
      customerName: order.customer_name || '',
      customerEmail: order.customer_email || '',
      customerPhone: order.customer_phone || '',
      shippingAddress: order.shipping_address || '',
      city: order.city || '',
      postalCode: order.postal_code || '',
      status: (order.status as OrderStatus) || 'pending',
      itemName: order.order_items?.[0]?.item_name || 'Research Peptide',
      itemSize: order.order_items?.[0]?.size || 'Standard',
      itemQuantity: order.order_items?.[0]?.quantity || 1,
      itemPrice: order.order_items?.[0]?.price || order.total_amount || 0,
      totalAmount: Number(order.total_amount) || 0,
    });
    setIsEditOpen(true);
  };

  // Create Order Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        orderNumber: formData.orderNumber,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentMethod: 'Cash on Delivery (COD)',
        status: formData.status,
        totalAmount: Number(formData.totalAmount) || (Number(formData.itemPrice) * Number(formData.itemQuantity) + 5.99),
        items: [
          {
            name: formData.itemName,
            size: formData.itemSize,
            quantity: Number(formData.itemQuantity),
            price: Number(formData.itemPrice),
          },
        ],
      };

      const res = await createOrderAction(payload);
      if (res.success) {
        toast.success(`Order ${payload.orderNumber} created successfully! Customer notified.`);
        setIsCreateOpen(false);
        await loadOrders();
      } else {
        toast.error(res.error || 'Failed to create order');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error creating order');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Order Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        status: formData.status,
        totalAmount: Number(formData.totalAmount),
      };

      const res = await editOrderAction(editingOrder.id, payload);
      if (res.success) {
        toast.success('Order details updated successfully!');
        setIsEditOpen(false);
        await loadOrders();
      } else {
        toast.error(res.error || 'Failed to update order');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating order');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Order Handler
  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
      return;
    }

    setUpdatingId(orderId);
    try {
      const res = await deleteOrderAction(orderId);
      if (res.success) {
        toast.success(`Order ${orderNumber} deleted successfully.`);
        setOrders((prev) => prev.filter((o) => o.id !== orderId && o.order_number !== orderId));
      } else {
        toast.error(res.error || 'Failed to delete order');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error deleting order');
    } finally {
      setUpdatingId(null);
    }
  };

  // Dropdown Status Change Handler
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus.toUpperCase().replace(/_/g, ' ')}. Customer notified!`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(res.error || 'Failed to update order status');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (order.order_number || '').toLowerCase().includes(q) ||
      (order.customer_name || '').toLowerCase().includes(q) ||
      (order.customer_email || '').toLowerCase().includes(q) ||
      (order.customer_phone || '').toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pending Confirmation',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      case 'on_its_way':
        return {
          label: 'On Its Way',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          icon: <Truck className="w-3.5 h-3.5" />,
        };
      case 'delivered':
        return {
          label: 'Delivered',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: status,
          color: 'bg-muted text-muted-foreground border-border',
          icon: null,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Search & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-wide">Customer Orders</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create, edit, delete, and update COD order status with automated email updates to customers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button onClick={openCreateModal} className="bg-primary text-white hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Create Manual Order
          </Button>
          <Button onClick={loadOrders} variant="outline" size="sm" className="border-border gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search order #, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Orders List Container */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-accent" /> Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
              <Package className="w-12 h-12 mb-4 opacity-30 text-accent" />
              <p className="text-lg font-medium text-foreground">No orders found</p>
              <p className="text-xs text-muted-foreground mt-1">Click "+ Create Manual Order" or place a COD order on shop to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status || 'pending');
                const isUpdating = updatingId === order.id;

                return (
                  <div key={order.id} className="p-6 hover:bg-white/[0.01] transition-colors space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-base font-bold text-white">
                            {order.order_number || `XFP-${order.id.substring(0, 8)}`}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                            {badge.icon}
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Placed on: {new Date(order.created_at || Date.now()).toLocaleString()}
                        </p>
                      </div>

                      {/* Status Change Dropdown & Edit/Delete Action Buttons */}
                      <div className="flex items-center flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">Status:</span>
                          <select
                            disabled={isUpdating}
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="bg-background border border-accent/40 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer disabled:opacity-50"
                          >
                            <option value="pending">PENDING (Confirmation)</option>
                            <option value="confirmed">CONFIRMED (Processing)</option>
                            <option value="on_its_way">ON ITS WAY (Dispatched)</option>
                            <option value="delivered">DELIVERED (Completed)</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => openEditModal(order)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-border hover:border-accent hover:text-accent gap-1 text-xs"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </Button>

                          <Button
                            onClick={() => handleDeleteOrder(order.id, order.order_number || order.id)}
                            variant="outline"
                            size="sm"
                            className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </div>

                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-border/50 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-semibold uppercase text-[10px]">Customer Details</span>
                        <p className="text-foreground font-semibold text-sm">{order.customer_name || 'Guest'}</p>
                        <p className="text-muted-foreground flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-accent shrink-0" /> {order.customer_email || 'No Email'}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-accent shrink-0" /> {order.customer_phone || 'No Phone'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-muted-foreground font-semibold uppercase text-[10px]">Shipping Address</span>
                        <p className="text-foreground flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span>
                            {order.shipping_address || 'Address N/A'}<br />
                            {order.city} {order.postal_code}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-1 text-left md:text-right">
                        <span className="text-muted-foreground font-semibold uppercase text-[10px]">Payment & Total</span>
                        <p className="text-accent font-bold text-base">${Number(order.total_amount || 0).toFixed(2)}</p>
                        <p className="text-muted-foreground">Payment: <b className="text-foreground">{order.payment_method || 'Cash on Delivery'}</b></p>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="bg-background/60 border border-border/60 rounded-lg p-3 text-xs space-y-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Ordered Items</span>
                        {order.order_items.map((item: any, idx: number) => (
                          <div key={item.id || idx} className="flex justify-between items-center text-muted-foreground">
                            <span>
                              <b className="text-foreground">{item.item_name || item.name}</b> ({item.size}) &times; {item.quantity}
                            </span>
                            <span className="font-semibold text-accent">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE ORDER MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Create Manual Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  required
                  className="bg-background font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="pending">PENDING (Confirmation)</option>
                  <option value="confirmed">CONFIRMED (Processing)</option>
                  <option value="on_its_way">ON ITS WAY (Dispatched)</option>
                  <option value="delivered">DELIVERED (Completed)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  placeholder="John Doe"
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  placeholder="+44 7123 456789"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
                placeholder="customer@example.com"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Input
                id="shippingAddress"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                required
                placeholder="123 Science Park Road"
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  placeholder="London"
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                  placeholder="EC1A 1BB"
                  className="bg-background"
                />
              </div>
            </div>

            {/* Product Item Form */}
            <div className="p-4 bg-background border border-border rounded-xl space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-accent">Order Item & Pricing</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="itemName" className="text-xs">Product Name</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    required
                    className="bg-card text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="itemSize" className="text-xs">Size</Label>
                  <Input
                    id="itemSize"
                    value={formData.itemSize}
                    onChange={(e) => setFormData({ ...formData, itemSize: e.target.value })}
                    required
                    className="bg-card text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="itemPrice" className="text-xs">Price ($)</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    value={formData.itemPrice}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setFormData({ ...formData, itemPrice: p, totalAmount: p * formData.itemQuantity + 5.99 });
                    }}
                    required
                    className="bg-card text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="totalAmount" className="text-xs">Total Amount ($)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    required
                    className="bg-card text-xs font-bold text-accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-white">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Order & Notify Customer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT ORDER MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Edit Order Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editCustomerName">Customer Name</Label>
                <Input
                  id="editCustomerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editCustomerPhone">Phone Number</Label>
                <Input
                  id="editCustomerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editCustomerEmail">Customer Email</Label>
              <Input
                id="editCustomerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editShippingAddress">Shipping Address</Label>
              <Input
                id="editShippingAddress"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                required
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editCity">City</Label>
                <Input
                  id="editCity"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editPostalCode">Postal Code</Label>
                <Input
                  id="editPostalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editStatus">Status</Label>
                <select
                  id="editStatus"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="pending">PENDING (Confirmation)</option>
                  <option value="confirmed">CONFIRMED (Processing)</option>
                  <option value="on_its_way">ON ITS WAY (Dispatched)</option>
                  <option value="delivered">DELIVERED (Completed)</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editTotalAmount">Total Amount ($)</Label>
                <Input
                  id="editTotalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  required
                  className="bg-background font-bold text-accent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-white">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
