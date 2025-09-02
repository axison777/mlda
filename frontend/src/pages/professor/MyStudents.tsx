import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Search, MoreHorizontal, MessageCircle, Award, TrendingUp } from 'lucide-react';

const mockStudents = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    course: 'Allemand pour débutants',
    progress: 75,
    lastActive: '2024-01-20',
    totalLessons: 24,
    completedLessons: 18,
    averageScore: 85,
    status: 'active',
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    course: 'Allemand pour débutants',
    progress: 45,
    lastActive: '2024-01-18',
    totalLessons: 24,
    completedLessons: 11,
    averageScore: 78,
    status: 'active',
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    course: 'Grammaire allemande avancée',
    progress: 90,
    lastActive: '2024-01-19',
    totalLessons: 18,
    completedLessons: 16,
    averageScore: 92,
    status: 'active',
  },
  {
    id: '4',
    name: 'Thomas Durand',
    email: 'thomas.durand@email.com',
    course: 'Allemand pour débutants',
    progress: 20,
    lastActive: '2024-01-10',
    totalLessons: 24,
    completedLessons: 5,
    averageScore: 65,
    status: 'inactive',
  },
];

export const MyStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const averageProgress = mockStudents.reduce((sum, s) => sum + s.progress, 0) / totalStudents;
  const averageScore = mockStudents.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Étudiants</h1>
        <p className="text-gray-600">Suivez les progrès de vos étudiants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Étudiants</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Étudiants Actifs</p>
                <p className="text-3xl font-bold text-green-600">{activeStudents}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progression Moyenne</p>
                <p className="text-3xl font-bold text-yellow-600">{averageProgress.toFixed(0)}%</p>
              </div>
              <Award className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Moyen</p>
                <p className="text-3xl font-bold text-red-600">{averageScore.toFixed(0)}%</p>
              </div>
              <Award className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Score Moyen</TableHead>
                <TableHead>Dernière Activité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{student.completedLessons}/{student.totalLessons} leçons</span>
                        <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                          {student.progress}%
                        </span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getProgressColor(student.averageScore)}`}>
                      {student.averageScore}%
                    </span>
                  </TableCell>
                  <TableCell>{new Date(student.lastActive).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(student.status)}>
                      {student.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Envoyer un message
                        </DropdownMenuItem>
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Voir les résultats</DropdownMenuItem>
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