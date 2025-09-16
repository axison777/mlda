import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Upload, Star, Users, BookOpen, Award } from 'lucide-react';

export const ProfessorProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Hans',
    lastName: 'Mueller',
    email: 'h.mueller@mlda.de',
    phone: '+33 1 23 45 67 89',
    bio: 'Professeur d\'allemand avec plus de 15 ans d\'expérience. Spécialisé dans l\'enseignement aux débutants et la préparation aux examens officiels.',
    specialties: ['Grammaire', 'Conversation', 'Préparation aux examens'],
    education: 'Doctorat en Linguistique Allemande - Université de Berlin',
    experience: '15 ans d\'enseignement',
    languages: ['Allemand (Natif)', 'Français (Courant)', 'Anglais (Courant)'],
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

  const handleSaveProfile = () => {
    console.log('Profil sauvegardé:', profileData);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Mot de passe changé');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const stats = [
    { title: 'Cours Créés', value: '12', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Étudiants Totaux', value: '847', icon: Users, color: 'text-green-600' },
    { title: 'Note Moyenne', value: '4.8', icon: Star, color: 'text-yellow-600' },
    { title: 'Certificats Délivrés', value: '234', icon: Award, color: 'text-red-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et professionnelles</p>
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
                Dr. {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">Professeur d'Allemand</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-100 text-blue-800">Professeur Certifié</Badge>
                <Badge className="bg-green-100 text-green-800">15 ans d'expérience</Badge>
              </div>
            </div>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Changer la photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="professional">Informations Professionnelles</TabsTrigger>
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
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Informations Professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="education">Formation</Label>
                <Input
                  id="education"
                  value={profileData.education}
                  onChange={(e) => handleProfileChange('education', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="experience">Expérience</Label>
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => handleProfileChange('experience', e.target.value)}
                />
              </div>

              <div>
                <Label>Spécialités</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une spécialité
                </Button>
              </div>

              <div>
                <Label>Langues parlées</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une langue
                </Button>
              </div>

              <Button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder les modifications
              </Button>
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

              <Button onClick={handleChangePassword} className="bg-red-600 hover:bg-red-700">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};