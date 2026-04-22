// Family Member types — supports unlimited dependents per household.
// Covers spouses, children (including infants), elderly parents, and
// dependents with special needs / disability requiring assisted care.

export type RelationshipType =
  | 'self'
  | 'spouse'
  | 'partner'
  | 'child'
  | 'infant'
  | 'parent'
  | 'grandparent'
  | 'sibling'
  | 'guardian'
  | 'ward'
  | 'caregiver_dependent'
  | 'other';

export type CareLevel =
  | 'independent'
  | 'assisted'        // elderly, mild assistance
  | 'full_care'       // disability, infant
  | 'medical_complex'; // chronic illness, complex meds

export interface FamilyPassport {
  id: string;
  country: string;
  passportNumber: string;
  expiryDate: string;        // ISO YYYY-MM-DD
  issueDate?: string;
  showNumber?: boolean;
}

export interface FamilyVisa {
  id: string;
  country: string;
  visaType: string;          // tourist, student, work, dependent, etc.
  expiryDate: string;
  issueDate?: string;
  visaNumber?: string;
  notes?: string;
}

export interface FamilyVaccination {
  id: string;
  name: string;              // e.g. "Yellow Fever", "MMR", "Hepatitis A"
  dateReceived: string;
  expiryDate?: string;       // some vaccines are lifetime — leave blank
  certificateNumber?: string; // yellow fever ICVP number, etc.
  isRequired?: boolean;
  notes?: string;
}

export interface MedicalNote {
  id: string;
  label: string;             // "Allergies", "Daily medications", "Blood type"
  details: string;
  critical?: boolean;        // surfaces in emergency view
}

export interface FamilyMember {
  id: string;
  fullName: string;
  preferredName?: string;
  relationship: RelationshipType;
  dateOfBirth?: string;      // ISO YYYY-MM-DD — drives age + child/elderly logic
  careLevel: CareLevel;
  nationality?: string;
  photoDataUrl?: string;     // optional small avatar (kept local)

  // Document collections — each member can hold multiple
  passports: FamilyPassport[];
  visas: FamilyVisa[];
  vaccinations: FamilyVaccination[];
  medicalNotes: MedicalNote[];

  // Special-needs / dependent context
  dietaryNeeds?: string;
  mobilityNeeds?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  createdAt: string;
  updatedAt: string;
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  self: 'Myself',
  spouse: 'Spouse',
  partner: 'Partner',
  child: 'Child',
  infant: 'Infant / Toddler',
  parent: 'Parent',
  grandparent: 'Grandparent',
  sibling: 'Sibling',
  guardian: 'Legal Guardian',
  ward: 'Ward / Dependent',
  caregiver_dependent: 'Person under my care',
  other: 'Other',
};

export const CARE_LEVEL_LABELS: Record<CareLevel, string> = {
  independent: 'Independent',
  assisted: 'Needs assistance',
  full_care: 'Full-time care',
  medical_complex: 'Complex medical needs',
};
