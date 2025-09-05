import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Package, Edit, Trash2, Upload } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';

export const ProductsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    discountType: 'percentage',
    images: [''],
    category: '',
    stock: '',
  });

  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    active: undefined, // Show all products for admin
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = productsData?.products || [];

  const handleFormChange = (field: string, value: string) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(productForm.price) || 0;
    const discount = parseFloat(productForm.discount) || 0;
    
    if (!discount) return price;
    
    if (productForm.discountType === 'percentage') {
      return price * (1 - discount / 100);
    } else {
      return Math.max(0, price - discount);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      discount: '',
      discountType: 'percentage',
      images: [''],
      category: '',
      stock: '',
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      discount: productForm.discount ? parseFloat(productForm.discount) : null,
      discountType: productForm.discount ? productForm.discountType : null,
      images: productForm.images.filter(img => img.trim() !== ''),
      stock: parseInt(productForm.stock) || 0,
    };

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({ id: editingProduct.id, updates: productData });
      } else {
        await createProductMutation.mutateAsync(productData);
      }
      
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handled by hooks
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discount: product.discount?.toString() || '',
      discountType: product.discountType || 'percentage',
      images: product.images.length > 0 ? product.images : [''],
      category: product.category || '',
      stock: product.stock.toString(),
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProductMutation.mutateAsync(id);
    }
  };

  const finalPrice = calculateFinalPrice();
  const hasDiscount = parseFloat(productForm.discount) > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez les produits de votre boutique en ligne</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Modifier le produit' : 'Créer un nouveau produit'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Ex: Manuel d'allemand A1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={productForm.category} onValueChange={(value) => handleFormChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Livres">Livres</SelectItem>
                      <SelectItem value="Matériel">Matériel pédagogique</SelectItem>
                      <SelectItem value="Accessoires">Accessoires</SelectItem>
                      <SelectItem value="Numérique">Produits numériques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Décrivez votre produit..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    placeholder="15000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Réduction</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={productForm.discount}
                    onChange={(e) => handleFormChange('discount', e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">Type de réduction</Label>
                  <Select value={productForm.discountType} onValueChange={(value) => handleFormChange('discountType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Preview */}
              {productForm.price && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Aperçu du prix :</h4>
                  <div className="flex items-center gap-3">
                    {hasDiscount ? (
                      <>
                        <span className="text-2xl font-bold text-red-600">{finalPrice.toLocaleString()} FCFA</span>
                        <span className="text-lg text-gray-500 line-through">{parseFloat(productForm.price).toLocaleString()} FCFA</span>
                        <Badge className="bg-green-100 text-green-800">
                          Économie: {(parseFloat(productForm.price) - finalPrice).toLocaleString()} FCFA
                        </Badge>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">{parseFloat(productForm.price).toLocaleString()} FCFA</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => handleFormChange('stock', e.target.value)}
                  placeholder="100"
                />
              </div>

              <div>
                <Label>Images du produit</Label>
                <div className="space-y-3 mt-2">
                  {productForm.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="URL de l'image"
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                      {productForm.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImageField(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addImageField} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une image
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
                >
                  {editingProduct ? 'Modifier' : 'Créer'} le produit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Produits</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produits Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter((p: any) => p.isActive).length}
                </p>
              </div>
              <Package className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Promotion</p>
                <p className="text-3xl font-bold text-red-600">
                  {products.filter((p: any) => p.discount).length}
                </p>
              </div>
              <Package className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rupture Stock</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {products.filter((p: any) => p.stock === 0).length}
                </p>
              </div>
              <Package className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => {
                  const finalPrice = product.finalPrice || product.price;
                  const hasDiscount = product.hasDiscount;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images[0] || 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.description && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category && (
                          <Badge variant="outline">{product.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasDiscount ? (
                            <>
                              <span className="font-bold text-red-600">{finalPrice.toLocaleString()} FCFA</span>
                              <span className="text-sm text-gray-500 line-through">{product.price.toLocaleString()} FCFA</span>
                            </>
                          ) : (
                            <span className="font-medium">{product.price.toLocaleString()} FCFA</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? 'text-red-600 font-medium' : ''}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {product.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};