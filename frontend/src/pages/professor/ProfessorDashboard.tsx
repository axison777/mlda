import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Star, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const professorStats = [
  {
    title: 'Mes Cours',
    value: '12',
    change: '+2 ce mois',
    icon: BookOpen,
    color: 'text-blue-600',
  },
  {
    title: 'Étudiants Actifs',
    value: '847',
    change: '+45 ce mois',
    icon: Users,
    color: 'text-green-600',
  },
  {
    title: 'Note Moyenne',
    value: '4.8',
    change: '+0.2',
    icon: Star,
    color: 'text-yellow-600',
  },
  {
    title: 'Revenus',
    value: '€3,240',
    change: '+18%',
    icon: TrendingUp,
    color: 'text-red-600',
  },
];

const enrollmentData = [
  { month: 'Jan', students: 120 },
  { month: 'Fév', students: 180 },
  { month: 'Mar', students: 240 },
  { month: 'Avr', students: 320 },
  { month: 'Mai', students: 420 },
  { month: 'Juin', students: 520 },
];

export const ProfessorDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Professeur</h1>
          <p className="text-gray-600">Gérez vos cours et suivez vos étudiants</p>
        </div>
        <Link to="/professor/create-course">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Cours
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {professorStats.map((stat, index) => (
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

      {/* Course Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inscriptions d'Étudiants</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#dc2626"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/professor/create-course">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Créer un cours
              </Button>
            </Link>
            <Link to="/professor/lessons">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une leçon
              </Button>
            </Link>
            <Link to="/professor/students">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Voir les étudiants
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};