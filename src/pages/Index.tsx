import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, Monitor, Users } from 'lucide-react';

const Index = () => {
  const [activeForm, setActiveForm] = useState<'support' | 'reservation'>('support');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data for time slots (in real app, this would come from backend)
  const timeSlots = {
    'Segunda': { '09:00': 'available', '10:00': 'available', '11:00': 'reserved', '14:00': 'available', '15:00': 'available' },
    'Terça': { '09:00': 'available', '10:00': 'pending', '11:00': 'available', '14:00': 'reserved', '15:00': 'available' },
    'Quarta': { '09:00': 'available', '10:00': 'available', '11:00': 'available', '14:00': 'available', '15:00': 'pending' },
    'Quinta': { '09:00': 'reserved', '10:00': 'available', '11:00': 'available', '14:00': 'available', '15:00': 'available' },
    'Sexta': { '09:00': 'available', '10:00': 'available', '11:00': 'pending', '14:00': 'available', '15:00': 'available' }
  };

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const hours = ['09:00', '10:00', '11:00', '14:00', '15:00'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSlotClick = (day: string, hour: string) => {
    const slotId = `${day}-${hour}`;
    const currentStatus = timeSlots[day as keyof typeof timeSlots][hour];
    
    if (currentStatus === 'reserved') return;

    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(slot => slot !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  const getSlotStatus = (day: string, hour: string) => {
    const slotId = `${day}-${hour}`;
    if (selectedSlots.includes(slotId)) return 'selected';
    return timeSlots[day as keyof typeof timeSlots][hour];
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSuccessModal(true);
    
    // Reset form after submission
    if (activeForm === 'support') {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setSelectedSlots([]);
    }

    // Hide modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sistema de Gestão Escolar
          </h1>
          <p className="text-lg text-muted-foreground">
            Suporte Técnico e Reservas de Sala
          </p>
        </div>

        {/* Form Toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass-card rounded-xl p-2 inline-flex gap-2">
            <Button
              variant={activeForm === 'support' ? 'default' : 'ghost'}
              onClick={() => setActiveForm('support')}
              className="flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Suporte Técnico
            </Button>
            <Button
              variant={activeForm === 'reservation' ? 'default' : 'ghost'}
              onClick={() => setActiveForm('reservation')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Reserva de Sala
            </Button>
          </div>
        </div>

        {/* Support Form */}
        {activeForm === 'support' && (
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Requisição de Suporte Técnico
              </CardTitle>
              <CardDescription>
                Descreva o problema técnico para que possamos ajudar rapidamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="support-name">Nome do Colaborador *</Label>
                    <Input 
                      id="support-name" 
                      required 
                      placeholder="Digite seu nome completo"
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-subject">Assunto *</Label>
                    <Select required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione o tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-problem">Problema no computador</SelectItem>
                        <SelectItem value="internet-not-working">Internet não funciona</SelectItem>
                        <SelectItem value="software-issue">Problema de software</SelectItem>
                        <SelectItem value="printer-problem">Problema na impressora</SelectItem>
                        <SelectItem value="projector-issue">Problema no projetor</SelectItem>
                        <SelectItem value="network-access">Acesso à rede</SelectItem>
                        <SelectItem value="email-problem">Problema de email</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-datetime">Data e Hora *</Label>
                  <Input 
                    id="support-datetime" 
                    type="datetime-local" 
                    required 
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-description">Descrição Detalhada *</Label>
                  <Textarea 
                    id="support-description" 
                    required 
                    placeholder="Descreva o problema em detalhe, incluindo mensagens de erro se houver..."
                    className="min-h-32 bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Anexar Ficheiro</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-background/50"
                    >
                      <Upload className="w-4 h-4" />
                      Escolher Ficheiro
                    </Button>
                    {selectedFile && (
                      <Badge variant="secondary" className="px-3 py-1">
                        {selectedFile.name}
                      </Badge>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Enviar Requisição
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reservation Form */}
        {activeForm === 'reservation' && (
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Reserva de Sala de Informática
              </CardTitle>
              <CardDescription>
                Selecione os horários disponíveis para reservar a sala.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reservation-name">Nome do Colaborador *</Label>
                    <Input 
                      id="reservation-name" 
                      required 
                      placeholder="Digite seu nome completo"
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reservation-class">Turma *</Label>
                    <Select required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7a">7º A</SelectItem>
                        <SelectItem value="7b">7º B</SelectItem>
                        <SelectItem value="8a">8º A</SelectItem>
                        <SelectItem value="8b">8º B</SelectItem>
                        <SelectItem value="9a">9º A</SelectItem>
                        <SelectItem value="9b">9º B</SelectItem>
                        <SelectItem value="10a">10º A</SelectItem>
                        <SelectItem value="10b">10º B</SelectItem>
                        <SelectItem value="11a">11º A</SelectItem>
                        <SelectItem value="11b">11º B</SelectItem>
                        <SelectItem value="12a">12º A</SelectItem>
                        <SelectItem value="12b">12º B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time Grid */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Horários Disponíveis</Label>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[hsl(var(--grid-available))] border border-available"></div>
                        <span>Disponível</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[hsl(var(--grid-pending))] border border-pending"></div>
                        <span>Pendente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[hsl(var(--grid-reserved))] border border-reserved"></div>
                        <span>Reservado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-primary border border-primary"></div>
                        <span>Selecionado</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-6 gap-2 min-w-[600px]">
                      {/* Header */}
                      <div className="font-semibold p-3 text-center">Horário</div>
                      {days.map(day => (
                        <div key={day} className="font-semibold p-3 text-center">
                          {day}
                        </div>
                      ))}
                      
                      {/* Time slots */}
                      {hours.map(hour => (
                        <React.Fragment key={hour}>
                          <div className="font-medium p-3 text-center bg-muted rounded-lg">
                            {hour}
                          </div>
                          {days.map(day => {
                            const status = getSlotStatus(day, hour);
                            return (
                              <div
                                key={`${day}-${hour}`}
                                className={`time-slot p-3 text-center rounded-lg ${status}`}
                                onClick={() => handleSlotClick(day, hour)}
                              >
                                {status === 'available' && '✓'}
                                {status === 'pending' && '⏳'}
                                {status === 'reserved' && '✕'}
                                {status === 'selected' && '✓'}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedSlots.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Horários Selecionados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSlots.map(slot => {
                        const [day, hour] = slot.split('-');
                        return (
                          <Badge key={slot} variant="default">
                            {day} às {hour}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={selectedSlots.length === 0}
                >
                  Submeter Reserva
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-8 rounded-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-success-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sucesso!</h3>
                <p className="text-muted-foreground">
                  {activeForm === 'support' 
                    ? 'A sua requisição de suporte foi enviada com sucesso.'
                    : 'A sua reserva foi registada com sucesso.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;