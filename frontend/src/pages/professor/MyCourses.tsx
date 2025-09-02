import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Users, Star, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const myCourses = [
  {
    id: '1',
    title: 'Allemand pour débutants',
    description: 'Cours complet pour apprendre les bases de l\'allemand',
    level: 'beginner',
    students: 245,
    rating: 4.8,
    reviews: 89,
    price: 49,
    status: 'published',
    progress: 100,
    lessons: 24,
    duration: '8 semaines',
    image: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg',
  },
  {
    id: '2',
    title: 'Grammaire allemande avancée',
    description: 'Perfectionnez votre maîtrise de la grammaire allemande',
    level: 'advanced',
    students: 156,
    rating: 4.9,
    reviews: 67,
    price: 79,
    status: 'published',
    progress: 100,
    lessons: 18,
    duration: '6 semaines',
    image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg',
  },
  {
    id: '3',
    title: 'Conversation allemande pratique',
    description: 'Améliorez votre expression orale en allemand',
    level: 'intermediate',
    students: 0,
    rating: 0,
    reviews: 0,
    price: 59,
    status: 'draft',
    progress: 65,
    lessons: 12,
    duration: '4 semaines',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
  },
];

export const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = myCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalStudents = myCourses.reduce((sum, course) => sum + course.students, 0);
  const publishedCourses = myCourses.filter(course => course.status === 'published').length;
  const averageRating = myCourses
    .filter(course => course.rating > 0)
    .reduce((sum, course) => sum + course.rating, 0) / 
    myCourses.filter(course => course.rating > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
          <p className="text-gray-600">Gérez et suivez vos cours</p>
        </div>
        <Link to="/professor/create-course">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Créer un cours
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{myCourses.length}</p>
              <p className="text-sm text-gray-600">Total Cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{publishedCourses}</p>
              <p className="text-sm text-gray-600">Cours Publiés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
              <p className="text-sm text-gray-600">Total Étudiants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {averageRating ? averageRating.toFixed(1) : '0.0'}
              </p>
              <p className="text-sm text-gray-600">Note Moyenne</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusBadge(course.status)}>
                    {course.status === 'published' ? 'Publié' :
                     course.status === 'draft' ? 'Brouillon' : 'En attente'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <Badge className={getLevelBadge(course.level)}>
                        {course.level === 'beginner' ? 'Débutant' :
                         course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </Badge>
                      <span>{course.lessons} leçons</span>
                      <span>{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">{course.students} étudiants</span>
                      </div>
                      {course.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          <span className="text-sm">{course.rating} ({course.reviews})</span>
                        </div>
                      )}
                    </div>

                    {course.status === 'draft' && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progression</span>
                          <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-600">€{course.price}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};