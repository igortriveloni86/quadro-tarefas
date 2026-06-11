import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Pencil, Trash2, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const priorityStyles = {
  baixa: 'bg-emerald-100 text-emerald-700',
  media: 'bg-amber-100 text-amber-700',
  alta: 'bg-red-100 text-red-700',
};

const priorityLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export default function TaskCard({ task, index, onEdit, onDelete }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group bg-card rounded-xl p-3.5 shadow-sm border border-border/60 transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/30 rotate-2 scale-105' : 'hover:shadow-md hover:border-border'
          }`}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {task.labels.map((label, i) => (
                    <span
                      key={i}
                      className="h-2 w-10 rounded-full inline-block"
                      style={{ backgroundColor: label.color }}
                      title={label.name}
                    />
                  ))}
                </div>
              )}

              <h4 className="text-sm font-medium text-foreground leading-snug">{task.title}</h4>

              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
              )}

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                {task.priority && (
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                )}
                {task.due_date && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}