// ─────────────────────────────────────────────
//  General Medical Conditions — Master List
// ─────────────────────────────────────────────

// ── Allergies ─────────────────────────────────

export const DRUG_ALLERGIES: string[] = [
  'Aspirin',
  'Codeine',
  'Erythromycin',
  'Ibuprofen',
  'Insulin',
  'Morphine',
  'Naproxen',
  'Penicillin',
  'Sulfonamides',
  'Tetracycline',
];

export const FOOD_ALLERGIES: string[] = [
  'Eggs',
  'Fish',
  'Gluten',
  'Milk / Dairy',
  'Peanuts',
  'Sesame',
  'Shellfish',
  'Soy',
  'Tree Nuts',
  'Wheat',
];

export const ENVIRONMENTAL_ALLERGIES: string[] = [
  'Animal Dander',
  'Cockroach',
  'Dust Mites',
  'Insect Stings (Bee/Wasp)',
  'Latex',
  'Mold',
  'Pollen (Grass)',
  'Pollen (Tree)',
  'Pollen (Weed)',
  'Sunlight (Photoallergy)',
];

// ── Chronic Conditions ────────────────────────

export const CARDIOVASCULAR_CONDITIONS: string[] = [
  'Arrhythmia',
  'Atrial Fibrillation',
  'Coronary Artery Disease',
  'Heart Failure',
  'Hypertension',
  'Hypotension',
  'Peripheral Artery Disease',
  'Stroke History',
];

export const METABOLIC_CONDITIONS: string[] = [
  'Gout',
  'High Cholesterol (Hyperlipidemia)',
  'Hypothyroidism / Hyperthyroidism',
  'Metabolic Syndrome',
  'Obesity',
  'Osteoporosis',
  'Prediabetes',
  'Type 1 Diabetes',
  'Type 2 Diabetes',
  'Vitamin D Deficiency',
];

export const RESPIRATORY_CONDITIONS: string[] = [
  'Allergic Rhinitis',
  'Asthma',
  'Bronchiectasis',
  'Chronic Bronchitis',
  'COPD',
  'Cystic Fibrosis',
  'Pulmonary Fibrosis',
  'Sleep Apnea',
];

export const GASTROINTESTINAL_CONDITIONS: string[] = [
  'Celiac Disease',
  "Crohn's Disease",
  'GERD / Acid Reflux',
  'Hepatitis B',
  'Hepatitis C',
  'Irritable Bowel Syndrome (IBS)',
  'Liver Cirrhosis',
  'Peptic Ulcer Disease',
  'Ulcerative Colitis',
];

export const NEUROLOGICAL_CONDITIONS: string[] = [
  "Alzheimer's Disease",
  'Anxiety Disorder',
  'Bipolar Disorder',
  'Depression',
  'Epilepsy',
  'Migraine',
  'Multiple Sclerosis',
  "Parkinson's Disease",
  'PTSD',
  'Schizophrenia',
];

export const MUSCULOSKELETAL_CONDITIONS: string[] = [
  'Ankylosing Spondylitis',
  'Fibromyalgia',
  'Lupus (SLE)',
  'Osteoarthritis',
  'Psoriatic Arthritis',
  'Rheumatoid Arthritis',
  'Scoliosis',
];

export const RENAL_CONDITIONS: string[] = [
  'Chronic Kidney Disease',
  'Kidney Stones',
  'Nephrotic Syndrome',
  'Polycystic Kidney Disease',
  'Urinary Tract Infections (Recurrent)',
];

export const ONCOLOGICAL_CONDITIONS: string[] = [
  'Bladder Cancer',
  'Breast Cancer',
  'Cervical Cancer',
  'Colorectal Cancer',
  'Leukemia',
  'Lung Cancer',
  'Lymphoma',
  'Prostate Cancer',
  'Skin Cancer (Melanoma)',
  'Thyroid Cancer',
];

// ── Common Medications ────────────────────────

