import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    detail: 'contact@mlda.de',
    description: 'Nous répondons sous 24h',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    detail: '+33 1 23 45 67 89',
    description: 'Lundi au Vendredi 9h-18h',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    detail: '123 Rue de Berlin, 75001 Paris',
    description: 'Siège social',
  },
  {
    icon: Clock,
    title: 'Horaires',
    detail: '9h - 18h',
    description: 'Du lundi au vendredi',
  },
];

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-black">
                <span className="text-red-600">M</span>
                <span className="text-yellow-500">L</span>
                <span className="text-red-600">D</span>
                <span className="text-yellow-500">A</span>
              </h1>
              <span className="ml-2 text-gray-600">Cours d'allemand</span>
            </Link>
            <Link to="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question ? Un projet ? Nous sommes là pour vous accompagner dans votre apprentissage de l'allemand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <Input placeholder="Votre prénom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <Input placeholder="Votre nom" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input type="email" placeholder="votre@email.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <Input placeholder="06 12 34 56 78" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet
                    </label>
                    <Input placeholder="Sujet de votre message" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      rows={6}
                      placeholder="Décrivez votre demande..."
                      className="resize-none"
                    />
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <info.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        <p className="text-gray-900 font-medium">{info.detail}</p>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Comment puis-je commencer ?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Inscrivez-vous gratuitement et accédez immédiatement à nos cours d'introduction.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Quel est votre niveau d'enseignement ?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Nous proposons tous les niveaux, du débutant complet au niveau C2.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Proposez-vous des certificats ?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Oui, nous délivrons des certificats de réussite reconnus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};