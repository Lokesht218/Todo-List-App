import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { ChevronUp, Minus, ChevronDown } from "lucide-react";
import confetti from 'canvas-confetti';
import './App.css';

// ---------- MODERN SVG ICON COMPONENTS (ZERO DEPENDENCY) ----------
const Icon = ({ children, size = 18, color = "currentColor", style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    {children}
  </svg>
);

const BellIcon = (props) => <Icon {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Icon>;
const BellOffIcon = (props) => <Icon {...props}><path d="M8.46 2.73A6 6 0 0 1 18 8v5.15"/><path d="M18 18H3s3-2 3-9v-1.15"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><line x1="2" y1="2" x2="22" y2="22"/></Icon>;
const Volume2Icon = (props) => <Icon {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></Icon>;
const VolumeXIcon = (props) => <Icon {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></Icon>;
const SaveIcon = (props) => <Icon {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Icon>;
const FolderOpenIcon = (props) => <Icon {...props}><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></Icon>;
const LinkIcon = (props) => <Icon {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Icon>;
const Trash2Icon = (props) => <Icon {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></Icon>;
const SunIcon = (props) => <Icon {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></Icon>;
const MoonIcon = (props) => <Icon {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></Icon>;
const CheckCircle2Icon = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></Icon>;
const TrophyIcon = (props) => <Icon {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></Icon>;
const FlameIcon = (props) => <Icon {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></Icon>;
const ZapIcon = (props) => <Icon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const DropletsIcon = (props) => <Icon {...props}><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-6-4-6s-4 2.7-4 6c0 2.2 1.8 4 4 4Z"/><path d="M17 15.8c1.7 0 3-1.3 3-3 0-2.5-3-4.5-3-4.5s-3 2-3 4.5c0 1.7 1.3 3 3 3Z"/></Icon>;
const PinIcon = (props) => <Icon {...props}><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></Icon>;
const XIcon = (props) => <Icon {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
const PlusIcon = (props) => <Icon {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
const CalendarIcon = (props) => <Icon {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>;
const RotateCcwIcon = (props) => <Icon {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></Icon>;
const KeyboardIcon = (props) => <Icon {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></Icon>;
const GripVerticalIcon = (props) => <Icon {...props}><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></Icon>;
const PencilLineIcon = (props) => <Icon {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><path d="m15 5 3 3"/></Icon>;

const STORAGE_KEY = 'modern_todo_final';
const DAILY_GOAL_KEY = 'daily_goal';
const COMPLETION_HISTORY_KEY = 'completion_history';
const NOTIFICATION_SETTING_KEY = 'notifications_enabled';
const SPEECH_SETTING_KEY = 'speech_enabled';

// ---------- RELIABLE LOCAL DATE HELPERS ----------
const getTodayLocal = () => {
  return new Date().toLocaleDateString('en-CA');
};

const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-CA');
};

const isTodayLocal = (timestamp) => {
  return getDateFromTimestamp(timestamp) === getTodayLocal();
};

const isLast7DaysLocal = (timestamp) => {
  const entry = getDateFromTimestamp(timestamp);
  const today = getTodayLocal();
  const diffDays = Math.floor((new Date(today) - new Date(entry)) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

const App = () => {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored !== null ? JSON.parse(stored) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dailyGoal, setDailyGoal] = useState(() => {
    const stored = localStorage.getItem(DAILY_GOAL_KEY);
    let goal = stored ? parseInt(stored) : 3;
    return Math.min(20, Math.max(1, goal));
  });
  const [completionHistory, setCompletionHistory] = useState(() => {
    const stored = localStorage.getItem(COMPLETION_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [toast, setToast] = useState(null);
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    const stored = localStorage.getItem(SPEECH_SETTING_KEY);
    return stored !== 'false'; // Default to true
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const stored = localStorage.getItem(NOTIFICATION_SETTING_KEY);
    return stored === 'true';
  });
  const [analytics, setAnalytics] = useState({ weekly: 0, bestDay: '—' });

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const toastTimeoutRef = useRef(null);
  const lastAllCompletedRef = useRef(false); // prevent repeated celebration
  const notifiedTasksRef = useRef(new Set()); // Track tasks already notified in this session
  const audioContextRef = useRef(null);

  const recordUndo = useCallback(() => {
    undoStackRef.current.push([...todos]);
    redoStackRef.current = [];
  }, [todos]);

  const undo = () => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop();
    redoStackRef.current.push([...todos]);
    setTodos(previous);
  };

  const redo = () => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop();
    undoStackRef.current.push([...todos]);
    setTodos(next);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem(DAILY_GOAL_KEY, dailyGoal);
  }, [dailyGoal]);
  useEffect(() => {
    localStorage.setItem(COMPLETION_HISTORY_KEY, JSON.stringify(completionHistory));
    updateAnalytics();
  }, [completionHistory]);
  useEffect(() => {
    localStorage.setItem(NOTIFICATION_SETTING_KEY, notificationsEnabled);
  }, [notificationsEnabled]);
  useEffect(() => {
    localStorage.setItem(SPEECH_SETTING_KEY, speechEnabled);
  }, [speechEnabled]);

  const updateAnalytics = () => {
    const weeklyCompleted = completionHistory.filter(entry => isLast7DaysLocal(entry.timestamp)).length;
    const dayCounts = { Sunday:0, Monday:0, Tuesday:0, Wednesday:0, Thursday:0, Friday:0, Saturday:0 };
    completionHistory.forEach(entry => {
      const day = new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'long' });
      dayCounts[day]++;
    });
    const bestDay = Object.keys(dayCounts).reduce((a,b) => dayCounts[a] > dayCounts[b] ? a : b, '—');
    setAnalytics({ weekly: weeklyCompleted, bestDay });
  };

  const getRelativeDate = (dateStr) => {
    if (!dateStr) return null;
    const today = getTodayLocal();
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-CA');
    if (dateStr === today) return 'Today';
    if (dateStr === tomorrow) return 'Tomorrow';
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const setDueToday = () => setDueDate(getTodayLocal());
  const setDueTomorrow = () => {
    const tomorrow = new Date(Date.now() + 86400000);
    setDueDate(tomorrow.toLocaleDateString('en-CA'));
  };
  const setDueThisWeek = () => {
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    setDueDate(endOfWeek.toLocaleDateString('en-CA'));
  };

  // --- VOICE LOGIC ---
  const speak = (text) => {
    if (!speechEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // --- STRONG NOTIFICATION SOUND LOGIC ---
  const playStrongNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playTone = (freq, startTime, duration, volume) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(880, now, 0.5, 0.4);
      playTone(659.25, now + 0.15, 0.6, 0.4);
    } catch (e) {}
  };

  // --- NOTIFICATION LOGIC ---
  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported', null);
      return;
    }

    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      showToast('Notifications turned OFF', null);
    } else {
      try {
        if (Notification.permission === 'granted') {
          setNotificationsEnabled(true);
          showToast('Notifications turned ON!', null);
          playStrongNotificationSound();
          new Notification('🔔 Notifications Active', { body: 'You will receive alerts for tasks due today.' });
        } else if (Notification.permission === 'denied') {
          showToast('Notifications are BLOCKED. Check browser settings.', null);
        } else {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            showToast('Notifications enabled!', null);
            playStrongNotificationSound();
            new Notification('🔔 Notifications Active', { body: 'You will receive alerts for tasks due today.' });
          } else {
            showToast('Permission denied', null);
          }
        }
      } catch (error) {
        showToast('Error requesting permission', null);
      }
    }
  };

  useEffect(() => {
    if (!notificationsEnabled) return;
    const today = getTodayLocal();
    const dueToday = todos.filter(t => t.dueDate === today && !t.completed);
    
    dueToday.forEach(todo => {
      if (!notifiedTasksRef.current.has(todo.id)) {
        playStrongNotificationSound();
        new Notification('📅 Task due today', { body: todo.text });
        notifiedTasksRef.current.add(todo.id);
      }
    });
  }, [todos, notificationsEnabled]);

  const showToast = (message, actionType) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    const timeout = setTimeout(() => setToast(null), 5000);
    setToast({ message, actionType, timeout });
    toastTimeoutRef.current = timeout;
  };

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    recordUndo();
    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      priority,
      dueDate: dueDate || null,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setInput('');
    setDueDate('');
    setPriority('medium');
    speak(`Added: ${trimmed}`);
    showToast('Task added', 'undo');
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    if (!todo.completed) {
      const newHistory = [...completionHistory, { id, text: todo.text, timestamp: new Date().toISOString() }];
      setCompletionHistory(newHistory);
      speak(`Completed: ${todo.text}`);
      const completedTodayCount = newHistory.filter(entry => isTodayLocal(entry.timestamp)).length;
      // Speak daily goal celebration exactly when the goal is reached for the first time today
      if (completedTodayCount >= dailyGoal && completedTodayCount - 1 < dailyGoal) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast(`🎉 Daily goal of ${dailyGoal} reached!`, null);
        speak("Congratulations! You reached your daily goal!");
      }
    }
    recordUndo();
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const stats = { total: todos.length, active: todos.filter(t => !t.completed).length, completed: todos.filter(t => t.completed).length };

  // Speak all tasks completed message when the last active task gets completed
  useEffect(() => {
    if (stats.total > 0 && stats.active === 0) {
      if (!lastAllCompletedRef.current) {
        lastAllCompletedRef.current = true;
        confetti({ particleCount: 200, spread: 200, origin: { y: 0.4 }, startVelocity: 25 });
        showToast('🎉 Amazing! You completed all tasks! 🎉', null);
        speak("Amazing! You have completed all tasks!");
      }
    } else {
      if (lastAllCompletedRef.current) {
        lastAllCompletedRef.current = false;
      }
    }
  }, [stats.active, stats.total]);

  const deleteTodo = (id) => {
    recordUndo();
    const deleted = todos.find(t => t.id === id);
    setTodos(todos.filter(t => t.id !== id));
    if (editingId === id) setEditingId(null);
    speak(`Deleted: ${deleted.text}`);
    showToast('Task deleted', 'undo');
  };

  const clearCompleted = () => {
    const completed = todos.filter(t => t.completed);
    if (completed.length === 0) return;
    recordUndo();
    setTodos(todos.filter(t => !t.completed));
    showToast(`${completed.length} tasks cleared`, 'undo');
  };

  const togglePin = (id) => {
    recordUndo();
    setTodos(todos.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };
  const saveEdit = (id) => {
    if (!editText.trim()) {
      deleteTodo(id);
    } else {
      recordUndo();
      setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText.trim() } : todo));
    }
    setEditingId(null);
  };

  const handleUndoFromToast = () => {
    if (toast?.actionType === 'undo') {
      undo();
      setToast(null);
    }
  };

  const exportData = () => {
    const data = { todos, dailyGoal, completionHistory };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported', null);
  };
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setTodos(data.todos || []);
        let goal = data.dailyGoal || 3;
        goal = Math.min(20, Math.max(1, goal));
        setDailyGoal(goal);
        setCompletionHistory(data.completionHistory || []);
        showToast('Backup restored', null);
      } catch {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const generateShareLink = () => {
    const snapshot = todos.map(({ id, text, completed, priority, dueDate }) => ({ id, text, completed, priority, dueDate }));
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(snapshot))));
    const url = `${window.location.origin}${window.location.pathname}?shared=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Copied!', null);
    }).catch(() => {
      showToast('Failed to copy link', null);
    });
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    if (shared) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(shared))));
        if (Array.isArray(decoded)) {
          setTodos(prev => [...prev, ...decoded.map(t => ({ ...t, id: Date.now() + Math.random(), shared: true }))]);
          showToast('Loaded shared tasks', null);
        }
      } catch(e) {}
    }
  }, []);

  const completedToday = completionHistory.filter(entry => isTodayLocal(entry.timestamp)).length;
  const goalProgress = Math.min(completedToday / dailyGoal, 1);

  const resetCompletionHistory = () => {
    if (window.confirm('This will delete all completion history. You will lose daily goal progress and analytics. Continue?')) {
      setCompletionHistory([]);
      showToast('Completion history cleared', null);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const progress = stats.total ? (stats.completed / stats.total) * 100 : 0;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo]);

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {toast && (
        <div className="toast">
          <span>{toast.message}</span>
          {toast.actionType === 'undo' && <button onClick={handleUndoFromToast} className="undo-btn"><RotateCcwIcon size={14} /> Undo</button>}
        </div>
      )}
      <div className="todo-wrapper">
        <motion.div
          className="todo-card"
          animate={{
            rotateX: [0, 2, 0, -2, 0],
            rotateY: [0, -2, 0, 2, 0],
            y: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{ transformStyle: "preserve-3d", position: 'relative' }}
        >
          <div className="header">
            <h1><b>FOCUS</b></h1>
            <div className="header-actions">
              <button 
                onClick={handleNotificationToggle} 
                className={`icon-btn ${notificationsEnabled ? 'active-btn' : ''}`} 
                title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
                style={{ color: notificationsEnabled ? '#6366f1' : 'inherit' }}
              >
                {notificationsEnabled ? <BellIcon size={18} /> : <BellOffIcon size={18} />}
              </button>
              <button onClick={() => setSpeechEnabled(!speechEnabled)} className="icon-btn" title={speechEnabled ? 'Mute voice feedback' : 'Enable voice feedback'}>
                {speechEnabled ? <Volume2Icon size={18} /> : <VolumeXIcon size={18} />}
              </button>
              <button onClick={exportData} className="icon-btn" title="Export backup">
                <SaveIcon size={18} />
              </button>
              <label className="icon-btn" title="Import backup" style={{ cursor: 'pointer' }}>
                <FolderOpenIcon size={18} />
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
              <button onClick={generateShareLink} className="icon-btn" title="Copy shareable link">
                <LinkIcon size={18} />
              </button>
              <button onClick={resetCompletionHistory} className="icon-btn" title="Reset completion history">
                <Trash2Icon size={18} />
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle" title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </button>
            </div>
          </div>

          <div className="daily-goal">
            <div className="goal-header">
              <span className="goal-label" title="Tasks completed today out of your daily goal">
                <CalendarIcon size={14} style={{ marginRight: 6 }} /> Daily Goal: {completedToday}/{dailyGoal}
              </span>
              <input 
                type="number" 
                min="1" 
                max="30" 
                value={dailyGoal} 
                onChange={(e) => {
                  let val = parseInt(e.target.value) || 1;
                  val = Math.min(30, Math.max(1, val));
                  setDailyGoal(val);
                }} 
                className="goal-input" 
                title="Set your daily goal (1-30)" 
              />
            </div>
            <div className="goal-bar"><div className="goal-fill" style={{ width: `${goalProgress * 100}%` }}></div></div>
          </div>

          <div className="analytics">
            <span title="Tasks completed in the last 7 days">
              <CheckCircle2Icon size={14} style={{ marginRight: 6, color: '#10b981' }} /> This week: {analytics.weekly}
            </span>
            <span title="Day you usually complete the most tasks">
              <TrophyIcon size={14} style={{ marginRight: 6, color: '#f59e0b' }} /> Best day: {analytics.bestDay}
            </span>
          </div>

          <div className="progress-ring">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="4" />
              <motion.circle cx="40" cy="40" r="34" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)} initial={{ strokeDashoffset: 2 * Math.PI * 34 }} animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100) }} transition={{ duration: 0.5 }} />
              <defs><linearGradient id="gradient"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
            <span className="progress-percent" title="Overall completion percentage">{Math.round(progress)}%</span>
          </div>

          <div className="add-form">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} placeholder="Write a task..." className="task-input" />
            <div className="form-row">
              <div className="priority-wrapper">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="priority-icon-overlay">
                  {priority === 'high' && <ChevronUp size={16} strokeWidth={3} color="#ef4444" />}
                  {priority === 'medium' && <Minus size={16} strokeWidth={3} color="#f59e0b" />}
                  {priority === 'low' && <ChevronDown size={16} strokeWidth={3} color="#3b82f6" />}
                </div>
              </div>
              <div className="smart-due">
                <button onClick={setDueToday} className="due-chip" title="Due today">Today</button>
                <button onClick={setDueTomorrow} className="due-chip" title="Due tomorrow">Tomorrow</button>
                <button onClick={setDueThisWeek} className="due-chip" title="Due this week">This week</button>
              </div>
              <button onClick={addTodo} className="add-btn" title="Add task (Enter)">
                <PlusIcon size={20} />
              </button>
            </div>
            {dueDate && (
              <div className="selected-due">
                <CalendarIcon size={14} style={{ marginRight: 6 }} /> Due: {getRelativeDate(dueDate)} 
                <button onClick={() => setDueDate('')} className="remove-due"><XIcon size={12} /></button>
              </div>
            )}
          </div>

          <div className="filters">
            <button className={`filter ${filter === 'all' ? 'active-filter' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter ${filter === 'active' ? 'active-filter' : ''}`} onClick={() => setFilter('active')}>Active</button>
            <button className={`filter ${filter === 'completed' ? 'active-filter' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
            {stats.completed > 0 && <button onClick={clearCompleted} className="clear-completed" title="Clear all completed tasks">Clear</button>}
          </div>

          <Reorder.Group axis="y" values={sortedTodos} onReorder={setTodos} className="todo-list">
            <AnimatePresence mode="popLayout">
              {sortedTodos.map((todo) => (
                <Reorder.Item key={todo.id} value={todo} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 500, damping: 40 }} className="todo-item">
                  <div className="todo-left">
                    <button onClick={() => toggleTodo(todo.id)} className={`checkbox ${todo.completed ? 'checked' : ''}`} title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                      {todo.completed && <CheckCircle2Icon size={16} color="#fff" />}
                    </button>
                    {editingId === todo.id ? (
                      <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={() => saveEdit(todo.id)} onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)} className="edit-input" autoFocus />
                    ) : (
                      <span onDoubleClick={() => startEdit(todo)} className={`task-text ${todo.completed ? 'completed' : ''}`} title="Double‑click to edit">
                        {todo.text}
                      </span>
                    )}
                  </div>
                  <div className="todo-right">
                    {todo.dueDate && (
                      <span className={`due-badge ${getRelativeDate(todo.dueDate) === 'Today' ? 'due-today' : ''}`}>
                        <CalendarIcon size={10} style={{ marginRight: 4 }} /> {getRelativeDate(todo.dueDate)}
                      </span>
                    )}
                    <span className={`priority-badge priority-${todo.priority}`}>
                      {todo.priority === 'high' && <ChevronUp size={12} strokeWidth={3} />}
                      {todo.priority === 'medium' && <Minus size={12} strokeWidth={3} />}
                      {todo.priority === 'low' && <ChevronDown size={12} strokeWidth={3} />}
                    </span>
                    <button onClick={() => togglePin(todo.id)} className={`pin-btn ${todo.pinned ? 'pinned' : ''}`} title={todo.pinned ? 'Unpin task' : 'Pin task to top'}>
                      <PinIcon size={14} style={{ transform: todo.pinned ? 'rotate(0deg)' : 'rotate(-45deg)' }} />
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="delete-btn" title="Delete task">
                      <XIcon size={16} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {sortedTodos.length === 0 && <div className="empty-state">{todos.length === 0 ? '✨ Add your first task' : 'Nothing matches this filter'}</div>}
          <div className="footer-hint">
            <span title="Drag to reorder"><GripVerticalIcon size={12} style={{ marginRight: 4 }} /> Drag to reorder</span>
            <span title="Double‑click to edit"><PencilLineIcon size={12} style={{ marginRight: 4 }} /> Double‑click to edit</span>
            <span title="Undo/Redo (Ctrl+Z / Ctrl+Y)"><KeyboardIcon size={12} style={{ marginRight: 4 }} /> Ctrl+Z undo</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default App;