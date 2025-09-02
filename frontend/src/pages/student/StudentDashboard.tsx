import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Award, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const studentStats = [
  {
    title: 'Cours Suivis',
    value: '5',
    change: 'En cours',
    icon: BookOpen,
    color: 'text-blue-600',
  },
  {
    title: 'Heures Étudiées',
    value: '47h',
    change: 'Cette semaine: 8h',
    icon: Clock,
    color: 'text-green-600',
  },
  {
    title: 'Progression',
    value: '68%',
    change: 'Niveau intermédiaire',
    icon: Award,
    color: 'text-yellow-600',
  },
];

const currentCourses = [
  {
    id: '1',
    title: 'Allemand pour débutants',
    progress: 75,
    nextLesson: 'Leçon 8: Les verbes irréguliers',
    instructor: 'Dr. Mueller',
  },
  {
    id: '2',
    title: 'Grammaire allemande avancée',
    progress: 45,
    nextLesson: 'Leçon 5: Le subjonctif',
    instructor: 'Prof. Schmidt',
  },
  {
    id: '3',
    title: 'Conversation allemande',
    progress: 90,
    nextLesson: 'Leçon 12: Débats et opinions',
    instructor: 'Mme Weber',
  },
];

export const StudentDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Étudiant</h1>
        <p className="text-gray-600">Continuez votre apprentissage de l'allemand</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studentStats.map((stat, index) => (
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
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Cours en Cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">Par {course.instructor}</p>
                  <p className="text-sm text-gray-500 mt-1">{course.nextLesson}</p>
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
                <div className="ml-6">
                  <Link to="/student/continue">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Play className="w-4 h-4 mr-2" />
                      Continuer
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommandé pour vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-gray-900">Cours de préparation TestDaF</h3>
                <p className="text-sm text-gray-600">Préparez-vous à l'examen officiel</p>
                <Button variant="outline" size="sm" className="mt-2">
                  En savoir plus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objectifs de la Semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Compléter 3 leçons</span>
                <span className="text-sm text-green-600 font-medium">2/3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Réviser le vocabulaire</span>
                <span className="text-sm text-yellow-600 font-medium">En cours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quiz de grammaire</span>
                <span className="text-sm text-gray-400 font-medium">À faire</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};