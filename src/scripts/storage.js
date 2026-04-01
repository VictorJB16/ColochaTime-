/**
 * ColochaTime - Storage Manager
 * Persistencia permanente con localStorage
 */

const STORAGE_KEY = 'colochatime_data';

// Estructura de datos inicial
const defaultData = {
  tasks: [],
  pet: {
    name: '',
    weight: null,
    dailyCalorieGoal: 400,
    weightHistory: []
  },
  petMeals: [],
  settings: {
    darkMode: false
  },
  meta: {
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
};

/**
 * Obtiene todos los datos del storage
 */
export function getData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveData(defaultData);
      return { ...defaultData };
    }
    
    const parsed = JSON.parse(stored);
    
    return {
      ...defaultData,
      ...parsed,
      settings: { ...defaultData.settings, ...parsed.settings },
      meta: { ...defaultData.meta, ...parsed.meta },
      pet: { ...defaultData.pet, ...parsed.pet }
    };
  } catch (error) {
    console.error('Error reading data:', error);
    return { ...defaultData };
  }
}

/**
 * Guarda todos los datos en el storage
 */
export function saveData(data) {
  try {
    const toSave = {
      ...data,
      meta: {
        ...data.meta,
        lastUpdated: new Date().toISOString()
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

// =====================
// CONFIGURACIÓN
// =====================

export function updateSettings(updates) {
  const data = getData();
  data.settings = { ...data.settings, ...updates };
  saveData(data);
  return data.settings;
}

export function updatePet(updates) {
  const data = getData();
  data.pet = { ...data.pet, ...updates };
  saveData(data);
  return data.pet;
}

// =====================
// TAREAS
// =====================

export function addTask(text, time = null) {
  const data = getData();
  const newTask = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    time
  };
  data.tasks.push(newTask);
  saveData(data);
  return newTask;
}

export function toggleTask(taskId) {
  const data = getData();
  const task = data.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    saveData(data);
    return task;
  }
  return null;
}

export function updateTask(taskId, updates) {
  const data = getData();
  const task = data.tasks.find(t => t.id === taskId);
  if (task) {
    Object.assign(task, updates);
    saveData(data);
    return task;
  }
  return null;
}

export function deleteTask(taskId) {
  const data = getData();
  data.tasks = data.tasks.filter(t => t.id !== taskId);
  saveData(data);
  return true;
}

export function deleteAllTasks() {
  const data = getData();
  data.tasks = [];
  saveData(data);
  return true;
}

// =====================
// MASCOTA / PERSONA
// =====================

export function addPetWeight(weight, date = null) {
  const data = getData();
  const entry = {
    weight: parseFloat(weight),
    date: date || new Date().toISOString()
  };
  data.pet.weightHistory.push(entry);
  data.pet.weight = parseFloat(weight);
  saveData(data);
  return entry;
}

export function deleteWeightEntry(dateStr) {
  const data = getData();
  data.pet.weightHistory = data.pet.weightHistory.filter(w => w.date !== dateStr);
  // Actualizar peso actual al último registro
  if (data.pet.weightHistory.length > 0) {
    const last = data.pet.weightHistory[data.pet.weightHistory.length - 1];
    data.pet.weight = last.weight;
  } else {
    data.pet.weight = null;
  }
  saveData(data);
  return true;
}

export function addPetMeal(food, calories, time = null) {
  const data = getData();
  const meal = {
    id: crypto.randomUUID(),
    food,
    calories: parseInt(calories) || 0,
    time: time || new Date().toTimeString().slice(0, 5),
    createdAt: new Date().toISOString()
  };
  data.petMeals.push(meal);
  saveData(data);
  return meal;
}

export function updatePetMeal(mealId, updates) {
  const data = getData();
  const meal = data.petMeals.find(m => m.id === mealId);
  if (meal) {
    Object.assign(meal, updates);
    saveData(data);
    return meal;
  }
  return null;
}

export function deletePetMeal(mealId) {
  const data = getData();
  data.petMeals = data.petMeals.filter(m => m.id !== mealId);
  saveData(data);
  return true;
}

export function deleteAllPetMeals() {
  const data = getData();
  data.petMeals = [];
  saveData(data);
  return true;
}

export function getPetStats() {
  const data = getData();
  const today = new Date().toDateString();
  
  const todayMeals = data.petMeals.filter(m => 
    new Date(m.createdAt).toDateString() === today
  );
  
  const todayCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const calorieGoal = data.pet.dailyCalorieGoal || 400;
  const calorieProgress = Math.min(Math.round((todayCalories / calorieGoal) * 100), 100);
  
  return {
    name: data.pet.name || '',
    weight: data.pet.weight,
    dailyCalorieGoal: calorieGoal,
    todayCalories,
    calorieProgress,
    mealsToday: todayMeals.length,
    weightHistory: data.pet.weightHistory || []
  };
}

// =====================
// ESTADÍSTICAS
// =====================

export function getStats() {
  const data = getData();
  const today = new Date().toDateString();
  
  const todayTasks = data.tasks.filter(t => 
    new Date(t.createdAt).toDateString() === today
  );
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  
  const todayMeals = data.petMeals.filter(m => 
    new Date(m.createdAt).toDateString() === today
  );
  
  return {
    completedTasks: todayCompleted,
    pendingTasks: todayTasks.length - todayCompleted,
    progressPercent: todayTasks.length > 0 
      ? Math.round((todayCompleted / todayTasks.length) * 100) 
      : 0,
    mealsToday: todayMeals.length,
    todayCalories: todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0)
  };
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  return true;
}
