import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './AdminCategoriesPage.module.css';

interface Category {
  id: string;
  name: string;
  description?: string;
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) throw fetchError;
        setCategories(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    try {
      const { data, error: insertError } = await supabase
        .from('categories')
        .insert({ name: newCategoryName.trim() })
        .select()
        .single();

      if (insertError) throw insertError;
      setCategories([...categories, data]);
      setNewCategoryName('');
    } catch (err: any) {
      alert(err.message || 'Failed to add category');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Categories</h1>
        {error && <div className={styles.error}>{error}</div>}
        <Card className={styles.addCard}>
          <h2 className={styles.addTitle}>Add New Category</h2>
          <div className={styles.addForm}>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              data-testid="category-name-input"
            />
            <Button
              onClick={handleAddCategory}
              isLoading={isAdding}
              data-testid="add-category-button"
            >
              Add Category
            </Button>
          </div>
        </Card>
        <div className={styles.categories}>
          {categories.map((category) => (
            <Card key={category.id} className={styles.categoryCard}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              {category.description && (
                <p className={styles.categoryDescription}>{category.description}</p>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCategory(category.id)}
                data-testid={`delete-category-${category.id}`}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      </FadeIn>
    </div>
  );
};

export default AdminCategoriesPage;

