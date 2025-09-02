import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Play, BookOpen, Clock, Star, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const enrolledCourses = [
  {
    id: '1',
    title: 'Allemand pour débutants',
    instructor: 'Dr. Hans Mueller',
    level: 'beginner',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    nextLesson: 'Leçon 19: Les verbes de modalité',
    rating: 4.8,
    duration: '8 semaines',
    image: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg',
    lastAccessed: '2024-01-20',
  },
  {
    id: '2',
    title: 'Grammaire allemande avancée',
    instructor: 'Prof. Anna Schmidt',
    level: 'advanced',
    progress: 45,
    totalLessons: 18,
    completedLessons: 8,
    nextLesson: 'Leçon 9: Le subjonctif II',
    rating: 4.9,
    duration: '6 semaines',
    image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg',
    lastAccessed: '2024-01-18',
  },
  {
    id: '3',
    title: 'Conversation allemande pratique',
    instructor: 'Mme Weber',
    level: 'intermediate',
    progress: 90,
    totalLessons: 12,
    completedLessons: 11,
    nextLesson: 'Leçon 12: Débats et opinions',
    rating: 4.7,
    duration: '4 semaines',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
    lastAccessed: '2024-01-19',
  },
];

const availableCourses = [
  {
    id: '4',
    title: 'Allemand des affaires',
    instructor: 'Dr. Klaus Weber',
    level: 'advanced',
    price: 89,
    rating: 4.9,
    students: 156,
    duration: '10 semaines',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
  },
  {
    id: '5',
    title: 'Préparation TestDaF',
    instructor: 'Prof. Lisa Hoffman',
    level: 'advanced',
    price: 129,
    rating: 4.8,
    students: 89,
    duration: '12 semaines',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
  },
];

export const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('enrolled');

  const filteredEnrolledCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const filteredAvailableCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
        <p className="text-gray-600">Suivez vos cours et découvrez de nouveaux contenus</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Niveau: {filterLevel === 'all' ? 'Tous' : filterLevel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterLevel('all')}>
                  Tous les niveaux
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterLevel('beginner')}>
                  Débutant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterLevel('intermediate')}>
                  Intermédiaire
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterLevel('advanced')}>
                  Avancé
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Course Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'enrolled' ? 'default' : 'outline'}
          onClick={() => setActiveTab('enrolled')}
          className={activeTab === 'enrolled' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          Mes Cours Inscrits ({enrolledCourses.length})
        </Button>
        <Button
          variant={activeTab === 'available' ? 'default' : 'outline'}
          onClick={() => setActiveTab('available')}
          className={activeTab === 'available' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          Cours Disponibles ({availableCourses.length})
        </Button>
      </div>

      {/* Enrolled Courses */}
      {activeTab === 'enrolled' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrolledCourses.map((course, index) => (
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
                    <Badge className={getLevelBadge(course.level)}>
                      {course.level === 'beginner' ? 'Débutant' :
                       course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">Par {course.instructor}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{course.completedLessons}/{course.totalLessons} leçons</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 mb-3">
                        Prochaine leçon: {course.nextLesson}
                      </p>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Play className="w-4 h-4 mr-2" />
                        Continuer le cours
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Available Courses */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAvailableCourses.map((course, index) => (
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
                    <Badge className={getLevelBadge(course.level)}>
                      {course.level === 'beginner' ? 'Débutant' :
                       course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">Par {course.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {course.rating}
                    </div>
                    <span>{course.students} étudiants</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">€{course.price}</span>
                    <Button className="bg-red-600 hover:bg-red-700">
                      S'inscrire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};