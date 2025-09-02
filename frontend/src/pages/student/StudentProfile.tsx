import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Save, Upload, Award, Target, Calendar, TrendingUp } from 'lucide-react';

export const StudentProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Étudiante en commerce international, j\'apprends l\'allemand pour mon futur stage à Berlin.',
    goals: 'Atteindre le niveau B2 d\'ici 6 mois',
    interests: ['Business', 'Culture allemande', 'Voyages'],
    nativeLanguage: 'Français',
    currentLevel: 'A2',
    targetLevel: 'B2',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const achievements = [
    { title: 'Premier cours terminé', date: '2024-01-10', icon: Award },
    { title: '7 jours consécutifs', date: '2024-01-15', icon: Calendar },
    { title: 'Score parfait au quiz', date: '2024-01-18', icon: Target },
    { title: '50 leçons complétées', date: '2024-01-20', icon: TrendingUp },
  ];

  const learningStats = [
    { label: 'Niveau actuel', value: 'A2', progress: 40 },
    { label: 'Objectif', value: 'B2', progress: 100 },
    { label: 'Temps d\'étude total', value: '47h', progress: 60 },
    { label: 'Série actuelle', value: '12 jours', progress: 80 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations et suivez vos progrès</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">Étudiant MLDA</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-100 text-blue-800">Niveau {profileData.currentLevel}</Badge>
                <Badge className="bg-green-100 text-green-800">Membre depuis Jan 2024</Badge>
              </div>
            </div>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Changer la photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progression d'Apprentissage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningStats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-3">{stat.value}</p>
                <Progress value={stat.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="learning">Apprentissage</TabsTrigger>
          <TabsTrigger value="achievements">Réussites</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">À propos de moi</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                />
              </div>

              <Button className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs d'Apprentissage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="goals">Mes objectifs</Label>
                <Textarea
                  id="goals"
                  value={profileData.goals}
                  onChange={(e) => handleProfileChange('goals', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currentLevel">Niveau actuel</Label>
                  <Input
                    id="currentLevel"
                    value={profileData.currentLevel}
                    onChange={(e) => handleProfileChange('currentLevel', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="targetLevel">Niveau cible</Label>
                  <Input
                    id="targetLevel"
                    value={profileData.targetLevel}
                    onChange={(e) => handleProfileChange('targetLevel', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Centres d'intérêt</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                      <X className="w-3 h-3 ml-1 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Ajouter un centre d'intérêt
                </Button>
              </div>

              <Button className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder les objectifs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Mes Réussites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">
                        Obtenu le {new Date(achievement.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Changer le Mot de Passe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                />
              </div>

              <Button className="bg-red-600 hover:bg-red-700">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};