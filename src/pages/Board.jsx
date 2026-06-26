import React, { useState } from 'react';
import db from '@/lib/dbClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BoardColumn from '@/components/board/BoardColumn';
import TaskDialog from '@/components/board/TaskDialog';

const COLUMNS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'urgentes', 'analisando', 'concluidos'];

export default function Board() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumn, setDefaultColumn] = useState('segunda');
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => db.Task.list(),
  });

  const createTask = useMutation({
    mutationFn: (data) => db.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDialogOpen(false);
      setEditingTask(null);
      toast({ title: 'Tarefa criada', description: 'A tarefa foi salva com sucesso.' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar tarefa', description: error?.message || 'Não foi possível salvar a tarefa.' });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => db.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDialogOpen(false);
      setEditingTask(null);
      toast({ title: 'Tarefa atualizada', description: 'As alterações foram salvas com sucesso.' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar tarefa', description: error?.message || 'Não foi possível salvar as alterações.' });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id) => db.Task.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const getColumnTasks = (columnId) => tasks.filter((t) => t.column_name === columnId);

  const handleAddTask = (columnId) => {
    setEditingTask(null);
    setDefaultColumn(columnId);
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDefaultColumn(task.column_name);
    setDialogOpen(true);
  };

  const handleSaveTask = (formData) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data: formData });
    } else {
      const columnTasks = getColumnTasks(formData.column_name);
      createTask.mutate({ ...formData, position: columnTasks.length });
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskId = draggableId;
    const newColumn = destination.droppableId;
    const newIndex = destination.index;

    // Optimistic update
    queryClient.setQueryData(['tasks'], (old) => {
      if (!old) return old;
      return old.map((t) =>
        String(t.id) === taskId
          ? { ...t, column_name: newColumn, position: newIndex }
          : t
      );
    });

    updateTask.mutate({ id: taskId, data: { column_name: newColumn, position: newIndex } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2">
              <LayoutGrid className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Quadro de Tarefas</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'} no total
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleAddTask('segunda')}
            className="h-9 gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 min-w-min pb-4">
            {COLUMNS.map((colId) => (
              <BoardColumn
                key={colId}
                columnId={colId}
                tasks={getColumnTasks(colId)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={(id) => deleteTask.mutate(id)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        defaultColumn={defaultColumn}
      />
    </div>
  );
}