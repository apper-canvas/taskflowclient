import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

function MainFeature({ addTask, categories }) {
  const { loading } = useSelector(state => state.tasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    bookmarked: false
  });
  
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const BookmarkIcon = getIcon('Bookmark');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };
  
  const handleBookmarkToggle = () => {
    setTaskData({ ...taskData, bookmarked: !taskData.bookmarked });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;
    
    // Generate a unique ID for the new task (server will assign real ID)
    const newTask = {
      ...taskData,
      id: Date.now().toString(), // Temporary ID for the UI
      completed: false
    };
    
    addTask(newTask);
    
    // Reset form
    setTaskData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      bookmarked: false
    });
    
    setIsFormOpen(false);
  };
  
  return (
    <div className="mt-8">
      {!isFormOpen ? (
        <motion.button
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="card w-full py-4 flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer group"
        >
          <PlusIcon className="mr-2 group-hover:text-primary transition-colors" size={20} />
          <span className="group-hover:text-primary transition-colors">Add New Task</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create New Task</h3>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="text-surface-400 hover:text-accent"
            >
              <XIcon size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="label">Task Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="label">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  className="input min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="label">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={taskData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="label">Priority Level</label>
                  <select
                    id="priority"
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  className={`flex items-center mr-4 ${
                    taskData.bookmarked ? 'text-amber-500' : 'text-surface-400'
                  }`}
                >
                  <BookmarkIcon size={20} />
                  <span className="ml-1">Bookmark</span>
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!taskData.title.trim() || loading}
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

export default MainFeature;