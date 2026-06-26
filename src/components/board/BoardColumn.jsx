import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const columnConfig = {
  segunda: { title: 'Segunda-feira', emoji: '📅', accent: 'bg-blue-500' },
  terca: { title: 'Terça-feira', emoji: '📅', accent: 'bg-indigo-500' },
  quarta: { title: 'Quarta-feira', emoji: '📅', accent: 'bg-violet-500' },
  quinta: { title: 'Quinta-feira', emoji: '📅', accent: 'bg-purple-500' },
  sexta: { title: 'Sexta-feira', emoji: '📅', accent: 'bg-fuchsia-500' },
  urgentes: { title: 'Urgentes', emoji: '🔴', accent: 'bg-red-500' },
  analisando: { title: 'Analisando', emoji: '🔍', accent: 'bg-amber-500' },
  concluidos: { title: 'Concluídos', emoji: '✅', accent: 'bg-emerald-500', softBg: 'bg-emerald-50/80' },
};

export default function BoardColumn({ columnId, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const config = columnConfig[columnId] || { title: columnId, emoji: '📋', accent: 'bg-gray-500' };
  const sortedTasks = [...tasks].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] max-h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.accent}`} />
          <h3 className="text-sm font-semibold text-foreground tracking-tight">{config.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(columnId)}
          className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto space-y-2.5 p-1.5 rounded-xl transition-colors min-h-[100px] ${
              snapshot.isDraggingOver
                ? 'bg-primary/5 ring-2 ring-primary/20 ring-dashed'
                : config.softBg || ''
            }`}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={() => onAddTask(columnId)}
                className="w-full py-8 border-2 border-dashed border-border/60 rounded-xl text-muted-foreground text-xs hover:border-primary/40 hover:text-primary/70 transition-all flex flex-col items-center gap-1.5"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar tarefa</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}