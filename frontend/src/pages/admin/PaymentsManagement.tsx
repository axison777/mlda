import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, CreditCard, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockPayments = [
  {
    id: 'PAY-001',
    user: 'Marie Dubois',
    course: 'Allemand pour débutants',
    amount: 49,
    status: 'completed',
    method: 'card',
    date: '2024-01-20',
  },
  {
    id: 'PAY-002',
    user: 'Pierre Martin',
    course: 'Allemand des affaires',
    amount: 89,
    status: 'completed',
    method: 'paypal',
    date: '2024-01-19',
  },
  {
    id: 'PAY-003',
    user: 'Sophie Laurent',
    course: 'Grammaire allemande',
    amount: 69,
    status: 'pending',
    method: 'card',
    date: '2024-01-18',
  },
  {
    id: 'PAY-004',
    user: 'Thomas Durand',
    course: 'Conversation allemande',
    amount: 59,
    status: 'failed',
    method: 'card',
    date: '2024-01-17',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Fév', revenue: 38000 },
  { month: 'Mar', revenue: 42000 },
  { month: 'Avr', revenue: 45230 },
  { month: 'Mai', revenue: 41000 },
  { month: 'Juin', revenue: 48000 },
];

export const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = mockPayments.filter(payment =>
    payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      card: 'bg-blue-100 text-blue-800',
      paypal: 'bg-purple-100 text-purple-800',
      bank: 'bg-gray-100 text-gray-800',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
        <p className="text-gray-600">Suivez les transactions et revenus de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Totaux</p>
                <p className="text-3xl font-bold text-gray-900">€{totalRevenue}</p>
                <p className="text-sm text-green-600">+15% ce mois</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paiements Réussis</p>
                <p className="text-3xl font-bold text-green-600">{completedPayments}</p>
                <p className="text-sm text-gray-600">Ce mois</p>
              </div>
              <CreditCard className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingPayments}</p>
                <p className="text-sm text-gray-600">À traiter</p>
              </div>
              <Calendar className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Réussite</p>
                <p className="text-3xl font-bold text-blue-600">94%</p>
                <p className="text-sm text-green-600">+2% ce mois</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
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

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaction</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell>{payment.user}</TableCell>
                  <TableCell>{payment.course}</TableCell>
                  <TableCell className="font-medium">€{payment.amount}</TableCell>
                  <TableCell>
                    <Badge className={getMethodBadge(payment.method)}>
                      {payment.method === 'card' ? 'Carte' :
                       payment.method === 'paypal' ? 'PayPal' : 'Virement'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(payment.status)}>
                      {payment.status === 'completed' ? 'Réussi' :
                       payment.status === 'pending' ? 'En attente' :
                       payment.status === 'failed' ? 'Échoué' : 'Remboursé'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Télécharger reçu</DropdownMenuItem>
                        {payment.status === 'completed' && (
                          <DropdownMenuItem className="text-red-600">
                            Rembourser
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};