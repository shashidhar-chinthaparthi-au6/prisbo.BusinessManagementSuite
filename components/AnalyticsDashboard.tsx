'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  totalCustomers: number;
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalTeam: number;
  customersByStatus: Array<{ name: string; value: number }>;
  projectsByMonth: Array<{ _id: { year: number; month: number }; count: number }>;
}

const COLORS = ['#1e3a8a', '#dc2626', '#3b82f6', '#b91c1c'];

export default function AnalyticsDashboard({
  totalCustomers,
  totalProjects,
  completedProjects,
  activeProjects,
  totalTeam,
  customersByStatus,
  projectsByMonth,
}: AnalyticsDashboardProps) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const projectsChartData = projectsByMonth.map((item) => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    projects: item.count,
  }));

  const stats = [
    { label: 'Total Customers', value: totalCustomers, color: 'primary' },
    { label: 'Total Projects', value: totalProjects, color: 'primary' },
    { label: 'Active Projects', value: activeProjects, color: 'secondary' },
    { label: 'Completed Projects', value: completedProjects, color: 'primary' },
    { label: 'Team Members', value: totalTeam, color: 'primary' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-neutral mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers by Status - Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Customers by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customersByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customersByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Projects Over Time - Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Projects Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="projects" stroke="#1e3a8a" strokeWidth={2} name="Projects" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customers by Status - Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">Customer Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customersByStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="value" fill="#1e3a8a" name="Customers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
