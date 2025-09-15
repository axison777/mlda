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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Play, FileText, HelpCircle, Upload, Wand2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const mockLessons = [
  {
    id: '1',
    title: 'Les salutations en allemand',
    course: 'Allemand pour débutants',
    type: 'video',
    duration: '15 min',
    status: 'published',
    views: 234,
    videoUrl: '',
    audioUrl: '',
    content: 'Contenu de la leçon...',
  },
  {
    id: '2',
    title: 'Les nombres de 1 à 100',
    course: 'Allemand pour débutants',
    type: 'text',
    duration: '10 min',
    status: 'published',
    views: 189,
    content: 'Contenu textuel de la leçon...',
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
    type: 'lesson',
    lessonId: '1',
    questions: 15,
    attempts: 67,
    averageScore: 78,
    status: 'published',
  },
  {
    id: '2',
    title: 'Test: Conjugaison des verbes',
    course: 'Allemand intermédiaire',
    type: 'course',
    courseId: '1',
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
    videoUrl: '',
    audioUrl: '',
    documentUrl: '',
  });

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    course: '',
    type: 'lesson',
    lessonId: '',
    courseId: '',
    questions: [{ question: '', options: ['', '', '', ''], correct: 0, explanation: '' }],
  });

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  const getTypeBadge = (type: string) => {
    const colors = {
      video: 'bg-red-100 text-red-800',
      text: 'bg-blue-100 text-blue-800',
      audio: 'bg-green-100 text-green-800',
      quiz: 'bg-purple-100 text-purple-800',
      document: 'bg-orange-100 text-orange-800',
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
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correct: 0, explanation: '' }]
    }));
  };

  const removeQuizQuestion = (index: number) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (type: 'video' | 'audio' | 'document') => {
    // Simulation d'upload
    const mockUrl = `https://example.com/${type}-${Date.now()}.${type === 'document' ? 'pdf' : type === 'video' ? 'mp4' : 'mp3'}`;
    
    if (type === 'video') {
      setNewLesson(prev => ({ ...prev, videoUrl: mockUrl }));
    } else if (type === 'audio') {
      setNewLesson(prev => ({ ...prev, audioUrl: mockUrl }));
    } else {
      setNewLesson(prev => ({ ...prev, documentUrl: mockUrl }));
    }
    
    toast.success(`${type === 'video' ? 'Vidéo' : type === 'audio' ? 'Audio' : 'Document'} uploadé avec succès !`);
  };

  const generateQuizAutomatically = (type: 'lesson' | 'course') => {
    const generatedQuestions = [
      {
        question: 'Comment dit-on "Bonjour" en allemand ?',
        options: ['Guten Tag', 'Auf Wiedersehen', 'Danke', 'Bitte'],
        correct: 0,
        explanation: 'Guten Tag est la salutation standard en allemand.'
      },
      {
        question: 'Quel est l\'article défini pour "Haus" (maison) ?',
        options: ['der', 'die', 'das', 'den'],
        correct: 2,
        explanation: 'Das Haus - "Haus" est neutre en allemand.'
      },
      {
        question: 'Comment conjugue-t-on "sein" (être) à la première personne du singulier ?',
        options: ['bin', 'bist', 'ist', 'sind'],
        correct: 0,
        explanation: 'Ich bin - première personne du singulier de "sein".'
      }
    ];

    setNewQuiz(prev => ({
      ...prev,
      questions: generatedQuestions,
      title: type === 'lesson' ? 'Quiz automatique - Leçon' : 'Quiz général - Cours complet'
    }));

    toast.success('Quiz généré automatiquement ! Vous pouvez maintenant le modifier.');
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setNewLesson({
      title: lesson.title,
      course: lesson.course,
      type: lesson.type,
      content: lesson.content || '',
      duration: lesson.duration,
      videoUrl: lesson.videoUrl || '',
      audioUrl: lesson.audioUrl || '',
      documentUrl: lesson.documentUrl || '',
    });
    setIsLessonDialogOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      toast.success('Leçon supprimée avec succès !');
    }
  };

  const handleViewLesson = (lesson: any) => {
    toast.info(`Ouverture de la leçon: ${lesson.title}`);
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    setIsQuizDialogOpen(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      toast.success('Quiz supprimé avec succès !');
    }
  };

  const resetLessonForm = () => {
    setNewLesson({
      title: '',
      course: '',
      type: 'video',
      content: '',
      duration: '',
      videoUrl: '',
      audioUrl: '',
      documentUrl: '',
    });
    setEditingLesson(null);
  };

  const resetQuizForm = () => {
    setNewQuiz({
      title: '',
      course: '',
      type: 'lesson',
      lessonId: '',
      courseId: '',
      questions: [{ question: '', options: ['', '', '', ''], correct: 0, explanation: '' }],
    });
    setEditingQuiz(null);
  };

  const handleSaveLesson = () => {
    toast.success(editingLesson ? 'Leçon modifiée avec succès !' : 'Leçon créée avec succès !');
    setIsLessonDialogOpen(false);
    resetLessonForm();
  };

  const handleSaveQuiz = () => {
    toast.success(editingQuiz ? 'Quiz modifié avec succès !' : 'Quiz créé avec succès !');
    setIsQuizDialogOpen(false);
    resetQuizForm();
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
          <TabsTrigger value="quizzes">Quiz & Tests</TabsTrigger>
          <TabsTrigger value="level-test">Test de Niveau</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Liste des Leçons</h2>
              <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetLessonForm} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une leçon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLesson ? 'Modifier la leçon' : 'Créer une nouvelle leçon'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
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
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="text">Texte</SelectItem>
                            <SelectItem value="document">Document PDF</SelectItem>
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

                    {/* Upload Section based on type */}
                    {newLesson.type === 'video' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fichier vidéo
                        </label>
                        <div className="flex gap-4">
                          <Input
                            value={newLesson.videoUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="URL de la vidéo ou uploadez un fichier"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => handleFileUpload('video')}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Vidéo
                          </Button>
                        </div>
                      </div>
                    )}

                    {newLesson.type === 'audio' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fichier audio
                        </label>
                        <div className="flex gap-4">
                          <Input
                            value={newLesson.audioUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, audioUrl: e.target.value }))}
                            placeholder="URL de l'audio ou uploadez un fichier"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => handleFileUpload('audio')}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Audio
                          </Button>
                        </div>
                      </div>
                    )}

                    {newLesson.type === 'document' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Document PDF
                        </label>
                        <div className="flex gap-4">
                          <Input
                            value={newLesson.documentUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, documentUrl: e.target.value }))}
                            placeholder="URL du document ou uploadez un fichier"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => handleFileUpload('document')}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload PDF
                          </Button>
                        </div>
                      </div>
                    )}

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
                      <Button variant="outline" onClick={() => setIsLessonDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button variant="outline" onClick={handleSaveLesson}>
                        Sauvegarder en brouillon
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveLesson}>
                        Publier la leçon
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          {lesson.type === 'video' && <Play className="w-6 h-6 text-red-600" />}
                          {lesson.type === 'text' && <FileText className="w-6 h-6 text-blue-600" />}
                          {lesson.type === 'audio' && <Play className="w-6 h-6 text-green-600" />}
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewLesson(lesson)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mes Quiz</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => generateQuizAutomatically('lesson')}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Quiz Auto (Leçon)
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => generateQuizAutomatically('course')}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Quiz Auto (Cours)
                </Button>
                <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetQuizForm} className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingQuiz ? 'Modifier le quiz' : 'Créer un nouveau quiz'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
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
                            Type de quiz
                          </label>
                          <Select
                            value={newQuiz.type}
                            onValueChange={(value) => setNewQuiz(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lesson">Quiz de leçon</SelectItem>
                              <SelectItem value="course">Quiz général de cours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Questions du Quiz</h3>
                          <div className="flex gap-2">
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => generateQuizAutomatically(newQuiz.type as 'lesson' | 'course')}
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Générer automatiquement
                            </Button>
                            <Button type="button" onClick={addQuizQuestion} variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter une question
                            </Button>
                          </div>
                        </div>
                        
                        {newQuiz.questions.map((question, index) => (
                          <Card key={index} className="border-l-4 border-l-purple-600">
                            <CardContent className="p-4 space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Question {index + 1}</h4>
                                {newQuiz.questions.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeQuizQuestion(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              
                              <div>
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
                                      Option {optionIndex + 1} {optionIndex === question.correct && '✓ (Correcte)'}
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

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Explication (optionnel)
                                  </label>
                                  <Input
                                    value={question.explanation}
                                    onChange={(e) => {
                                      const newQuestions = [...newQuiz.questions];
                                      newQuestions[index].explanation = e.target.value;
                                      setNewQuiz(prev => ({ ...prev, questions: newQuestions }));
                                    }}
                                    placeholder="Expliquez la bonne réponse..."
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button variant="outline" onClick={handleSaveQuiz}>
                          Sauvegarder en brouillon
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveQuiz}>
                          Publier le quiz
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.course}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <Badge className={quiz.type === 'lesson' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                            {quiz.type === 'lesson' ? 'Quiz de leçon' : 'Quiz de cours'}
                          </Badge>
                          <span>{quiz.questions} questions</span>
                          <span>{quiz.attempts} tentatives</span>
                          <span>Score moyen: {quiz.averageScore}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditQuiz(quiz)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="level-test">
          <Card>
            <CardHeader>
              <CardTitle>Créer un Test de Niveau</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Test de Niveau Allemand</h3>
                <p className="text-sm text-blue-700">
                  Créez un test pour évaluer le niveau des nouveaux étudiants (A1 à C2).
                  Ce test aidera à orienter les étudiants vers les cours appropriés.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du test
                  </label>
                  <Input placeholder="Ex: Test de niveau allemand général" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée du test (minutes)
                  </label>
                  <Input type="number" placeholder="30" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea 
                  placeholder="Décrivez le test de niveau..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => generateQuizAutomatically('course')}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Générer automatiquement
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  Créer le test de niveau
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};