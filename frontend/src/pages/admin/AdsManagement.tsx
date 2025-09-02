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
import { Search, MoreHorizontal, Plus, Eye, BarChart3, Target } from 'lucide-react';

const mockAds = [
  {
    id: 'AD-001',
    title: 'Cours d\'allemand gratuit',
    type: 'banner',
    status: 'active',
    impressions: 12450,
    clicks: 234,
    ctr: 1.88,
    budget: 500,
    spent: 287,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  },
  {
    id: 'AD-002',
    title: 'Certification allemande',
    type: 'video',
    status: 'active',
    impressions: 8920,
    clicks: 156,
    ctr: 1.75,
    budget: 300,
    spent: 198,
    startDate: '2024-01-10',
    endDate: '2024-02-10',
  },
  {
    id: 'AD-003',
    title: 'Professeurs experts',
    type: 'social',
    status: 'paused',
    impressions: 5670,
    clicks: 89,
    ctr: 1.57,
    budget: 200,
    spent: 145,
    startDate: '2024-01-05',
    endDate: '2024-02-05',
  },
];

export const AdsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAds = mockAds.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      ended: 'bg-gray-100 text-gray-800',
      draft: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      banner: 'bg-purple-100 text-purple-800',
      video: 'bg-red-100 text-red-800',
      social: 'bg-blue-100 text-blue-800',
      search: 'bg-green-100 text-green-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalImpressions = mockAds.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = mockAds.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalSpent = mockAds.reduce((sum, ad) => sum + ad.spent, 0);
  const averageCTR = totalClicks / totalImpressions * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Publicités</h1>
          <p className="text-gray-600">Gérez vos campagnes publicitaires et analysez les performances</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impressions Totales</p>
                <p className="text-3xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% ce mois</p>
              </div>
              <Eye className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clics Totaux</p>
                <p className="text-3xl font-bold text-green-600">{totalClicks}</p>
                <p className="text-sm text-green-600">+8% ce mois</p>
              </div>
              <Target className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CTR Moyen</p>
                <p className="text-3xl font-bold text-yellow-600">{averageCTR.toFixed(2)}%</p>
                <p className="text-sm text-green-600">+0.3% ce mois</p>
              </div>
              <BarChart3 className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Dépensé</p>
                <p className="text-3xl font-bold text-red-600">€{totalSpent}</p>
                <p className="text-sm text-gray-600">Sur €1,000</p>
              </div>
              <DollarSign className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes Publicitaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher une campagne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campagne</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Dépensé</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ad.title}</p>
                      <p className="text-sm text-gray-600">{ad.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeBadge(ad.type)}>
                      {ad.type === 'banner' ? 'Bannière' :
                       ad.type === 'video' ? 'Vidéo' :
                       ad.type === 'social' ? 'Social' : 'Recherche'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(ad.status)}>
                      {ad.status === 'active' ? 'Active' :
                       ad.status === 'paused' ? 'En pause' :
                       ad.status === 'ended' ? 'Terminée' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                  <TableCell>{ad.clicks}</TableCell>
                  <TableCell>{ad.ctr}%</TableCell>
                  <TableCell>€{ad.budget}</TableCell>
                  <TableCell>€{ad.spent}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                        {ad.status === 'active' ? (
                          <DropdownMenuItem>Mettre en pause</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Activer</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          Supprimer
                        </DropdownMenuItem>
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