import { useState } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { tasksToCSV, csvToTasks } from '../utils/csvUtils';

function ImportExportTasks({ tasks, setTasks }) {
  const [isImporting, setIsImporting] = useState(false);
  
  const FileUpIcon = getIcon('FileUp');
  const FileDownIcon = getIcon('FileDown');
  
  const handleExportCSV = () => {
    try {
      const csvData = tasksToCSV(tasks);
      
      // Create a blob and download it
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Tasks exported successfully!');
    } catch (error) {
      toast.error('Failed to export tasks: ' + error.message);
    }
  };
  
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { tasks: importedTasks, errors } = csvToTasks(e.target.result);
        
        if (errors && errors.length > 0) {
          toast.error(`Import had errors: ${errors.join(', ')}`);
        } else if (importedTasks.length === 0) {
          toast.warning('No tasks were found in the CSV file');
        } else {
          setTasks([...tasks, ...importedTasks]);
          toast.success(`Imported ${importedTasks.length} tasks successfully!`);
        }
      } catch (error) {
        toast.error('Failed to import CSV: ' + error.message);
      } finally {
        setIsImporting(false);
        // Reset the file input
        event.target.value = null;
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the file');
      setIsImporting(false);
      event.target.value = null;
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button onClick={handleExportCSV} className="btn btn-outline flex items-center">
        <FileDownIcon size={16} className="mr-1" />
        Export Tasks
      </button>
      <div className="relative">
        <input
          type="file"
          id="csv-import"
          accept=".csv"
          onChange={handleImportCSV}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isImporting}
        />
        <label htmlFor="csv-import" className="btn btn-outline flex items-center cursor-pointer">
          <FileUpIcon size={16} className="mr-1" />
          {isImporting ? 'Importing...' : 'Import CSV'}
        </label>
      </div>
    </div>
  );
}

export default ImportExportTasks;