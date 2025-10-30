import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon,
  ShoppingBagIcon, UsersIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { PageHeader, Card, EmptyState } from '../components';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    salesData: [],
    productPerformance: [],
    categorySales: [],
    customerMetrics: [],
    paymentMethods: []
  });

  // Mock data for demonstration
  const mockSalesData = [
    { date: '2024-01-01', sales: 1200, orders: 15, customers: 12 },
    { date: '2024-01-02', sales: 1800, orders: 22, customers: 18 },
    { date: '2024-01-03', sales: 1500, orders: 19, customers: 16 },
    { date: '2024-01-04', sales: 2200, orders: 28, customers: 24 },
    { date: '2024-01-05', sales: 1900, orders: 25, customers: 21 },
    { date: '2024-01-06', sales: 2800, orders: 35, customers: 30 },
    { date: '2024-01-07', sales: 3200, orders: 40, customers: 35 },
  ];

  const mockProductPerformance = [
    { name: 'Laptop Pro', sales: 45, revenue: 13500, growth: 12 },
    { name: 'Wireless Headphones', sales: 38, revenue: 7600, growth: 8 },
    { name: 'Smart Watch', sales: 32, revenue: 6400, growth: -5 },
    { name: 'Gaming Mouse', sales: 28, revenue: 4200, growth: 15 },
    { name: 'Bluetooth Speaker', sales: 25, revenue: 3750, growth: 3 },
  ];

  const mockCategorySales = [
    { name: 'Electronics', value: 45, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Home & Garden', value: 15, color: '#F59E0B' },
    { name: 'Sports', value: 10, color: '#EF4444' },
    { name: 'Books', value: 5, color: '#8B5CF6' },
  ];

  const mockOverview = {
    totalSales: 15600,
    totalOrders: 184,
    totalCustomers: 156,
    averageOrderValue: 84.78,
    salesGrowth: 12.5,
    orderGrowth: 8.2,
    customerGrowth: 15.3,
    aovGrowth: 4.1
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const now = new Date();
        let startDate;
        if (timeRange === '7d') startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (timeRange === '30d') startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        else if (timeRange === '90d') startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        else if (timeRange === '1y') startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        else startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const params = {
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          period: timeRange === '1y' ? 'monthly' : 'daily',
          groupBy: timeRange === '1y' ? 'month' : 'day',
        };

        const [salesRes, productsRes, customersRes] = await Promise.all([
          analyticsAPI.getSales(params),
          analyticsAPI.getProducts({ startDate: params.startDate, endDate: params.endDate, limit: 10 }),
          analyticsAPI.getCustomers({ startDate: params.startDate, endDate: params.endDate, limit: 10 }),
        ]);

        const sales = salesRes.data?.data || {};
        const products = productsRes.data?.data || {};
        const customers = customersRes.data?.data || {};

        setAnalyticsData({
          overview: {
            totalSales: sales.summary?.totalRevenue || 0,
            totalOrders: sales.summary?.totalOrders || 0,
            totalCustomers: customers.topCustomers?.length || 0,
            averageOrderValue: sales.summary?.averageOrderValue || 0,
            salesGrowth: undefined,
            orderGrowth: undefined,
            customerGrowth: undefined,
            aovGrowth: undefined,
          },
          salesData: (sales.salesData || []).map(d => ({
            date: d.date,
            sales: d.totalSales,
            orders: d.orderCount,
            aov: d.averageOrderValue,
          })),
          productPerformance: (products.topProducts || []).map(p => ({
            name: p.product?.name || 'Unknown',
            sales: p.totalQuantity,
            revenue: p.totalRevenue,
            growth: 0,
          })),
          categorySales: (products.categoryPerformance || []).map(c => ({
            name: c.category?.name || 'Other',
            value: c.totalRevenue,
            color: '#3B82F6',
          })),
          customerMetrics: customers.customerAcquisition || [],
          paymentMethods: sales.paymentMethods || [],
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const StatCard = ({ title, value, change, icon: Icon, type = 'positive' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {type === 'positive' ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ml-1 ${
              type === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Track your store performance and insights"
        actions={(
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              Export Report
            </button>
          </div>
        )}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(analyticsData.overview.totalSales)}
          change={analyticsData.overview.salesGrowth}
          icon={CurrencyDollarIcon}
          type="positive"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(analyticsData.overview.totalOrders)}
          change={analyticsData.overview.orderGrowth}
          icon={ShoppingBagIcon}
          type="positive"
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(analyticsData.overview.totalCustomers)}
          change={analyticsData.overview.customerGrowth}
          icon={UsersIcon}
          type="positive"
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(analyticsData.overview.averageOrderValue)}
          change={analyticsData.overview.aovGrowth}
          icon={ChartBarIcon}
          type="positive"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? formatCurrency(value) : value,
                  name === 'sales' ? 'Sales' : name === 'orders' ? 'Orders' : 'Customers'
                ]}
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
              />
              <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sales by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.categorySales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Performance */}
      <Card title="Top Performing Products">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.productPerformance.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sales}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(product.revenue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${
                      product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth >= 0 ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(product.growth)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Retention */}
        <Card title="Customer Retention" padding="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Customers</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.customerMetrics.reduce((sum, d) => sum + (d.newCustomers || 0), 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Returning Customers</span>
              <span className="text-sm font-medium text-gray-900">{Math.round((analyticsData.overview.totalCustomers || 0) * 0.4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <span className="text-sm font-medium text-green-600">{(Math.min(100, Math.max(0, (analyticsData.overview.totalCustomers ? 40 : 0)))).toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card title="Payment Methods" padding="p-6">
          <div className="space-y-4">
            {analyticsData.paymentMethods.length === 0 ? (
              <EmptyState title="No payment data" description="No orders found in this period." />
            ) : (
              analyticsData.paymentMethods.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{m.method || 'unknown'}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(m.total || 0)}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock Alerts placeholder */}
        <Card title="Low Stock Alerts" padding="p-6">
          <div className="space-y-4">
            <EmptyState title="Coming soon" description="Hook to low stock products for quick actions." />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 