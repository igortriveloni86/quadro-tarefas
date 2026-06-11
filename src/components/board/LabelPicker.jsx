import React, { useState } from 'react';
import db from '@/lib/dbClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Check, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PRESET_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#10B981', '#06B6D4', '#6366F1',
  '#F97316', '#14B8A6', '#A855F7', '#64748B',
];

export default function LabelPicker({ selectedLabels = [], onToggleLabel }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const queryClient = useQueryClient();

  const { data: labels = [] } = useQuery({
    queryKey: ['labels'],
    queryFn: () => db.Label.list(),
  });

  const createLabel = useMutation({
    mutationFn: (data) => db.Label.create(data),
    onSuccess: (newLabel) => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      setNewName('');
      setIsCreating(false);
      onToggleLabel({ name: newLabel.name, color: newLabel.color });
    },
  });

  const deleteLabel = useMutation({
    mutationFn: (id) => db.Label.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels'] }),
  });

  const isSelected = (label) =>
    selectedLabels.some((l) => l.name === label.name && l.color === label.color);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Tag className="w-4 h-4" />
        Etiquetas
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center gap-2 group"
          >
            <button
              type="button"
              onClick={() => onToggleLabel({ name: label.name, color: label.color })}
              className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                isSelected(label) ? 'ring-2 ring-primary/40 bg-primary/5' : 'hover:bg-muted'
              }`}
            >
              <span className="w-4 h-4 rounded-md flex-shrink-0" style={{ backgroundColor: label.color }} />
              <span className="flex-1 text-left truncate">{label.name}</span>
              {isSelected(label) && <Check className="w-4 h-4 text-primary" />}
            </button>
            <button
              type="button"
              onClick={() => deleteLabel.mutate(label.id)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-all"
            >
              <X className="w-3 h-3 text-destructive" />
            </button>
          </div>
        ))}
      </div>

      {isCreating ? (
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome da etiqueta"
            className="h-8 text-sm"
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={`w-6 h-6 rounded-md transition-transform ${
                  newColor === color ? 'scale-125 ring-2 ring-offset-2 ring-foreground/20' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              className="flex-1 h-8 text-xs"
              disabled={!newName.trim()}
              onClick={() => createLabel.mutate({ name: newName.trim(), color: newColor })}
            >
              Criar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setIsCreating(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Criar nova etiqueta
        </button>
      )}
    </div>
  );
}