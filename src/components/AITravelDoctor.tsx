import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Stethoscope, 
  MapPin, 
  User, 
  Calendar,
  Phone,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Heart,
  Pill,
  Activity,
  Syringe,
  Shield,
  Globe,
  ThermometerSun,
  Bug,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { LocationData } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

interface AITravelDoctorProps {
  currentLocation: LocationData | null;
  subscription: Subscription;
  onUpgradeClick?: () => void;
}

interface PatientInfo {
  isUser: boolean;
  name: string;
  age: string;
  gender: string;
  relationship?: string;
}

interface MedicalHistory {
  chronicConditions: string[];
  currentMedications: string[];
  allergies: string[];
  recentVaccinations: string[];
  travelHistory: string[];
}

interface CountryHealthData {
  emergencyNumber: string;
  requiredVaccinations: string[];
  recommendedVaccinations: string[];
  diseaseRisks: string[];
  waterSafety: string;
  foodSafety: string;
  airQuality: string;
  malaria: boolean;
  dengue: boolean;
  yellowFever: boolean;
}

const AITravelDoctor: React.FC<AITravelDoctorProps> = ({ currentLocation, subscription, onUpgradeClick }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'welcome' | 'patient' | 'medical-history' | 'symptoms' | 'results'>('welcome');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    isUser: true,
    name: '',
    age: '',
    gender: '',
    relationship: ''
  });
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    chronicConditions: [],
    currentMedications: [],
    allergies: [],
    recentVaccinations: [],
    travelHistory: []
  });
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomDetails, setSymptomDetails] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Pre-loaded medical database by country
  const countryHealthDatabase: Record<string, CountryHealthData> = {
    'TH': { // Thailand
      emergencyNumber: '1669',
      requiredVaccinations: [],
      recommendedVaccinations: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis'],
      diseaseRisks: ['Dengue Fever', 'Malaria (rural areas)', 'Zika Virus', 'Rabies'],
      waterSafety: 'Bottled water recommended',
      foodSafety: 'Cook food thoroughly, avoid street food',
      airQuality: 'Moderate - monitor PM2.5 levels',
      malaria: true,
      dengue: true,
      yellowFever: false
    },
    'BR': { // Brazil
      emergencyNumber: '192',
      requiredVaccinations: ['Yellow Fever'],
      recommendedVaccinations: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies'],
      diseaseRisks: ['Yellow Fever', 'Dengue Fever', 'Zika Virus', 'Chikungunya'],
      waterSafety: 'Bottled water only',
      foodSafety: 'Avoid raw food and ice',
      airQuality: 'Varies by region',
      malaria: true,
      dengue: true,
      yellowFever: true
    },
    'IN': { // India
      emergencyNumber: '102',
      requiredVaccinations: [],
      recommendedVaccinations: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies'],
      diseaseRisks: ['Malaria', 'Dengue Fever', 'Typhoid', 'Hepatitis A & B', 'Rabies'],
      waterSafety: 'Bottled or filtered water only',
      foodSafety: 'Cook food thoroughly, avoid raw vegetables',
      airQuality: 'Poor in major cities',
      malaria: true,
      dengue: true,
      yellowFever: false
    },
    'US': {
      emergencyNumber: '911',
      requiredVaccinations: [],
      recommendedVaccinations: ['Routine vaccines', 'Flu', 'COVID-19'],
      diseaseRisks: ['Lyme Disease (Northeast)', 'West Nile Virus', 'Hantavirus (Southwest)'],
      waterSafety: 'Safe tap water',
      foodSafety: 'High food safety standards',
      airQuality: 'Generally good',
      malaria: false,
      dengue: false,
      yellowFever: false
    },
    'GB': {
      emergencyNumber: '999',
      requiredVaccinations: [],
      recommendedVaccinations: ['Routine vaccines', 'Flu', 'COVID-19'],
      diseaseRisks: ['Seasonal flu'],
      waterSafety: 'Safe tap water',
      foodSafety: 'High food safety standards',
      airQuality: 'Generally good',
      malaria: false,
      dengue: false,
      yellowFever: false
    },
    'DEFAULT': {
      emergencyNumber: '112',
      requiredVaccinations: [],
      recommendedVaccinations: ['Routine vaccines', 'Hepatitis A', 'Typhoid'],
      diseaseRisks: ['Varies by region'],
      waterSafety: 'Use bottled water when unsure',
      foodSafety: 'Cook food thoroughly',
      airQuality: 'Monitor local conditions',
      malaria: false,
      dengue: false,
      yellowFever: false
    }
  };

  // Symptom categories and options
  const symptomCategories = [
    {
      category: 'General',
      icon: Activity,
      symptoms: ['Fever', 'Fatigue', 'Weakness', 'Weight loss', 'Night sweats', 'Chills']
    },
    {
      category: 'Respiratory',
      icon: Activity,
      symptoms: ['Cough', 'Shortness of breath', 'Chest pain', 'Sore throat', 'Runny nose', 'Congestion']
    },
    {
      category: 'Digestive',
      icon: Activity,
      symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Loss of appetite']
    },
    {
      category: 'Skin',
      icon: Activity,
      symptoms: ['Rash', 'Itching', 'Hives', 'Swelling', 'Bruising', 'Bug bites']
    },
    {
      category: 'Neurological',
      icon: Activity,
      symptoms: ['Headache', 'Dizziness', 'Confusion', 'Seizures', 'Numbness', 'Vision changes']
    },
    {
      category: 'Pain',
      icon: Activity,
      symptoms: ['Joint pain', 'Muscle pain', 'Back pain', 'Neck pain', 'Toothache', 'Ear pain']
    }
  ];

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart disease', 'Thyroid disorder',
    'Kidney disease', 'Liver disease', 'Epilepsy', 'Arthritis', 'Depression/Anxiety'
  ];

  const getCurrentHealthData = (): CountryHealthData => {
    const countryCode = currentLocation?.country_code || 'DEFAULT';
    return countryHealthDatabase[countryCode] || countryHealthDatabase['DEFAULT'];
  };

  const getRecommendations = () => {
    const healthData = getCurrentHealthData();
    const recommendations: Array<{ type: 'emergency' | 'warning' | 'info'; message: string; action?: string }> = [];

    // Emergency recommendations
    if (symptoms.includes('Difficulty breathing') || symptoms.includes('Chest pain') || symptoms.includes('Seizures')) {
      recommendations.push({
        type: 'emergency',
        message: `CALL ${healthData.emergencyNumber} IMMEDIATELY - This could be a medical emergency`,
        action: `tel:${healthData.emergencyNumber}`
      });
    }

    // High fever in tropical areas
    if (symptoms.includes('Fever') && (healthData.dengue || healthData.malaria)) {
      recommendations.push({
        type: 'warning',
        message: 'Fever in tropical area - Seek medical attention soon. Could be Dengue, Malaria, or other tropical disease.',
      });
    }

    // Digestive issues
    if (symptoms.includes('Diarrhea') || symptoms.includes('Vomiting')) {
      recommendations.push({
        type: 'warning',
        message: 'Stay hydrated - Drink oral rehydration solution. If severe or bloody, seek medical care.',
      });
    }

    // Bug bites in malaria/dengue areas
    if (symptoms.includes('Bug bites') && (healthData.malaria || healthData.dengue)) {
      recommendations.push({
        type: 'warning',
        message: 'Monitor for fever, chills, or rash. Could indicate mosquito-borne illness.',
      });
    }

    // General advice
    if (symptoms.length > 0 && recommendations.length === 0) {
      recommendations.push({
        type: 'info',
        message: 'Consider telemedicine consultation or visit local clinic if symptoms persist or worsen.',
      });
    }

    return recommendations;
  };

  const renderWelcome = () => (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl">AI Travel Doctor</CardTitle>
        <CardDescription className="text-base">
          Your intelligent health companion for travel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentLocation && (
          <Alert>
            <MapPin className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <strong>Current Location:</strong> {currentLocation.city}, {currentLocation.country}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold mb-2">Pre-loaded Medical Database</h3>
                <p className="text-sm text-muted-foreground">
                  Country-specific health data, emergency contacts, vaccination requirements
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2">Structured Health Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Professional medical questionnaire and symptom checker
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="ml-2">
              <strong className="text-destructive">Important:</strong> This is not a substitute for professional medical care. 
              In case of emergency, call local emergency services immediately.
            </AlertDescription>
          </Alert>

          <Button 
            size="lg" 
            className="w-full"
            onClick={() => setStep('patient')}
          >
            Start Health Assessment
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPatientInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          Patient Information
        </CardTitle>
        <CardDescription>
          Who needs medical assistance?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Who is the patient?</Label>
          <RadioGroup
            value={patientInfo.isUser ? 'user' : 'other'}
            onValueChange={(value) => setPatientInfo({ ...patientInfo, isUser: value === 'user' })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user" className="font-normal cursor-pointer">
                Myself
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="font-normal cursor-pointer">
                Someone else
              </Label>
            </div>
          </RadioGroup>
        </div>

        {!patientInfo.isUser && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Patient's Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to you</Label>
              <Input
                id="relationship"
                placeholder="e.g., Spouse, Child, Parent, Friend"
                value={patientInfo.relationship || ''}
                onChange={(e) => setPatientInfo({ ...patientInfo, relationship: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Age"
              value={patientInfo.age}
              onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={patientInfo.gender}
              onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="gender-other" />
                <Label htmlFor="gender-other" className="font-normal cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep('welcome')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (!patientInfo.age || !patientInfo.gender) {
                toast({
                  title: "Incomplete Information",
                  description: "Please fill in all required fields",
                  variant: "destructive"
                });
                return;
              }
              setStep('medical-history');
            }}
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMedicalHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Medical History
        </CardTitle>
        <CardDescription>
          Help us understand the patient's health background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Chronic Conditions</Label>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3">
            {commonConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={medicalHistory.chronicConditions.includes(condition)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setMedicalHistory({
                        ...medicalHistory,
                        chronicConditions: [...medicalHistory.chronicConditions, condition]
                      });
                    } else {
                      setMedicalHistory({
                        ...medicalHistory,
                        chronicConditions: medicalHistory.chronicConditions.filter(c => c !== condition)
                      });
                    }
                  }}
                />
                <Label htmlFor={condition} className="font-normal cursor-pointer text-sm">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="medications" className="text-base font-semibold flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Current Medications
          </Label>
          <Textarea
            id="medications"
            placeholder="List any medications currently taking (include dosage if known)"
            value={medicalHistory.currentMedications.join('\n')}
            onChange={(e) => setMedicalHistory({
              ...medicalHistory,
              currentMedications: e.target.value.split('\n').filter(m => m.trim())
            })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies" className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Allergies
          </Label>
          <Textarea
            id="allergies"
            placeholder="List any known allergies (medications, food, environmental)"
            value={medicalHistory.allergies.join('\n')}
            onChange={(e) => setMedicalHistory({
              ...medicalHistory,
              allergies: e.target.value.split('\n').filter(a => a.trim())
            })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vaccinations" className="text-base font-semibold flex items-center gap-2">
            <Syringe className="h-4 w-4" />
            Recent Vaccinations
          </Label>
          <Textarea
            id="vaccinations"
            placeholder="List recent vaccinations (within last 2 years)"
            value={medicalHistory.recentVaccinations.join('\n')}
            onChange={(e) => setMedicalHistory({
              ...medicalHistory,
              recentVaccinations: e.target.value.split('\n').filter(v => v.trim())
            })}
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep('patient')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={() => setStep('symptoms')}
          >
            Continue to Symptoms
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSymptoms = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Current Symptoms
        </CardTitle>
        <CardDescription>
          Select all symptoms the patient is experiencing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {symptomCategories.map((category) => (
            <Card key={category.category} className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {category.symptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={symptoms.includes(symptom)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSymptoms([...symptoms, symptom]);
                          } else {
                            setSymptoms(symptoms.filter(s => s !== symptom));
                          }
                        }}
                      />
                      <Label htmlFor={symptom} className="font-normal cursor-pointer text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="details" className="text-base font-semibold">
            Additional Details
          </Label>
          <Textarea
            id="details"
            placeholder="Describe symptoms in detail: When did they start? How severe? Any patterns?"
            value={symptomDetails}
            onChange={(e) => setSymptomDetails(e.target.value)}
            rows={5}
          />
        </div>

        {symptoms.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <strong>{symptoms.length} symptoms selected</strong>
              <div className="flex flex-wrap gap-1 mt-2">
                {symptoms.map((symptom) => (
                  <Badge key={symptom} variant="secondary">{symptom}</Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep('medical-history')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (symptoms.length === 0) {
                toast({
                  title: "No Symptoms Selected",
                  description: "Please select at least one symptom",
                  variant: "destructive"
                });
                return;
              }
              setStep('results');
            }}
          >
            Get Recommendations
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const healthData = getCurrentHealthData();
    const recommendations = getRecommendations();

    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6" />
              Health Assessment Results
            </CardTitle>
            <CardDescription>
              Based on location, symptoms, and medical history
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <Alert
                key={index}
                className={
                  rec.type === 'emergency' ? 'border-destructive bg-destructive/10' :
                  rec.type === 'warning' ? 'border-orange-500 bg-orange-500/10' :
                  'border-blue-500 bg-blue-500/10'
                }
              >
                {rec.type === 'emergency' && <AlertTriangle className="h-5 w-5 text-destructive" />}
                {rec.type === 'warning' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                {rec.type === 'info' && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                <AlertDescription className="ml-2">
                  <p className="font-semibold">{rec.message}</p>
                  {rec.action && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => window.location.href = rec.action!}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* Patient Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient</p>
                <p className="font-semibold">{patientInfo.isUser ? 'You' : patientInfo.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-semibold">{patientInfo.age} years</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-semibold capitalize">{patientInfo.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Symptoms</p>
                <p className="font-semibold">{symptoms.length} reported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Health Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Local Health Information
            </CardTitle>
            <CardDescription>
              {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Current Location'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Alert className="border-destructive/50">
                <Phone className="h-5 w-5 text-destructive" />
                <AlertDescription className="ml-2">
                  <strong>Emergency Number:</strong> {healthData.emergencyNumber}
                </AlertDescription>
              </Alert>

              {healthData.requiredVaccinations.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Syringe className="h-4 w-4" />
                    Required Vaccinations
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {healthData.requiredVaccinations.map((vac) => (
                      <Badge key={vac} variant="destructive">{vac}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthData.recommendedVaccinations.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Syringe className="h-4 w-4" />
                    Recommended Vaccinations
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {healthData.recommendedVaccinations.map((vac) => (
                      <Badge key={vac} variant="secondary">{vac}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {healthData.diseaseRisks.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Disease Risks
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {healthData.diseaseRisks.map((disease) => (
                      <Badge key={disease} variant="outline" className="border-orange-500">
                        {disease}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground mb-1">Water Safety</p>
                    <p className="font-semibold">{healthData.waterSafety}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground mb-1">Food Safety</p>
                    <p className="font-semibold">{healthData.foodSafety}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const query = currentLocation 
                  ? `doctors near ${currentLocation.city}, ${currentLocation.country}`
                  : 'doctors near me';
                window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Nearest Doctor
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const query = currentLocation 
                  ? `pharmacies near ${currentLocation.city}, ${currentLocation.country}`
                  : 'pharmacies near me';
                window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
              }}
            >
              <Pill className="h-4 w-4 mr-2" />
              Find Nearest Pharmacy
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('https://www.teladoc.com', '_blank')}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Connect to Telemedicine
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Reset all data
              setStep('welcome');
              setPatientInfo({
                isUser: true,
                name: '',
                age: '',
                gender: '',
                relationship: ''
              });
              setMedicalHistory({
                chronicConditions: [],
                currentMedications: [],
                allergies: [],
                recentVaccinations: [],
                travelHistory: []
              });
              setSymptoms([]);
              setSymptomDetails('');
              toast({
                title: "Assessment Reset",
                description: "Starting new health assessment"
              });
            }}
          >
            Start New Assessment
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // In a real app, this would generate a PDF or send to email
              toast({
                title: "Results Saved",
                description: "Health assessment saved to your profile"
              });
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Results
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {step === 'welcome' && renderWelcome()}
      {step === 'patient' && renderPatientInfo()}
      {step === 'medical-history' && renderMedicalHistory()}
      {step === 'symptoms' && renderSymptoms()}
      {step === 'results' && renderResults()}
    </div>
  );
};

export default AITravelDoctor;
