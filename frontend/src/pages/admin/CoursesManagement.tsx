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
import { Search, MoreHorizontal, Plus, BookOpen, Users, Star } from 'lucide-react';

const mockCourses = [
  {
    id: '1',
    title: 'Allemand pour débutants',
    instructor: 'Dr. Hans Mueller',
    level: 'beginner',
    students: 245,
    rating: 4.8,
    price: 49,
    status: 'published',
    createdAt: '2023-09-15',
  },
  {
    id: '2',
    title: 'Allemand des affaires',
    instructor: 'Prof. Anna Schmidt',
    level: 'advanced',
    students: 156,
    rating: 4.9,
    price: 89,
    status: 'published',
    createdAt: '2023-10-20',
  },
  {
    id: '3',
    title: 'Grammaire allemande avancée',
    instructor: 'Dr. Klaus Weber',
    level: 'intermediate',
    students: 89,
    rating: 4.7,
    price: 69,
    status: 'draft',
    createdAt: '2024-01-10',
  },
];

export const CoursesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0);
  const averageRating = mockCourses.reduce((sum, course) => sum + course.rating, 0) / mockCourses.length;
  const publishedCourses = mockCourses.filter(course => course.status === 'published').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
          <p className="text-gray-600">Gérez le contenu pédagogique de la plateforme</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau cours
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cours</p>
                <p className="text-3xl font-bold text-gray-900">{mockCourses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cours Publiés</p>
                <p className="text-3xl font-bold text-green-600">{publishedCourses}</p>
              </div>
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Étudiants</p>
                <p className="text-3xl font-bold text-yellow-600">{totalStudents}</p>
              </div>
              <Users className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note Moyenne</p>
                <p className="text-3xl font-bold text-red-600">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cours</TableHead>
                <TableHead>Instructeur</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-600">
                        Créé le {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <Badge className={getLevelBadge(course.level)}>
                      {course.level === 'beginner' ? 'Débutant' :
                       course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </TableCell>
                  <TableCell>€{course.price}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(course.status)}>
                      {course.status === 'published' ? 'Publié' :
                       course.status === 'draft' ? 'Brouillon' : 'En attente'}
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
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Dupliquer</DropdownMenuItem>
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