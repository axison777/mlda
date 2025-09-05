import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    category: filterCategory !== 'all' ? filterCategory : undefined,
    active: true,
  });

  const products = productsData?.products || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  const calculateFinalPrice = (product: any) => {
    if (!product.discount || !product.discountType) return product.price;
    
    if (product.discountType === 'percentage') {
      return product.price * (1 - product.discount / 100);
    } else {
      return Math.max(0, product.price - product.discount);
    }
  };

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
              <span className="ml-2 text-gray-600">Boutique</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Accueil</Link>
              <Link to="/shop" className="text-red-600 font-medium">Boutique</Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Boutique MLDA</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos produits pour enrichir votre apprentissage de l'allemand
          </p>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Catégorie: {filterCategory === 'all' ? 'Toutes' : filterCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                    Toutes les catégories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Livres')}>
                    Livres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Matériel')}>
                    Matériel pédagogique
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Accessoires')}>
                    Accessoires
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any, index: number) => {
            const finalPrice = calculateFinalPrice(product);
            const hasDiscount = product.discount && product.discountType;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-600 text-white">
                          -{product.discountType === 'percentage' ? `${product.discount}%` : `€${product.discount}`}
                        </Badge>
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-gray-800 text-white">Rupture de stock</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    )}
                    
                    {product.category && (
                      <Badge variant="outline" className="mb-3">
                        {product.category}
                      </Badge>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-2xl font-bold text-red-600">{(finalPrice * 655).toLocaleString()} FCFA</span>
                            <span className="text-lg text-gray-500 line-through">{(product.price * 655).toLocaleString()} FCFA</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">{(product.price * 655).toLocaleString()} FCFA</span>
                        )}
                      </div>
                      <Button 
                        className="bg-red-600 hover:bg-red-700"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Acheter
                      </Button>
                    </div>

                    {product.stock > 0 && product.stock <= 5 && (
                      <p className="text-sm text-orange-600 mt-2">
                        Plus que {product.stock} en stock !
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};