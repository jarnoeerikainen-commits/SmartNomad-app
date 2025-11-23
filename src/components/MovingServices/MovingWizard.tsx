import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMovingServices } from '@/hooks/useMovingServices';
import { MoveType, Urgency, RoomInventory, MovingRequest } from '@/types/movingServices';
import { ArrowRight, ArrowLeft, Sparkles, Home, Package, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { containerSizeInfo } from '@/data/movingServicesData';

interface MovingWizardProps {
  onClose: () => void;
}

export function MovingWizard({ onClose }: MovingWizardProps) {
  const [step, setStep] = useState(1);
  const { loading, getAIInventoryAssessment, requestQuotes } = useMovingServices();
  const [moveData, setMoveData] = useState<Partial<MovingRequest>>({
    type: 'international',
    route: {
      from: { city: '', country: '' },
      to: { city: '', country: '' },
      preferredDates: { startDate: '', endDate: '', flexible: true },
      urgency: 'standard'
    },
    inventory: {
      roomBreakdown: [],
      specialItems: [],
      totalVolume: 0,
      estimatedWeight: 0,
      totalBoxes: 0
    },
    services: {
      packing: false,
      unpacking: false,
      insurance: false,
      storage: false,
      vehicleTransport: false,
      petRelocation: false,
      furnitureAssembly: false
    },
    budget: { range: '', currency: 'USD' }
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAIAssessment = async () => {
    if (!moveData.inventory?.roomBreakdown || moveData.inventory.roomBreakdown.length === 0) {
      toast.error('Please add at least one room to your inventory');
      return;
    }

    const assessment = await getAIInventoryAssessment(moveData.inventory.roomBreakdown);
    if (assessment) {
      setMoveData(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory!,
          totalBoxes: assessment.estimatedBoxes,
          estimatedWeight: assessment.estimatedWeight,
          containerSize: assessment.recommendedContainer
        }
      }));
      toast.success('AI assessment complete!', {
        description: `Estimated ${assessment.estimatedBoxes} boxes, ${assessment.estimatedWeight}kg`
      });
    }
  };

  const handleSubmit = async () => {
    const success = await requestQuotes(moveData as MovingRequest);
    if (success) {
      onClose();
    }
  };

  const addRoom = () => {
    const newRoom: RoomInventory = {
      room: 'living',
      items: [],
      estimatedBoxes: 0,
      specialHandling: false
    };
    setMoveData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory!,
        roomBreakdown: [...(prev.inventory?.roomBreakdown || []), newRoom]
      }
    }));
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Plan Your Move
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {
              step === 1 ? 'Move Details' :
              step === 2 ? 'Inventory & Items' :
              step === 3 ? 'Services & Budget' :
              'Review & Submit'
            }
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div 
              className="gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Move Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Move Type</Label>
                <RadioGroup
                  value={moveData.type}
                  onValueChange={(value) => setMoveData(prev => ({ ...prev, type: value as MoveType }))}
                  className="grid grid-cols-2 gap-4"
                >
                  <Card className={moveData.type === 'international' ? 'border-primary' : ''}>
                    <CardContent className="p-4">
                      <RadioGroupItem value="international" id="international" className="sr-only" />
                      <Label htmlFor="international" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Truck className="h-8 w-8" />
                        <span className="font-medium">International</span>
                        <span className="text-xs text-muted-foreground text-center">
                          Moving between countries
                        </span>
                      </Label>
                    </CardContent>
                  </Card>
                  <Card className={moveData.type === 'local' ? 'border-primary' : ''}>
                    <CardContent className="p-4">
                      <RadioGroupItem value="local" id="local" className="sr-only" />
                      <Label htmlFor="local" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Home className="h-8 w-8" />
                        <span className="font-medium">Local</span>
                        <span className="text-xs text-muted-foreground text-center">
                          Moving within same city
                        </span>
                      </Label>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromCity">From City *</Label>
                  <Input
                    id="fromCity"
                    placeholder="e.g., New York"
                    value={moveData.route?.from.city}
                    onChange={(e) => setMoveData(prev => ({
                      ...prev,
                      route: { ...prev.route!, from: { ...prev.route!.from, city: e.target.value }}
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fromCountry">From Country *</Label>
                  <Input
                    id="fromCountry"
                    placeholder="e.g., USA"
                    value={moveData.route?.from.country}
                    onChange={(e) => setMoveData(prev => ({
                      ...prev,
                      route: { ...prev.route!, from: { ...prev.route!.from, country: e.target.value }}
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="toCity">To City *</Label>
                  <Input
                    id="toCity"
                    placeholder="e.g., London"
                    value={moveData.route?.to.city}
                    onChange={(e) => setMoveData(prev => ({
                      ...prev,
                      route: { ...prev.route!, to: { ...prev.route!.to, city: e.target.value }}
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="toCountry">To Country *</Label>
                  <Input
                    id="toCountry"
                    placeholder="e.g., UK"
                    value={moveData.route?.to.country}
                    onChange={(e) => setMoveData(prev => ({
                      ...prev,
                      route: { ...prev.route!, to: { ...prev.route!.to, country: e.target.value }}
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Preferred Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={moveData.route?.preferredDates.startDate}
                    onChange={(e) => setMoveData(prev => ({
                      ...prev,
                      route: { 
                        ...prev.route!, 
                        preferredDates: { ...prev.route!.preferredDates, startDate: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Preferred End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={moveData.route?.preferredDates.endDate}
                    onChange={(e) => setMoveData(prev => ({
                      ...prev,
                      route: { 
                        ...prev.route!, 
                        preferredDates: { ...prev.route!.preferredDates, endDate: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Move Urgency</Label>
                <Select
                  value={moveData.route?.urgency}
                  onValueChange={(value) => setMoveData(prev => ({
                    ...prev,
                    route: { ...prev.route!, urgency: value as Urgency }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible - I have time to plan</SelectItem>
                    <SelectItem value="standard">Standard - 4-8 weeks</SelectItem>
                    <SelectItem value="urgent">Urgent - Need to move ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Inventory */}
          {step === 2 && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">AI Inventory Assistant</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add your rooms below, and our AI will estimate boxes, weight, and recommend the best container size.
                      </p>
                      <Button
                        onClick={handleAIAssessment}
                        variant="outline"
                        size="sm"
                        disabled={loading || !moveData.inventory?.roomBreakdown?.length}
                        className="gap-2"
                      >
                        {loading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                        ) : (
                          <><Sparkles className="h-4 w-4" /> Get AI Assessment</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Rooms & Items</Label>
                  <Button onClick={addRoom} variant="outline" size="sm">
                    + Add Room
                  </Button>
                </div>

                {moveData.inventory?.roomBreakdown && moveData.inventory.roomBreakdown.length > 0 ? (
                  moveData.inventory.roomBreakdown.map((room, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Room Type</Label>
                            <Select
                              value={room.room}
                              onValueChange={(value) => {
                                const updated = [...moveData.inventory!.roomBreakdown];
                                updated[index].room = value as any;
                                setMoveData(prev => ({
                                  ...prev,
                                  inventory: { ...prev.inventory!, roomBreakdown: updated }
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="living">Living Room</SelectItem>
                                <SelectItem value="bedroom">Bedroom</SelectItem>
                                <SelectItem value="kitchen">Kitchen</SelectItem>
                                <SelectItem value="dining">Dining Room</SelectItem>
                                <SelectItem value="office">Office</SelectItem>
                                <SelectItem value="garage">Garage</SelectItem>
                                <SelectItem value="storage">Storage</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Estimated Boxes</Label>
                            <Input
                              type="number"
                              min="0"
                              value={room.estimatedBoxes}
                              onChange={(e) => {
                                const updated = [...moveData.inventory!.roomBreakdown];
                                updated[index].estimatedBoxes = parseInt(e.target.value) || 0;
                                setMoveData(prev => ({
                                  ...prev,
                                  inventory: { ...prev.inventory!, roomBreakdown: updated }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No rooms added yet. Click "Add Room" to start.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {moveData.inventory?.totalBoxes && moveData.inventory.totalBoxes > 0 && (
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{moveData.inventory.totalBoxes}</p>
                        <p className="text-sm text-muted-foreground">Est. Boxes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{moveData.inventory.estimatedWeight}kg</p>
                        <p className="text-sm text-muted-foreground">Est. Weight</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{moveData.inventory.containerSize || 'TBD'}</p>
                        <p className="text-sm text-muted-foreground">Container Size</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Services & Budget */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Additional Services</Label>
                <div className="space-y-3">
                  {[
                    { key: 'packing', label: 'Full Packing Service', desc: 'Professional packing of all items' },
                    { key: 'unpacking', label: 'Unpacking Service', desc: 'Unpack and organize at destination' },
                    { key: 'insurance', label: 'Moving Insurance', desc: 'Protect your belongings' },
                    { key: 'storage', label: 'Temporary Storage', desc: 'Store items before/after move' },
                    { key: 'vehicleTransport', label: 'Vehicle Transport', desc: 'Ship your car/motorcycle' },
                    { key: 'petRelocation', label: 'Pet Relocation', desc: 'Safe transport for pets' },
                    { key: 'furnitureAssembly', label: 'Furniture Assembly', desc: 'Disassemble & reassemble furniture' }
                  ].map((service) => (
                    <Card key={service.key}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={service.key}
                            checked={moveData.services?.[service.key as keyof typeof moveData.services]}
                            onCheckedChange={(checked) => setMoveData(prev => ({
                              ...prev,
                              services: { ...prev.services!, [service.key]: checked }
                            }))}
                          />
                          <div className="flex-1">
                            <Label htmlFor={service.key} className="font-medium cursor-pointer">
                              {service.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{service.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="budget" className="mb-2 block">Your Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $5,000 - $10,000"
                  value={moveData.budget?.range}
                  onChange={(e) => setMoveData(prev => ({
                    ...prev,
                    budget: { ...prev.budget!, range: e.target.value }
                  }))}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This helps us match you with the best moving companies for your budget
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Ready to Get Quotes!</h3>
                      <p className="text-sm text-muted-foreground">
                        We'll send your move details to top-rated moving companies. You'll receive quotes within 24-48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">
                        {moveData.route?.from.city}, {moveData.route?.from.country} → {moveData.route?.to.city}, {moveData.route?.to.country}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Move Type:</span>
                      <Badge>{moveData.type}</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Estimated Boxes:</span>
                      <span className="font-medium">{moveData.inventory?.totalBoxes || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Services Selected:</span>
                      <span className="font-medium">
                        {Object.values(moveData.services || {}).filter(Boolean).length}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Budget Range:</span>
                      <span className="font-medium">{moveData.budget?.range || 'Not specified'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="gap-2">
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                <><CheckCircle className="h-4 w-4" /> Submit Request</>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
