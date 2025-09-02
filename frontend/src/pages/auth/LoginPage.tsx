import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de connexion - à remplacer par vraie API
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'student' as const, // Par défaut étudiant
      };

      // Logique simple pour déterminer le rôle basé sur l'email
      if (email.includes('admin')) {
        mockUser.role = 'admin';
      } else if (email.includes('prof') || email.includes('teacher')) {
        mockUser.role = 'professor';
      }

      login(mockUser);
      
      // Redirection basée sur le rôle
      switch (mockUser.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'professor':
          navigate('/professor');
          break;
        default:
          navigate('/student');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold">
              <span className="text-red-600">M</span>
              <span className="text-yellow-500">L</span>
              <span className="text-red-600">D</span>
              <span className="text-yellow-500">A</span>
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/signup" className="text-red-600 hover:text-red-700 font-medium">
                  S'inscrire
                </Link>
              </p>
            </div>

            {/* Demo accounts info */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2 font-medium">Comptes de démonstration:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• admin@mlda.de (Admin)</p>
                <p>• prof@mlda.de (Professeur)</p>
                <p>• student@mlda.de (Étudiant)</p>
                <p className="mt-2 italic">Mot de passe: n'importe lequel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-700">
            ← Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
};