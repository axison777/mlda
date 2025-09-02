import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  X, 
  Crown,
  Zap,
  Star
} from 'lucide-react';

const currentSubscription = {
  plan: 'Professionnel',
  price: 59,
  period: 'mois',
  status: 'active',
  nextBilling: '2024-02-20',
  features: [
    'Accès à tous les cours',
    'Sessions 1-on-1 avec professeurs',
    'Certificats officiels',
    'Support prioritaire',
    'Contenu business exclusif',
  ],
};

const availablePlans = [
  {
    name: 'Étudiant',
    price: 29,
    period: 'mois',
    description: 'Parfait pour commencer',
    features: [
      'Accès aux cours de base',
      'Support par email',
      'Certificat de fin de cours',
      'Communauté d\'étudiants',
    ],
    popular: false,
    current: false,
  },
  {
    name: 'Professionnel',
    price: 59,
    period: 'mois',
    description: 'Le plus populaire',
    features: [
      'Tous les cours disponibles',
      'Sessions 1-on-1',
      'Certificats officiels',
      'Support prioritaire',
      'Contenu business',
    ],
    popular: true,
    current: true,
  },
  {
    name: 'Entreprise',
    price: 199,
    period: 'mois',
    description: 'Pour les équipes',
    features: [
      'Tout du plan Pro',
      'Comptes illimités',
      'Rapports détaillés',
      'Manager dédié',
      'Formation sur mesure',
    ],
    popular: false,
    current: false,
  },
];

const billingHistory = [
  {
    id: 'INV-001',
    date: '2024-01-20',
    amount: 59,
    plan: 'Professionnel',
    status: 'paid',
    method: 'Carte **** 4242',
  },
  {
    id: 'INV-002',
    date: '2023-12-20',
    amount: 59,
    plan: 'Professionnel',
    status: 'paid',
    method: 'Carte **** 4242',
  },
  {
    id: 'INV-003',
    date: '2023-11-20',
    amount: 29,
    plan: 'Étudiant',
    status: 'paid',
    method: 'PayPal',
  },
];

export const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState('Professionnel');

  const getStatusBadge = (status: string) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Abonnements</h1>
        <p className="text-gray-600">Gérez votre abonnement et votre facturation</p>
      </div>

      {/* Current Subscription */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-red-600" />
            Abonnement Actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{currentSubscription.plan}</h3>
              <p className="text-gray-600">€{currentSubscription.price}/{currentSubscription.period}</p>
              <p className="text-sm text-gray-600 mt-2">
                Prochaine facturation: {new Date(currentSubscription.nextBilling).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-green-100 text-green-800 mb-2">
                {currentSubscription.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Modifier</Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  Annuler
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Fonctionnalités incluses:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentSubscription.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Changer d'Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative cursor-pointer transition-all ${
                  plan.current ? 'border-red-600 bg-red-50' : 
                  selectedPlan === plan.name ? 'border-red-400' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-600 text-white">Actuel</Badge>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">€{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {plan.current ? (
                      <Button disabled className="w-full">
                        Plan Actuel
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {plan.price > currentSubscription.price ? 'Mettre à niveau' : 'Rétrograder'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Historique de Facturation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.plan}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(invoice.date).toLocaleDateString('fr-FR')} • {invoice.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">€{invoice.amount}</p>
                  <Badge className={getStatusBadge(invoice.status)}>
                    {invoice.status === 'paid' ? 'Payé' : 'Échoué'}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Méthode de Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Carte se terminant par 4242</p>
                <p className="text-sm text-gray-600">Expire en 12/2027</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Modifier</Button>
              <Button variant="outline" size="sm" className="text-red-600">
                Supprimer
              </Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une méthode de paiement
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};