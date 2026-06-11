import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LabelPicker from './LabelPicker';

const columnOptions = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'urgentes', label: 'Urgentes' },
  { value: 'analisando', label: 'Analisando' },
  { value: 'concluidos', label: 'Concluídos' },
];

export default function TaskDialog({ open, onClose, onSave, task, defaultColumn }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    column_name: defaultColumn || 'segunda',
    priority: 'media',
    due_date: '',
    labels: [],
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        column_name: task.column_name || task.column || defaultColumn || 'segunda',
        priority: task.priority || 'media',
        due_date: task.due_date || '',
        labels: task.labels || [],
      });
    } else {
      setForm({
        title: '',
        description: '',
        column_name: defaultColumn || 'segunda',
        priority: 'media',
        due_date: '',
        labels: [],
      });
    }
  }, [task, defaultColumn, open]);

  const handleToggleLabel = (label) => {
    setForm((prev) => {
      const exists = prev.labels.some((l) => l.name === label.name && l.color === label.color);
      return {
        ...prev,
        labels: exists
          ? prev.labels.filter((l) => !(l.name === label.name && l.color === label.color))
          : [...prev.labels, label],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-semibold">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nome da tarefa..."
              className="h-10"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Adicione uma descrição..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quadro</Label>
              <Select value={form.column_name} onValueChange={(v) => setForm({ ...form, column_name: v })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data de vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-10 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {form.due_date
                    ? format(new Date(form.due_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
                    : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.due_date ? new Date(form.due_date) : undefined}
                  onSelect={(date) => setForm({ ...form, due_date: date ? date.toISOString().split('T')[0] : '' })}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <LabelPicker
            selectedLabels={form.labels}
            onToggleLabel={handleToggleLabel}
          />

          {form.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.labels.map((label, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 h-10 font-medium">
              {task ? 'Salvar alterações' : 'Criar tarefa'}
            </Button>
            <Button type="button" variant="outline" className="h-10" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}