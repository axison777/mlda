import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Users,
  BookOpen,
  Package,
  CreditCard,
  Settings,
  PlusCircle,
  BarChart3,
  GraduationCap,
  User,
  Calendar,
} from 'lucide-react';

const adminMenuItems = [
  { icon: Home, label: 'Accueil', href: '/admin' },
  { icon: Users, label: 'Utilisateurs', href: '/admin/users' },
  { icon: BookOpen, label: 'Cours', href: '/admin/courses' },
  { icon: Package, label: 'Produits', href: '/admin/products' },
  { icon: CreditCard, label: 'Paiements', href: '/admin/payments' },
  { icon: BarChart3, label: 'Publicités', href: '/admin/ads' },
  { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
];

const professorMenuItems = [
  { icon: Home, label: 'Accueil', href: '/professor' },
  { icon: BookOpen, label: 'Mes cours', href: '/professor/courses' },
  { icon: PlusCircle, label: 'Ajouter un cours', href: '/professor/create-course' },
  { icon: Calendar, label: 'Leçons & Quiz', href: '/professor/lessons' },
  { icon: Users, label: 'Étudiants', href: '/professor/students' },
  { icon: User, label: 'Profil', href: '/professor/profile' },
];

const studentMenuItems = [
  { icon: Home, label: 'Accueil', href: '/student' },
  { icon: BookOpen, label: 'Mes cours', href: '/student/courses' },
  { icon: GraduationCap, label: 'Continuer', href: '/student/continue' },
  { icon: CreditCard, label: 'Abonnements', href: '/student/subscriptions' },
  { icon: User, label: 'Profil', href: '/student/profile' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'professor':
        return professorMenuItems;
      case 'student':
        return studentMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-70 bg-black text-white z-40"
    >
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400">MLDA</h1>
        <p className="text-sm text-gray-400">Cours d'allemand</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors relative',
                isActive && 'text-white bg-red-600'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-0 h-full w-1 bg-yellow-400"
                />
              )}
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};