import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateRecipe, useEditRecipe, useDeleteRecipe, useRecipes } from '../api/recipes';
import Modal from '../components/common/Modal';
import RecipeForm from '../components/recipes/RecipeForm';
import EffortChip from '../components/common/EffortChip';
import type { Recipe as ApiRecipe } from '../api/recipes';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

type Recipe = ApiRecipe;

function RecipesPage() {
  const { data: recipes, isLoading, isError, refetch } = useRecipes();
  const createRecipe = useCreateRecipe();
  const editRecipe = useEditRecipe();
  const deleteRecipe = useDeleteRecipe();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipeId, setDeletingRecipeId] = useState<number | null>(null);

  const handleSubmitRecipe = (data: Parameters<typeof createRecipe.mutate>[0]) => {
    if (editingRecipe) {
      // Update existing recipe
      editRecipe.mutate(
        { ...data, id: editingRecipe.id },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingRecipe(null);
          },
        }
      );
    } else {
      // Create new recipe
      createRecipe.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingRecipe(null);
        },
      });
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingRecipeId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingRecipeId) {
      deleteRecipe.mutate(deletingRecipeId, {
        onSettled: () => {
          setDeletingRecipeId(null);
          void refetch();
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeletingRecipeId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecipe(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipe Collection</h1>
          <p className="mt-2 text-gray-600">
            Your personal Lazy Girl recipe stash. Add, view, and manage your
            favorite quick recipes all in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRecipe(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors self-start md:self-center"
        >
          <Plus size={18} />
          Add Recipe
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-500">Loading recipes...</div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="text-red-700">
              Could not load recipes. Please try again later.
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-12">
          {recipes && recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {recipe.name}
                      </h3>
                      <EffortChip level={recipe.effortLevel} />
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                          <span 
                            key={idx}
                            className="inline-block bg-gray-50 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {recipe.ingredients.length > 5 && (
                          <span className="inline-block bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full">
                            +{recipe.ingredients.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button 
                      className="text-sm font-medium text-orange-600 hover:text-orange-700"
                      onClick={() => handleEditRecipe(recipe)}
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(recipe.id);
                      }}
                      className="text-gray-400 text-red-600 transition-colors"
                      title="Delete recipe"
                      disabled={deleteRecipe.isPending}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-gray-400 mb-3">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No recipes yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first recipe.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Plus size={16} className="mr-2" />
                Add Recipe
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recipe Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
        size="lg"
      >
        <RecipeForm
          initialData={editingRecipe || undefined}
          onSubmit={handleSubmitRecipe}
          isSubmitting={createRecipe.isPending || editRecipe.isPending}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingRecipeId}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isConfirming={deleteRecipe.isPending}
      />
    </div>
  );
}

export default RecipesPage;