export const COMMON_MEDICATIONS: { name: string; category: string }[] = [
  // Cardiovascular
  { name: 'Amlodipine', category: 'Cardiovascular' },
  { name: 'Atorvastatin', category: 'Cardiovascular' },
  { name: 'Bisoprolol', category: 'Cardiovascular' },
  { name: 'Clopidogrel', category: 'Cardiovascular' },
  { name: 'Furosemide', category: 'Cardiovascular' },
  { name: 'Lisinopril', category: 'Cardiovascular' },
  { name: 'Losartan', category: 'Cardiovascular' },
  { name: 'Warfarin', category: 'Cardiovascular' },
  // Diabetes
  { name: 'Glipizide', category: 'Diabetes' },
  { name: 'Insulin Glargine', category: 'Diabetes' },
  { name: 'Metformin', category: 'Diabetes' },
  { name: 'Semaglutide', category: 'Diabetes' },
  { name: 'Sitagliptin', category: 'Diabetes' },
  // Respiratory
  { name: 'Albuterol', category: 'Respiratory' },
  { name: 'Budesonide', category: 'Respiratory' },
  { name: 'Fluticasone', category: 'Respiratory' },
  { name: 'Montelukast', category: 'Respiratory' },
  { name: 'Tiotropium', category: 'Respiratory' },
  // Neurological / Mental Health
  { name: 'Alprazolam', category: 'Mental Health' },
  { name: 'Amitriptyline', category: 'Mental Health' },
  { name: 'Escitalopram', category: 'Mental Health' },
  { name: 'Gabapentin', category: 'Neurology' },
  { name: 'Levetiracetam', category: 'Neurology' },
  { name: 'Sertraline', category: 'Mental Health' },
  // Pain / Anti-inflammatory
  { name: 'Celecoxib', category: 'Pain' },
  { name: 'Diclofenac', category: 'Pain' },
  { name: 'Ibuprofen', category: 'Pain' },
  { name: 'Paracetamol', category: 'Pain' },
  { name: 'Tramadol', category: 'Pain' },
  // Gastrointestinal
  { name: 'Lactulose', category: 'Gastrointestinal' },
  { name: 'Mesalazine', category: 'Gastrointestinal' },
  { name: 'Omeprazole', category: 'Gastrointestinal' },
  { name: 'Ondansetron', category: 'Gastrointestinal' },
  { name: 'Pantoprazole', category: 'Gastrointestinal' },
  // Antibiotics
  { name: 'Amoxicillin', category: 'Antibiotic' },
  { name: 'Azithromycin', category: 'Antibiotic' },
  { name: 'Ciprofloxacin', category: 'Antibiotic' },
  { name: 'Doxycycline', category: 'Antibiotic' },
  { name: 'Metronidazole', category: 'Antibiotic' },
  // Endocrine / Other
  { name: 'Levothyroxine', category: 'Endocrine' },
  { name: 'Prednisolone', category: 'Endocrine' },
  { name: 'Vitamin D3', category: 'Supplement' },
];

// ── Medication Frequencies ────────────────────

export const MEDICATION_FREQUENCIES: string[] = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Every 48 hours',
  'Once weekly',
  'Twice weekly',
  'Once monthly',
  'As needed (PRN)',
  'Before meals',
  'After meals',
  'At bedtime',
];

// ── Aggregated All Conditions ─────────────────

export const ALL_ALLERGIES: string[] = [
  ...DRUG_ALLERGIES,
  ...FOOD_ALLERGIES,
  ...ENVIRONMENTAL_ALLERGIES,
];

export const ALL_CHRONIC_CONDITIONS: string[] = [
  ...CARDIOVASCULAR_CONDITIONS,
  ...METABOLIC_CONDITIONS,
  ...RESPIRATORY_CONDITIONS,
  ...GASTROINTESTINAL_CONDITIONS,
  ...NEUROLOGICAL_CONDITIONS,
  ...MUSCULOSKELETAL_CONDITIONS,
  ...RENAL_CONDITIONS,
  ...ONCOLOGICAL_CONDITIONS,
];
