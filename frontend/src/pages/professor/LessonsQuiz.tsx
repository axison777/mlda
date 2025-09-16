import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Play, FileText, HelpCircle } from 'lucide-react';

const mockLessons = [
  {
    id: '1',
    title: 'Les salutations en allemand',
    course: 'Allemand pour débutants',
    type: 'video',
    duration: '15 min',
    status: 'published',
    views: 234,
  },
  {
    id: '2',
    title: 'Les nombres de 1 à 100',
    course: 'Allemand pour débutants',
    type: 'text',
    duration: '10 min',
    status: 'published',
    views: 189,
  },
  {
    id: '3',
    title: 'Quiz: Vocabulaire de base',
    course: 'Allemand pour débutants',
    type: 'quiz',
    duration: '5 min',
    status: 'draft',
    views: 0,
  },
];

const mockQuizzes = [
  {
    id: '1',
    title: 'Quiz: Les articles définis',
    course: 'Grammaire allemande',
    questions: 15,
    attempts: 67,
    averageScore: 78,
    status: 'published',
  },
  {
    id: '2',
    title: 'Test: Conjugaison des verbes',
    course: 'Allemand intermédiaire',
    questions: 20,
    attempts: 45,
    averageScore: 82,
    status: 'published',
  },
];

export const LessonsQuiz = () => {
  const [newLesson, setNewLesson] = useState({
    title: '',
    course: '',
    type: 'video',
    content: '',
    duration: '',
  });

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    course: '',
    questions: [{ question: '', options: ['', '', '', ''], correct: 0 }],
  });

  const getTypeBadge = (type: string) => {
    const colors = {
      video: 'bg-red-100 text-red-800',
      text: 'bg-blue-100 text-blue-800',
      audio: 'bg-green-100 text-green-800',
      quiz: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const addQuizQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correct: 0 }]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leçons & Quiz</h1>
        <p className="text-gray-600">Créez et gérez le contenu pédagogique de vos cours</p>
      </div>

      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Mes Leçons</TabsTrigger>
          <TabsTrigger value="create-lesson">Créer une Leçon</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz & Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Leçons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        {lesson.type === 'video' && <Play className="w-6 h-6 text-red-600" />}
                        {lesson.type === 'text' && <FileText className="w-6 h-6 text-blue-600" />}
                        {lesson.type === 'quiz' && <HelpCircle className="w-6 h-6 text-purple-600" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">{lesson.course}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeBadge(lesson.type)}>
                            {lesson.type === 'video' ? 'Vidéo' :
                             lesson.type === 'text' ? 'Texte' :
                             lesson.type === 'audio' ? 'Audio' : 'Quiz'}
                          </Badge>
                          <Badge className={getStatusBadge(lesson.status)}>
                            {lesson.status === 'published' ? 'Publié' : 'Brouillon'}
                          </Badge>
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                          <span className="text-sm text-gray-500">{lesson.views} vues</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-lesson">
          <Card>
            <CardHeader>
              <CardTitle>Créer une Nouvelle Leçon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la leçon
                  </label>
                  <Input
                    value={newLesson.title}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Les salutations en allemand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cours associé
                  </label>
                  <Select
                    value={newLesson.course}
                    onValueChange={(value) => setNewLesson(prev => ({ ...prev, course: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Allemand pour débutants</SelectItem>
                      <SelectItem value="intermediate">Allemand intermédiaire</SelectItem>
                      <SelectItem value="advanced">Allemand avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contenu
                  </label>
                  <Select
                    value={newLesson.type}
                    onValueChange={(value) => setNewLesson(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vidéo</SelectItem>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée estimée
                  </label>
                  <Input
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Ex: 15 minutes"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de la leçon
                </label>
                <Textarea
                  value={newLesson.content}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Rédigez le contenu de votre leçon..."
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Sauvegarder en brouillon</Button>
                <Button className="bg-red-600 hover:bg-red-700">Publier la leçon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.course}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{quiz.questions} questions</span>
                          <span>{quiz.attempts} tentatives</span>
                          <span>Score moyen: {quiz.averageScore}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Créer un Nouveau Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du quiz
                    </label>
                    <Input
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Quiz sur les articles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cours associé
                    </label>
                    <Select
                      value={newQuiz.course}
                      onValueChange={(value) => setNewQuiz(prev => ({ ...prev, course: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Allemand pour débutants</SelectItem>
                        <SelectItem value="intermediate">Allemand intermédiaire</SelectItem>
                        <SelectItem value="advanced">Allemand avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Questions du Quiz</h3>
                  {newQuiz.questions.map((question, index) => (
                    <Card key={index} className="border-l-4 border-l-purple-600">
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question {index + 1}
                          </label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => {
                              const newQuestions = [...newQuiz.questions];
                              newQuestions[index].question = e.target.value;
                              setNewQuiz(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            placeholder="Tapez votre question ici..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option {optionIndex + 1} {optionIndex === question.correct && '(Correcte)'}
                              </label>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newQuestions = [...newQuiz.questions];
                                  newQuestions[index].options[optionIndex] = e.target.value;
                                  setNewQuiz(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Réponse correcte
                          </label>
                          <Select
                            value={question.correct.toString()}
                            onValueChange={(value) => {
                              const newQuestions = [...newQuiz.questions];
                              newQuestions[index].correct = parseInt(value);
                              setNewQuiz(prev => ({ ...prev, questions: newQuestions }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Option 1</SelectItem>
                              <SelectItem value="1">Option 2</SelectItem>
                              <SelectItem value="2">Option 3</SelectItem>
                              <SelectItem value="3">Option 4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button onClick={addQuizQuestion} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une question
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Sauvegarder en brouillon</Button>
                  <Button className="bg-red-600 hover:bg-red-700">Publier le quiz</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};