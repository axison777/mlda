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

import { useCourses, useDeleteCourse } from '@/hooks/useCourses';

export const CoursesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: coursesData, isLoading } = useCourses({
    search: searchTerm,
  });
  
  const deleteCourseMutation = useDeleteCourse();

  const courses = coursesData?.courses || [];

  const getLevelBadge = (level: string) => {
    const colors = {
      a1: 'bg-green-100 text-green-800',
      a2: 'bg-green-100 text-green-800',
      b1: 'bg-yellow-100 text-yellow-800',
      b2: 'bg-yellow-100 text-yellow-800',
      c1: 'bg-red-100 text-red-800',
      c2: 'bg-red-100 text-red-800',
    };
    return colors[level.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalStudents = courses.reduce((sum: number, course: any) => sum + (course._count?.enrollments || 0), 0);
  const publishedCourses = courses.filter((course: any) => course.status === 'PUBLISHED').length;

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      await deleteCourseMutation.mutateAsync(id);
    }
  };

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
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
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
                <p className="text-3xl font-bold text-red-600">4.8</p>
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

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead>Instructeur</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course: any) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">
                          Créé le {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.teacher?.firstName} {course.teacher?.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelBadge(course.level)}>
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{course._count?.enrollments || 0}</TableCell>
                    <TableCell>{course.price.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(course.status)}>
                        {course.status === 'PUBLISHED' ? 'Publié' :
                         course.status === 'DRAFT' ? 'Brouillon' : 'En attente'}
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
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};