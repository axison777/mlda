import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Star, Users, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroImages = [
  {
    url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
    alt: 'Étudiants africains apprenant l\'allemand',
  },
  {
    url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    alt: 'Classe d\'allemand en Afrique',
  },
  {
    url: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg',
    alt: 'Étudiante africaine avec des livres allemands',
  },
  {
    url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    alt: 'Groupe d\'étude allemand en Afrique',
  },
];

const features = [
  {
    icon: BookOpen,
    title: 'Cours Interactifs',
    description: 'Apprenez avec des vidéos, exercices et quiz interactifs',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
  },
  {
    icon: Users,
    title: 'Professeurs Experts',
    description: 'Des enseignants natifs et certifiés pour vous accompagner',
    image: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg',
  },
  {
    icon: Award,
    title: 'Certification',
    description: 'Obtenez des certificats reconnus pour vos compétences',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
  },
];

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'Étudiante en commerce',
    content: 'MLDA m\'a permis d\'apprendre l\'allemand rapidement pour mon stage à Berlin !',
    rating: 5,
  },
  {
    name: 'Pierre Martin',
    role: 'Ingénieur',
    content: 'Les cours sont parfaitement adaptés aux professionnels. Je recommande !',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Étudiant',
    price: '29',
    period: '/mois',
    features: ['Accès à tous les cours', 'Support par email', 'Certificat de fin'],
    popular: false,
  },
  {
    name: 'Professionnel',
    price: '59',
    period: '/mois',
    features: ['Tout du plan Étudiant', 'Cours business', 'Sessions 1-on-1', 'Support prioritaire'],
    popular: true,
  },
  {
    name: 'Entreprise',
    price: '199',
    period: '/mois',
    features: ['Tout du plan Pro', 'Comptes illimités', 'Rapports détaillés', 'Manager dédié'],
    popular: false,
  },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">
                <span className="text-red-600">M</span>
                <span className="text-yellow-500">L</span>
                <span className="text-red-600">D</span>
                <span className="text-yellow-500">A</span>
              </h1>
              <span className="ml-2 text-gray-600">Cours d'allemand</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Fonctionnalités</a>
              <Link to="/shop" className="text-gray-600 hover:text-gray-900">Boutique</Link>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Témoignages</a>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-red-600 hover:bg-red-700">S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Maîtrisez l'<span className="text-red-600">Allemand</span>
                <br />
                avec <span className="text-yellow-600">MLDA</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Apprenez l'allemand avec des professeurs experts, des cours interactifs
                et une méthode éprouvée adaptée aux étudiants africains. Plus de 10,000 étudiants nous font confiance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Voir les cours
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-lg mx-auto"
              >
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-sm font-medium">{image.alt}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir MLDA ?
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour apprendre l'allemand efficacement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-8 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <CardContent>
                    <div className="relative mb-6">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                      <feature.icon className="absolute bottom-4 left-4 w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-gray-600">
              Des tarifs adaptés à tous les profils d'apprenants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`relative ${plan.popular ? 'border-red-600 border-2' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Populaire
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold">€{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      Choisir ce plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos étudiants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 text-lg italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">MLDA</h3>
              <p className="text-gray-400">
                La meilleure plateforme pour apprendre l'allemand en ligne.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Cours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Débutant</li>
                <li>Intermédiaire</li>
                <li>Avancé</li>
                <li>Business</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centre d'aide</li>
                <li>Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>CGU</li>
                <li>Confidentialité</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MLDA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};