import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '../utils/helpers';
import { analyticsAPI, usersAPI, productsAPI } from '../services/api';
import { PageHeader, Card, Badge } from '../components';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [dashboardRes, salesRes, customersRes, productsRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getSales({ period: 'monthly', groupBy: 'day' }),
          usersAPI.getAll({ role: 'customer', status: 'active', page: 1, limit: 1 }),
          productsAPI.getAll({ page: 1, limit: 1 })
        ]);

        const dashboard = dashboardRes?.data?.data || {};
        const sales = salesRes?.data?.data || {};
        const totalCustomers = customersRes?.data?.data?.pagination?.totalItems || 0;
        const totalProducts = productsRes?.data?.data?.pagination?.totalItems || 0;

        const thisMonthOrders = dashboard?.thisMonth?.orders || 0;
        const thisMonthRevenue = dashboard?.thisMonth?.revenue || 0;
        const lastMonthOrders = dashboard?.lastMonth?.orders || 0;
        const lastMonthRevenue = dashboard?.lastMonth?.revenue || 0;

        const salesGrowth = lastMonthRevenue > 0
          ? Number((((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
          : 0;
        const ordersGrowth = lastMonthOrders > 0
          ? Number((((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1))
          : 0;

        setStats({
          totalSales: thisMonthRevenue,
          totalOrders: thisMonthOrders,
          totalCustomers,
          totalProducts,
          salesGrowth,
          ordersGrowth,
        });

        const salesSeries = Array.isArray(sales.salesData)
          ? sales.salesData.map((d) => ({ date: d.date, sales: d.totalSales }))
          : [];
        setSalesData(salesSeries);

        const recent = Array.isArray(dashboard.recentOrders)
          ? dashboard.recentOrders.map((o) => ({
              id: o.id,
              orderNumber: o.orderNumber,
              customer: o.customer,
              amount: o.total,
              status: o.status,
              date: o.createdAt,
            }))
          : [];
        setRecentOrders(recent);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Total Sales',
      value: formatCurrency(stats.totalSales),
      icon: CurrencyDollarIcon,
      change: stats.salesGrowth,
      changeType: 'increase',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCartIcon,
      change: stats.ordersGrowth,
      changeType: 'increase',
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: UsersIcon,
      change: 5.2,
      changeType: 'increase',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: CubeIcon,
      change: 2.1,
      changeType: 'increase',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 luxe-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="Overview of your ecommerce store performance" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const gradients = ['gradient-peach-gold', 'gradient-aqua-coral', 'gradient-rose-pink', 'gradient-gold-aqua'];
          const gradient = gradients[index % gradients.length];
          
          return (
            <Card key={stat.name} padding="p-6" className="luxe-card transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`h-12 w-12 rounded-xl ${gradient} flex items-center justify-center shadow-luxe`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate luxe-text">{stat.name}</dt>
                    <dd className="text-2xl font-bold text-gray-900 luxe-heading">{stat.value}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                {stat.changeType === 'increase' ? (
                  <div className="inline-flex items-center text-green-600 text-sm">
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    <span className="ml-1 font-semibold">{stat.change}%</span>
                    <span className="ml-2 text-gray-500 luxe-alt">from last month</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center text-red-600 text-sm">
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                    <span className="ml-1 font-semibold">{stat.change}%</span>
                    <span className="ml-2 text-gray-500 luxe-alt">from last month</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card title="Sales Overview" className="glass shadow-luxe">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tickFormatter={(value) => formatDate(value, 'MMM dd')} stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value, 'MMM dd, yyyy')} 
                  formatter={(value) => [formatCurrency(value), 'Sales']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="url(#salesGradient)" 
                  strokeWidth={3} 
                  dot={{ fill: '#ea3e66', strokeWidth: 2, r: 6 }} 
                />
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ee7f6b" />
                    <stop offset="100%" stopColor="#ea3e66" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Orders" className="glass shadow-luxe">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5 border border-white/30 rounded-xl bg-white/40 hover:bg-white/60 transition-all duration-200">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 luxe-text">{order.orderNumber}</p>
                    <Badge color={order.status === 'delivered' ? 'green' : order.status === 'processing' ? 'yellow' : order.status === 'shipped' ? 'blue' : 'gray'}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 luxe-alt mt-1">{order.customer}</p>
                  <p className="text-xs text-gray-500 luxe-alt">{formatDate(order.date)}</p>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold text-gray-900 luxe-heading">{formatCurrency(order.amount)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="text-sm text-rose-600 hover:text-rose-700 font-semibold luxe-text transition-colors duration-200">View all orders →</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 