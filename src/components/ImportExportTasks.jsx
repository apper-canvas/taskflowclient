import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { tasksToCSV, csvToTasks } from '../utils/csvUtils';

function ImportExportTasks({ tasks, setTasks }) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);
  
  const DownloadIcon = getIcon('Download');
  const UploadIcon = getIcon('Upload');
  const FileIcon = getIcon('FileSpreadsheet');
  
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Convert tasks to CSV format
      const csv = tasksToCSV(tasks);
      
      if (!csv) {
        toast.info('No tasks to export');
        setIsExporting(false);
        return;
      }
      
      // Create blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set download attributes
      const date = new Date().toLocaleDateString().replace(/\//g, '-');
      link.setAttribute('href', url);
      link.setAttribute('download', `tasks-${date}.csv`);
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Tasks exported successfully!');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file');
      event.target.value = ''; // Clear input
      return;
    }
    
    setIsImporting(true);
    
    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { tasks: importedTasks, errors } = csvToTasks(e.target.result);
        
        if (errors.length) {
          toast.error(`Import failed: ${errors[0]}`);
          setIsImporting(false);
          return;
        }
        
        if (importedTasks.length === 0) {
          toast.info('No tasks found in the CSV file');
        } else {
          setTasks(importedTasks);
          toast.success(`Successfully imported ${importedTasks.length} tasks!`);
        }
      } catch (error) {
        toast.error(`Import failed: ${error.message}`);
      } finally {
        setIsImporting(false);
        event.target.value = ''; // Clear input
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsImporting(false);
      event.target.value = ''; // Clear input
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="card p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileIcon className="mr-2 text-primary" size={20} />
        Import/Export Tasks
      </h2>
      <div className="flex space-x-3">
        <motion.button onClick={handleImportClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isImporting} className="flex items-center justify-center px-4 py-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 rounded-lg transition-colors disabled:opacity-70">
          <UploadIcon size={16} className="mr-2" /> {isImporting ? 'Importing...' : 'Import from CSV'}
        </motion.button>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv" className="hidden" />
        
        <motion.button onClick={handleExport} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isExporting || tasks.length === 0} className="flex items-center justify-center px-4 py-2 bg-primary-light dark:bg-primary hover:bg-primary-dark dark:hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-70">
          <DownloadIcon size={16} className="mr-2" /> {isExporting ? 'Exporting...' : 'Export to CSV'}
        </motion.button>
      </div>
    </div>
  );
}

export default ImportExportTasks;