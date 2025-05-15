import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature({ addTask, categories }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    bookmarked: false
  });
  const [errors, setErrors] = useState({});
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const AlertCircleIcon = getIcon('AlertCircle');
  const FolderIcon = getIcon('Folder');
  const ClipboardIcon = getIcon('Clipboard');
  const CheckIcon = getIcon('Check');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 50) {
      newErrors.title = "Title must be less than 50 characters";
    }
    
    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      completed: false,
      bookmarked: false,
      createdAt: new Date().toISOString()
    };
    
    addTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      bookmarked: false
    });
    
    // Close form after submission
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="card overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <ClipboardIcon className="mr-2 text-primary" size={20} />
            Task Management
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`btn ${isFormOpen ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
          >
            {isFormOpen ? (
              <>
                <XIcon size={18} />
                <span className="hidden sm:inline">Cancel</span>
              </>
            ) : (
              <>
                <PlusIcon size={18} />
                <span className="hidden sm:inline">Add Task</span>
              </>
            )}
          </motion.button>
        </div>
        
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="label flex items-center">
                      Task Title <span className="text-accent ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="What needs to be done?"
                        className={`input pl-10 ${errors.title ? 'border-accent focus:ring-accent' : ''}`}
                      />
                      <TagIcon className="absolute left-3 top-2.5 text-surface-400" size={18} />
                    </div>
                    {errors.title && (
                      <p className="mt-1 text-sm text-accent flex items-center">
                        <AlertCircleIcon size={14} className="mr-1" /> {errors.title}
                      </p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add more details about this task..."
                      rows="3"
                      className={`input ${errors.description ? 'border-accent focus:ring-accent' : ''}`}
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-accent flex items-center">
                        <AlertCircleIcon size={14} className="mr-1" /> {errors.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-surface-500 text-right">
                      {formData.description.length}/200 characters
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="label flex items-center">
                      Category <span className="text-accent ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`input pl-10 appearance-none ${errors.category ? 'border-accent focus:ring-accent' : ''}`}
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <FolderIcon className="absolute left-3 top-2.5 text-surface-400" size={18} />
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-sm text-accent flex items-center">
                        <AlertCircleIcon size={14} className="mr-1" /> {errors.category}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="label">Priority Level</label>
                    <div className="relative">
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input pl-10 appearance-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <CalendarIcon className="absolute left-3 top-2.5 text-surface-400" size={18} />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <CheckIcon size={18} />
                    Create Task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isFormOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Low Priority</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Tasks that are not urgent but still need to be done
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Medium Priority</h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Tasks that should be completed soon
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
              <h3 className="font-medium text-red-700 dark:text-red-300 mb-1">High Priority</h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Urgent tasks that need immediate attention
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 border border-surface-200 dark:border-surface-700">
        <h3 className="font-medium mb-2 text-primary dark:text-primary-light">Pro Tips</h3>
        <ul className="text-sm space-y-2 text-surface-700 dark:text-surface-300">
          <li className="flex items-start">
            <CheckIcon className="text-secondary mt-0.5 mr-2 flex-shrink-0" size={16} />
            <span>Break down large tasks into smaller, manageable subtasks</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="text-secondary mt-0.5 mr-2 flex-shrink-0" size={16} />
            <span>Set realistic due dates and prioritize your most important tasks</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="text-secondary mt-0.5 mr-2 flex-shrink-0" size={16} />
            <span>Review your task list regularly and adjust priorities as needed</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainFeature;