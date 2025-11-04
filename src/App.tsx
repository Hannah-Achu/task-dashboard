import { useState, useEffect } from 'react';
import { supabase, Task } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { ProgressStats } from './components/ProgressStats';
import { Plus, LogOut, ListTodo } from 'lucide-react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      await fetchTasks();
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          ...taskData,
          user_id: user.id,
          status: 'todo',
        },
      ]);

    if (error) {
      console.error('Error creating task:', error);
    } else {
      fetchTasks();
      setShowForm(false);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    const { error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', editingTask.id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      fetchTasks();
      setShowForm(false);
      setEditingTask(null);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
    } else {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      fetchTasks();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTasks([]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={checkUser} />;
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <ProgressStats tasks={tasks} />

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(['all', 'todo', 'in_progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Create your first task to get started' : `No ${filter.replace('_', ' ')} tasks`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}

        {showForm && (
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={handleCloseForm}
            editTask={editingTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
