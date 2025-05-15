/**
 * Utility functions for converting tasks to/from CSV format
 */

/**
 * Convert tasks array to CSV string
 * @param {Array} tasks - Array of task objects
 * @returns {String} CSV formatted string
 */
export const tasksToCSV = (tasks) => {
  if (!tasks || !tasks.length) return '';
  
  // Define CSV headers based on task properties
  const headers = ['id', 'title', 'description', 'category', 'priority', 'completed'];
  
  // Create CSV header row
  const csvRows = [headers.join(',')];
  
  // Add each task as a row in the CSV
  for (const task of tasks) {
    const values = headers.map(header => {
      // Handle special case for description (escape commas and quotes)
      if (header === 'description' && task[header]) {
        const escaped = task[header].replace(/"/g, '""');
        return `"${escaped}"`;
      }
      return task[header] !== undefined ? task[header] : '';
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Parse CSV string to tasks array
 * @param {String} csv - CSV formatted string
 * @returns {Object} Object containing parsed tasks and any errors
 */
export const csvToTasks = (csv) => {
  if (!csv) return { tasks: [], errors: ['Empty CSV file'] };
  
  const errors = [];
  try {
    const lines = csv.split('\n');
    
    // Check if file has content
    if (lines.length < 2) {
      return { tasks: [], errors: ['CSV file must contain a header row and at least one task'] };
    }
    
    // Parse headers
    const headers = lines[0].split(',');
    const requiredHeaders = ['id', 'title', 'category', 'priority', 'completed'];
    
    // Validate required headers
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length) {
      return { tasks: [], errors: [`Missing required headers: ${missingHeaders.join(', ')}`] };
    }
    
    // Parse tasks
    const tasks = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      // Parse CSV row, handling quoted values that might contain commas
      const parsedRow = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const task = {};
      headers.forEach((header, index) => {
        task[header] = parsedRow[index] ? parsedRow[index].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
      });
      task.completed = task.completed.toString().toLowerCase() === 'true'; // Convert string to boolean
      tasks.push(task);
    }
    return { tasks, errors };
  } catch (error) {
    return { tasks: [], errors: [`Error parsing CSV: ${error.message}`] };
  }
};