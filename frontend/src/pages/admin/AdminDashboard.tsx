import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';


const revenueData = [
  { month: 'Jan', revenue: 3200000 },
  { month: 'Fév', revenue: 3800000 },
  { month: 'Mar', revenue: 4200000 },
  { month: 'Avr', revenue: 4523000 },
  { month: 'Mai', revenue: 4100000 },
  { month: 'Juin', revenue: 4800000 },
];

const coursesData = [
  { level: 'Débutant', count: 145 },
  { level: 'Intermédiaire', count: 123 },
  { level: 'Avancé', count: 74 },
];

export const AdminDashboard = () => {
  const { data: statsData, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Apprenants',
      value: statsData?.stats?.users?.total?.toString() || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Professeurs Actifs',
      value: statsData?.stats?.users?.byRole?.teacher?.toString() || '0',
      change: '+5%',
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'Cours Publiés',
      value: statsData?.stats?.courses?.byStatus?.published?.toString() || '0',
      change: '+8%',
      icon: BookOpen,
      color: 'text-red-600',
    },
    {
      title: 'Revenus Mensuels',
      value: `${(statsData?.stats?.revenue?.total || 0).toLocaleString()} FCFA`,
      change: '+15%',
      icon: TrendingUp,
      color: 'text-yellow-600',
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme MLDA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus Mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Revenus']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#dc2626"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cours par Niveau</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};