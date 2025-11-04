import { CheckCircle2, Circle, Clock, Trash2, Edit } from 'lucide-react';
import { Task } from '../lib/supabase';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const statusColors = {
    todo: 'bg-gray-100 border-gray-300',
    in_progress: 'bg-blue-50 border-blue-300',
    completed: 'bg-green-50 border-green-300',
  };

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const cycleStatus = () => {
    const statusOrder: Task['status'][] = ['todo', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${statusColors[task.status]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={cycleStatus}
          className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
        >
          {getStatusIcon()}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-medium uppercase ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="text-xs text-gray-500">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
