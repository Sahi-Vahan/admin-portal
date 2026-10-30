import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  AdminRole,
  AdminBooking,
  AdminSpecialist,
  QualityFlagItem,
  PlatformPricingConfig,
  VehicleCatalogModel,
  FinancialLedgerRow,
  AdminAuditEntry,
  AdminCustomer,
  DetailedInspectionReport,
  FeedbackItem,
} from '../types/admin';

interface AdminContextType {
  currentUser: AdminUser;
  isAuthenticated: boolean;
  login: (role?: AdminRole, email?: string) => void;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  bookings: AdminBooking[];
  specialists: AdminSpecialist[];
  qualityFlags: QualityFlagItem[];
  pricingConfig: PlatformPricingConfig;
  vehicleCatalog: VehicleCatalogModel[];
  financialLedger: FinancialLedgerRow[];
  auditLogs: AdminAuditEntry[];
  customers: AdminCustomer[];
  reports: DetailedInspectionReport[];
  adminUsers: AdminUser[];
  feedbacks: FeedbackItem[];

  // Admin User & RBAC Management
  createAdminUser: (userData: Omit<AdminUser, 'id' | 'createdAt'>) => AdminUser;
  updateAdminUserStatus: (id: string, status: 'active' | 'inactive') => void;
  updateAdminUserRole: (id: string, role: AdminRole) => void;
  deleteAdminUser: (id: string) => void;

  // Feedback & CSAT Management
  createFeedback: (feedback: Omit<FeedbackItem, 'id' | 'createdAt'>) => void;
  updateFeedbackStatus: (id: string, status: FeedbackItem['status'], notes?: string, resolutionReply?: string) => void;
  convertFeedbackToQualityFlag: (feedbackId: string, flagDetails?: Partial<QualityFlagItem>) => void;

  // Customer Actions
  getCustomerById: (id: string) => AdminCustomer | undefined;
  addCustomerNote: (customerId: string, note: string) => void;
  createCustomer: (customerData: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    status?: 'active' | 'vip';
    notes?: string;
  }) => AdminCustomer;

  // Specialist Creation
  createSpecialist: (specialistData: {
    name: string;
    badge: string;
    phone: string;
    email: string;
    city: string;
    zones: string[];
    licenseNumber: string;
    tools?: string[];
    bankName: string;
    accountNumber: string;
    ifsc: string;
    status?: 'active' | 'pending_verification';
  }) => AdminSpecialist;

  // Report Actions
  getReportByBookingRef: (ref: string) => DetailedInspectionReport | undefined;
  createOrUpdateReport: (report: DetailedInspectionReport) => void;

  // Operational Actions
  assignSpecialist: (bookingId: string, specialistId: string) => void;
  reassignSpecialist: (bookingId: string, newSpecialistId: string, reason: string) => void;
  cancelBooking: (bookingId: string, reason: string, refundAmount: number) => void;
  
  // Specialist Management Actions
  verifySpecialistDoc: (specialistId: string, docKey: 'aadhaar' | 'policeClearance' | 'license' | 'certifications', status: 'verified' | 'rejected') => void;
  updateSpecialistStatus: (specialistId: string, status: 'active' | 'suspended' | 'pending_verification') => void;

  // Quality & Dispute Actions
  resolveQualityFlag: (flagId: string, decision: 'correction_issued' | 'resolved_valid' | 'dismissed', notes: string, holdPayout: boolean) => void;
  
  // Finance & Payout Actions
  releasePayoutEarly: (bookingRef: string) => void;
  processRefundDecision: (bookingId: string, approve: boolean, note: string) => void;

  // Configuration Actions
  updatePricingConfig: (newConfig: Partial<PlatformPricingConfig>) => void;
  toggleVehicleCatalogItem: (modelId: string) => void;
  addVehicleCatalogItem: (item: Omit<VehicleCatalogModel, 'id'>) => void;
}

const DEFAULT_ADMIN: AdminUser = {
  id: 'adm-01',
  name: 'Vikram Sengupta',
  email: 'vikram.s@sahivahan.com',
  role: 'super_admin',
  department: 'Executive Leadership & Ops',
  phone: '+91 98450 11001',
  status: 'active',
  lastLogin: 'Just now',
  createdAt: '2025-01-10',
  permissions: ['all_access', 'pricing_edit', 'specialist_kyc', 'dispute_arbitration', 'refund_payout'],
};

const INITIAL_ADMIN_USERS: AdminUser[] = [
  DEFAULT_ADMIN,
  {
    id: 'adm-02',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@sahivahan.com',
    role: 'operations',
    department: 'Central Dispatch Hub',
    phone: '+91 98112 44332',
    status: 'active',
    lastLogin: '15 mins ago',
    createdAt: '2025-02-15',
    permissions: ['dispatch_assign', 'specialist_roster', 'booking_manage', 'customer_notes'],
  },
  {
    id: 'adm-03',
    name: 'Suresh Menon',
    email: 'suresh.m@sahivahan.com',
    role: 'quality_reviewer',
    department: 'Inspection Standards & QA',
    phone: '+91 97410 77889',
    status: 'active',
    lastLogin: '1 hour ago',
    createdAt: '2025-03-01',
    permissions: ['qa_flags_review', 'report_audit', 'specialist_accuracy', 'checklist_standards'],
  },
  {
    id: 'adm-04',
    name: 'Pooja Iyer',
    email: 'pooja.i@sahivahan.com',
    role: 'finance_controller',
    department: 'Finance & Escrow Settlements',
    phone: '+91 99002 88771',
    status: 'active',
    lastLogin: 'Yesterday',
    createdAt: '2025-03-12',
    permissions: ['payout_approval', 'refund_settle', 'bank_verification', 'ledger_audit'],
  },
];

const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'FB-101',
    type: 'customer_review',
    source: 'customer',
    userName: 'Rohan Sharma',
    userPhone: '+91 97410 88765',
    userEmail: 'rohan.s@gmail.com',
    bookingRef: 'SV-2026-8901',
    specialistName: 'Rajesh Verma (SV-SPEC-704)',
    rating: 5,
    category: 'inspection_quality',
    title: 'Detected hidden quarter panel repaint and clearcoat blend',
    message: 'Rajesh arrived sharp at 09:00 AM in Koramangala. His digital paint meter immediately found that the left rear door was repainted (220 microns vs 95 microns OEM). Saved me from paying 1.5 lakhs over market value. Report delivered within 25 minutes.',
    createdAt: '2026-10-14T11:45:00Z',
    status: 'acknowledged',
    internalNotes: 'Exemplary report turnaround and clear photographic proof.',
    resolutionReply: 'Thank you Rohan! We are thrilled Rajesh provided you with actionable inspection clarity.',
  },
  {
    id: 'FB-102',
    type: 'customer_review',
    source: 'customer',
    userName: 'Priya Sundaram',
    userPhone: '+91 96112 33441',
    userEmail: 'priya.s@yahoo.com',
    bookingRef: 'SV-2026-8850',
    specialistName: 'Kishore Kumar (SV-SPEC-811)',
    rating: 2,
    category: 'seller_issue',
    title: 'Seller refused cold engine start and delayed test drive',
    message: 'The seller at Jayanagar delayed Kishore for 45 minutes and refused to let him test drive on the main road. Kishore handled it politely and flagged this in the report notes.',
    createdAt: '2026-10-13T16:20:00Z',
    status: 'converted_to_flag',
    internalNotes: 'Converted into formal QA Flag QF-001 (Incomplete Cold Start Inspection) to protect customer and specialist.',
    resolutionReply: 'Automated QA hold applied to protect your booking. We are reviewing seller restrictions with our ops desk.',
  },
  {
    id: 'FB-103',
    type: 'specialist_feedback',
    source: 'specialist',
    userName: 'Rajesh Verma',
    userPhone: '+91 98220 11223',
    userEmail: 'rajesh.v@sahivahan.com',
    bookingRef: 'SV-2026-9041',
    category: 'seller_issue',
    title: 'Basement parking lot had zero network coverage',
    message: 'Inspection location in Indiranagar was in B2 basement with no cellular signal. Had to capture all 200 checkpoints in offline cache mode and upload when stepping outside. The offline cache worked smoothly.',
    createdAt: '2026-10-15T15:30:00Z',
    status: 'acknowledged',
    internalNotes: 'Validated offline syncing in mobile terminal. No data loss reported.',
  },
  {
    id: 'FB-104',
    type: 'app_bug_report',
    source: 'platform',
    userName: 'Arjun Das',
    userPhone: '+91 98450 66778',
    category: 'app_bug',
    title: 'Camera shutter lag when clicking high-res tyre tread depth macro shots',
    message: 'When capturing close up photo of front tyre tread depth on Android Chrome, there was a 2-second shutter delay. Please optimize image compression pipeline.',
    createdAt: '2026-10-15T14:10:00Z',
    status: 'pending',
    internalNotes: 'Under review by tech team. High priority mobile canvas optimization.',
  },
  {
    id: 'FB-105',
    type: 'customer_review',
    source: 'customer',
    userName: 'Aditya Narayan',
    userPhone: '+91 98450 44321',
    userEmail: 'aditya.n@gmail.com',
    bookingRef: 'SV-2026-9041',
    specialistName: 'Rajesh Verma (SV-SPEC-704)',
    rating: 5,
    category: 'specialist_behavior',
    title: 'Exceptional EV battery diagnostic evaluation',
    message: 'Extremely polite technician. Explained EV high-voltage insulation tests clearly and verified OBD-II battery state of health (SoH at 96.2%). Top-tier service.',
    createdAt: '2026-10-15T17:00:00Z',
    status: 'resolved',
    resolutionReply: 'Delighted to hear! We take immense pride in our certified electric vehicle inspection protocols.',
  },
];

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'CUST-101',
    name: 'Aditya Narayan',
    phone: '+91 98450 44321',
    email: 'aditya.n@gmail.com',
    city: 'Bengaluru',
    address: 'Villa #18, Defence Colony, Indiranagar',
    totalBookings: 2,
    lifetimeSpend: 5895.28,
    activeBookingsCount: 1,
    lastBookingDate: '2026-10-15',
    registeredDate: '2025-11-12',
    status: 'vip',
    notes: 'Premium buyer evaluating multiple electric SUVs. Prefers morning inspection slots.',
    bookingRefs: ['SV-2026-9041'],
  },
  {
    id: 'CUST-102',
    name: 'Sneha Kulkarni',
    phone: '+91 99001 22334',
    email: 'sneha.k@outlook.com',
    city: 'Bengaluru',
    address: 'Flat 402, Tower 3, Prestige Palms, Whitefield',
    totalBookings: 1,
    lifetimeSpend: 3744.14,
    activeBookingsCount: 1,
    lastBookingDate: '2026-10-15',
    registeredDate: '2026-09-01',
    status: 'active',
    notes: 'Requested expedited specialist dispatch for dealer vehicle in Whitefield.',
    bookingRefs: ['SV-2026-9042'],
  },
  {
    id: 'CUST-103',
    name: 'Rohan Sharma',
    phone: '+91 97410 88765',
    email: 'rohan.s@gmail.com',
    city: 'Bengaluru',
    address: '#88, 80ft Road, Koramangala',
    totalBookings: 3,
    lifetimeSpend: 8842.92,
    activeBookingsCount: 0,
    lastBookingDate: '2026-10-14',
    registeredDate: '2025-06-20',
    status: 'vip',
    notes: 'Frequent used car investor. Highly satisfied with specialist Rajesh Verma (5-star rating given).',
    bookingRefs: ['SV-2026-8901'],
  },
  {
    id: 'CUST-104',
    name: 'Priya Sundaram',
    phone: '+91 96112 33441',
    email: 'priya.s@yahoo.com',
    city: 'Bengaluru',
    address: '#12, 11th Main, Jayanagar 4th T Block',
    totalBookings: 1,
    lifetimeSpend: 1178.82,
    activeBookingsCount: 0,
    lastBookingDate: '2026-10-13',
    registeredDate: '2026-10-10',
    status: 'active',
    notes: 'First-time bike buyer. Report currently in QA triage.',
    bookingRefs: ['SV-2026-8850'],
  },
  {
    id: 'CUST-105',
    name: 'Mr. XXXX (Kozhikode Client)',
    phone: '+91 83308 81213',
    email: 'client.xxxx@sureshdrives.com',
    city: 'Kozhikode',
    address: 'The Work Book, Ground Floor, HiLITE Business Park, Kozhikode, Kerala',
    totalBookings: 1,
    lifetimeSpend: 2947.64,
    activeBookingsCount: 0,
    lastBookingDate: '2025-09-11',
    registeredDate: '2025-09-01',
    status: 'active',
    notes: 'Inspection for Kia Carnival 2020. Accident and total loss structural damage detected in rear right section.',
    bookingRefs: ['SV-2025-KIA-7712'],
  },
];

const INITIAL_REPORTS: DetailedInspectionReport[] = [
  {
    id: 'RPT-KIA-7712',
    bookingRef: 'SV-2025-KIA-7712',
    dateOfInspection: '11-09-2025',
    customerName: 'Mr. XXXX',
    customerPhone: '+91 83308 81213',
    vehicle: 'KIA CARNIVAL',
    registrationNumber: 'KL 05 AW XXXX',
    dateOfRegistration: '11-09-2025',
    modelYear: 2020,
    chassisNumber: 'MZBMC81AMLN0XXXXX',
    engineNumber: '*****',
    kilometersAtInspection: 59353,
    healthScore: 52,
    recommendation: 'Walk Away / High Risk (Prior Major Accident)',
    interiorCondition: [
      { item: 'Door Panels', condition: 'B', notes: 'Damage on right slide door trim' },
      { item: 'Dash Pad', condition: 'G' },
      { item: 'Glove Box', condition: 'G' },
      { item: 'AC Cooling Performance & Heater Operations', condition: 'G' },
      { item: 'Cigarette Lighter', condition: 'N' },
      { item: 'Vanity Mirrors & Sun visors', condition: 'G' },
      { item: 'Hand brake lever / buttons', condition: 'G' },
      { item: 'Control buttons & levers', condition: 'G' },
      { item: 'Hood Release', condition: 'G' },
    ],
    gaugesAndAudio: [
      { item: 'Speedometer', condition: 'G' },
      { item: 'Tachometer', condition: 'G' },
      { item: 'Temperature', condition: 'G' },
      { item: 'Oil Pressure', condition: 'G' },
      { item: 'Warning Messages & Symbols', condition: 'G' },
      { item: 'Audio System & Speakers', condition: 'G' },
      { item: 'Navigation System', condition: 'N' },
      { item: 'Keyless Entry / Ignition system', condition: 'G' },
    ],
    carpetAndTrunk: [
      { item: 'Front Seats', condition: 'B', notes: 'Front driver airbag burst/canceled' },
      { item: 'Front Carpeting', condition: 'G' },
      { item: 'Headliner & Head rests', condition: 'G' },
      { item: 'Rear Seats', condition: 'G' },
      { item: 'Rear Carpeting', condition: 'G' },
      { item: 'Trunk Carpeting', condition: 'G' },
      { item: 'Tools', condition: 'G' },
      { item: 'Jack', condition: 'G' },
      { item: 'Spare Tire', condition: 'G' },
      { item: 'Floor Pan', condition: 'B', notes: 'Floor panel near right door cracked' },
    ],
    electricalSystem: [
      { item: 'Head Lights', condition: 'G' },
      { item: 'Tail Lights', condition: 'G' },
      { item: 'Brake Lights', condition: 'G' },
      { item: 'Parking Lights', condition: 'G' },
      { item: 'Turn Signals', condition: 'G' },
      { item: 'Electric Seats', condition: 'G' },
      { item: 'Sunroof Motors', condition: 'G' },
      { item: 'Power Window', condition: 'G' },
      { item: 'Blinds', condition: 'N' },
      { item: 'ORVM Electric Mirrors', condition: 'G' },
    ],
    underTheHood: [
      { item: 'Fluids Condition', condition: 'B', notes: 'Brake fluid dark & coolant overdue' },
      { item: 'Oil Leaks', condition: 'N' },
      { item: 'Coolant Leaks', condition: 'N' },
      { item: 'Drive Belts/Timing Belts', condition: 'G' },
      { item: 'Engine Mountings', condition: 'G' },
      { item: 'Steering Components', condition: 'G' },
      { item: 'Turbo', condition: 'G' },
      { item: 'All Rubber Boots/Gaiters', condition: 'G' },
      { item: 'Rat Bites', condition: 'N' },
      { item: 'Looped Wires', condition: 'N' },
      { item: 'Exhaust Leaks', condition: 'N' },
      { item: 'Exhaust Smoke', condition: 'G' },
      { item: 'Evidence of Smoke', condition: 'N' },
      { item: 'Abnormal Noise', condition: 'N' },
    ],
    underTheCar: [
      { item: 'Drive Line', condition: 'G' },
      { item: 'Differential', condition: 'G' },
      { item: 'Under Body', condition: 'G' },
      { item: 'Exhaust', condition: 'G' },
    ],
    roadTest: [
      { item: 'Idle', condition: 'G' },
      { item: 'Engine Starting', condition: 'G' },
      { item: 'Acceleration', condition: 'G' },
      { item: 'Tyre Condition', condition: 'B', notes: 'Rear tires worn out' },
      { item: 'Engine Noise', condition: 'G' },
      { item: 'Steering Effort - Cornering Right or Left', condition: 'G' },
      { item: 'Engine Operating Temperature', condition: 'G' },
      { item: 'Transmission Shift Quality, Smoothness, Effort, Slippage', condition: 'G' },
      { item: 'Transmission/Transaxle Noise', condition: 'G' },
      { item: 'CV Joint/Drive Axle Noise', condition: 'G' },
      { item: 'Parking Brake Operation', condition: 'G' },
      { item: 'Engine Performance', condition: 'G' },
      { item: 'Cooling System Efficiency', condition: 'G' },
    ],
    finalInspectionSummary: [
      { item: 'Body Condition', condition: 'B' },
      { item: 'Engine Condition', condition: 'G' },
      { item: 'Cooling Condition', condition: 'G' },
      { item: 'Interior Items', condition: 'G' },
      { item: 'Gauges', condition: 'B' },
      { item: 'Audio System', condition: 'G' },
      { item: 'Carpet & Upholstery', condition: 'B' },
      { item: 'Under the Hood', condition: 'G' },
      { item: 'Under the Car', condition: 'G' },
      { item: 'Electrical System', condition: 'G' },
      { item: 'Battery Condition', condition: 'G' },
      { item: 'Glass', condition: 'G' },
      { item: 'Trunk', condition: 'G' },
      { item: 'Tires & Wheels', condition: 'B' },
      { item: 'Car Scanning Report', condition: 'G' },
      { item: 'Road Test', condition: 'N' },
    ],
    brakesCheck: {
      noise: true,
      vibration: false,
      effort: false,
    },
    suspensionCheck: {
      ok: false,
      noise: false,
      rough: false,
      weak: true,
    },
    comments: [
      "NOTE: *Please cross-check this inspection report with the vehicle's service history and insurance claim records before purchasing. This report reflects the vehicle's condition at the time of inspection and does not guarantee future performance.*",
      "* While checking the vehicle, it was found that an accident(major/total loss) had occurred on the rear right side and as a result, repair work had been carried out on this area.",
      "* It appears that the front driver's seat airbag and rear curtain airbag have been canceled, and the front left seat airbag has burst and been folded inward.",
      "* There is repaint with dent works in many parts of the body, the right side slide door has been replaced, and the wind shield glass has been replaced.",
      "* The glass in the cluster is missing, and the driver's door pasting was done a second time.",
      "* The right side slide door opening and closing is not working properly.",
      "* The floor panel near the right door is cracked.",
      "* Service is overdue, and it's time to replace the rear tires.",
      "* At the customer's request, the vehicle inspection was stopped and the remaining checks were waived.",
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    ],
    technicianName: 'Ebin Raju',
    teamLeaderName: 'Ebenezer Raju (Team Leader)',
    qualityVerified: true,
    version: 1,
    createdAt: '2025-09-11T14:30:00.000Z',
  },
  {
    id: 'RPT-CRETA-8901',
    bookingRef: 'SV-2026-8901',
    dateOfInspection: '14-10-2026',
    customerName: 'Rohan Sharma',
    customerPhone: '+91 97410 88765',
    vehicle: 'Hyundai Creta 1.5 Turbo Petrol SX(O) DCT',
    registrationNumber: 'KA 03 MX 4921',
    dateOfRegistration: '20-08-2021',
    modelYear: 2021,
    chassisNumber: 'MALC1819NKM09281',
    engineNumber: 'G4LDM7712',
    kilometersAtInspection: 34820,
    healthScore: 84,
    recommendation: 'Fair Deal with Minor Repairs',
    interiorCondition: [
      { item: 'Door Panels', condition: 'G' },
      { item: 'Dash Pad', condition: 'E' },
      { item: 'Glove Box', condition: 'G' },
      { item: 'AC Cooling Performance & Heater Operations', condition: 'E' },
      { item: 'Cigarette Lighter', condition: 'G' },
      { item: 'Vanity Mirrors & Sun visors', condition: 'E' },
      { item: 'Hand brake lever / buttons', condition: 'G' },
      { item: 'Control buttons & levers', condition: 'G' },
      { item: 'Hood Release', condition: 'G' },
    ],
    gaugesAndAudio: [
      { item: 'Speedometer', condition: 'E' },
      { item: 'Tachometer', condition: 'E' },
      { item: 'Temperature', condition: 'E' },
      { item: 'Oil Pressure', condition: 'E' },
      { item: 'Warning Messages & Symbols', condition: 'G' },
      { item: 'Audio System & Speakers', condition: 'E' },
      { item: 'Navigation System', condition: 'E' },
      { item: 'Keyless Entry / Ignition system', condition: 'E' },
    ],
    carpetAndTrunk: [
      { item: 'Front Seats', condition: 'G' },
      { item: 'Front Carpeting', condition: 'G' },
      { item: 'Headliner & Head rests', condition: 'E' },
      { item: 'Rear Seats', condition: 'E' },
      { item: 'Rear Carpeting', condition: 'G' },
      { item: 'Trunk Carpeting', condition: 'G' },
      { item: 'Tools', condition: 'G' },
      { item: 'Jack', condition: 'G' },
      { item: 'Spare Tire', condition: 'G' },
      { item: 'Floor Pan', condition: 'E' },
    ],
    electricalSystem: [
      { item: 'Head Lights', condition: 'E' },
      { item: 'Tail Lights', condition: 'E' },
      { item: 'Brake Lights', condition: 'E' },
      { item: 'Parking Lights', condition: 'E' },
      { item: 'Turn Signals', condition: 'E' },
      { item: 'Electric Seats', condition: 'E' },
      { item: 'Sunroof Motors', condition: 'E' },
      { item: 'Power Window', condition: 'E' },
      { item: 'Blinds', condition: 'G' },
      { item: 'ORVM Electric Mirrors', condition: 'E' },
    ],
    underTheHood: [
      { item: 'Fluids Condition', condition: 'G' },
      { item: 'Oil Leaks', condition: 'E' },
      { item: 'Coolant Leaks', condition: 'G', notes: 'Slight dried coolant residue near thermostat' },
      { item: 'Drive Belts/Timing Belts', condition: 'E' },
      { item: 'Engine Mountings', condition: 'G' },
      { item: 'Steering Components', condition: 'E' },
      { item: 'Turbo', condition: 'E' },
      { item: 'All Rubber Boots/Gaiters', condition: 'G' },
      { item: 'Rat Bites', condition: 'E' },
      { item: 'Looped Wires', condition: 'E' },
      { item: 'Exhaust Leaks', condition: 'E' },
      { item: 'Exhaust Smoke', condition: 'E' },
      { item: 'Evidence of Smoke', condition: 'E' },
      { item: 'Abnormal Noise', condition: 'E' },
    ],
    underTheCar: [
      { item: 'Drive Line', condition: 'E' },
      { item: 'Differential', condition: 'E' },
      { item: 'Under Body', condition: 'E' },
      { item: 'Exhaust', condition: 'E' },
    ],
    roadTest: [
      { item: 'Idle', condition: 'E' },
      { item: 'Engine Starting', condition: 'E' },
      { item: 'Acceleration', condition: 'E' },
      { item: 'Tyre Condition', condition: 'G', notes: '5.2mm remaining tread' },
      { item: 'Engine Noise', condition: 'E' },
      { item: 'Steering Effort - Cornering Right or Left', condition: 'E' },
      { item: 'Engine Operating Temperature', condition: 'E' },
      { item: 'Transmission Shift Quality, Smoothness, Effort, Slippage', condition: 'E' },
      { item: 'Transmission/Transaxle Noise', condition: 'E' },
      { item: 'CV Joint/Drive Axle Noise', condition: 'E' },
      { item: 'Parking Brake Operation', condition: 'E' },
      { item: 'Engine Performance', condition: 'E' },
      { item: 'Cooling System Efficiency', condition: 'E' },
    ],
    finalInspectionSummary: [
      { item: 'Body Condition', condition: 'G' },
      { item: 'Engine Condition', condition: 'E' },
      { item: 'Cooling Condition', condition: 'G' },
      { item: 'Interior Items', condition: 'E' },
      { item: 'Gauges', condition: 'E' },
      { item: 'Audio System', condition: 'E' },
      { item: 'Carpet & Upholstery', condition: 'E' },
      { item: 'Under the Hood', condition: 'G' },
      { item: 'Under the Car', condition: 'E' },
      { item: 'Electrical System', condition: 'E' },
      { item: 'Battery Condition', condition: 'E' },
      { item: 'Glass', condition: 'E' },
      { item: 'Trunk', condition: 'G' },
      { item: 'Tires & Wheels', condition: 'G' },
      { item: 'Car Scanning Report', condition: 'G' },
      { item: 'Road Test', condition: 'E' },
    ],
    brakesCheck: {
      noise: false,
      vibration: false,
      effort: false,
    },
    suspensionCheck: {
      ok: true,
      noise: false,
      rough: false,
      weak: false,
    },
    comments: [
      "* Chassis structural integrity confirmed intact with factory spot welds along A, B, C pillars and front crossmember.",
      "* OBD-II computer diagnostic scan showed intermittent P0141 secondary oxygen sensor heater code; reset and did not reoccur during 15-minute road test.",
      "* Digital paint gauge confirmed factory paint thickness across 85% of panels (95-115 µm). Left rear passenger door shows repaint blend (180-220 µm) with no filler.",
      "* Front brake pads worn to ~2.5mm; replacement recommended within 2,500 km.",
      "* Vehicle recommended as Fair Deal with minor negotiation for brake pads.",
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    ],
    technicianName: 'Rajesh Verma (SV-SPEC-704)',
    teamLeaderName: 'Vikram Sengupta (Admin)',
    qualityVerified: true,
    version: 1,
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_BOOKINGS: AdminBooking[] = [
  {
    id: 'BK-2026-9041',
    bookingRef: 'SV-2026-9041',
    customer: {
      name: 'Aditya Narayan',
      phone: '+91 98450 44321',
      email: 'aditya.n@gmail.com',
    },
    vehicle: {
      type: 'car',
      make: 'Tata Motors',
      model: 'Nexon',
      variant: 'EV Long Range Empowered+',
      year: 2023,
      fuel: 'Electric',
      transmission: 'Automatic',
      registrationNumber: 'KA 05 NV 1809',
      complexity: 'complex',
    },
    location: {
      city: 'Bengaluru',
      area: 'Indiranagar Defence Colony',
      address: 'Villa #18, Defence Colony, Indiranagar',
      pincode: '560038',
      sellerName: 'Pradeep Rao',
      sellerPhone: '+91 94480 33445',
      sellerRelationship: 'owner',
      askingPrice: 850000,
    },
    appointment: {
      date: new Date().toISOString().split('T')[0],
      window: '11:30 AM - 01:30 PM',
    },
    pricing: {
      baseFee: 1999,
      complexitySurcharge: 499,
      travelFee: 0,
      subtotal: 2498,
      gst18: 449.64,
      total: 2947.64,
    },
    status: 'assigned',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    assignedSpecialistId: 'sp-101',
    assignedSpecialistName: 'Rajesh Verma (SV-SPEC-704)',
    assignedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK-2026-9042',
    bookingRef: 'SV-2026-9042',
    customer: {
      name: 'Sneha Kulkarni',
      phone: '+91 99001 22334',
      email: 'sneha.k@outlook.com',
    },
    vehicle: {
      type: 'car',
      make: 'Mahindra',
      model: 'XUV700',
      variant: 'AX7 Luxury Pack Diesel AT AWD',
      year: 2022,
      fuel: 'Diesel',
      transmission: 'Automatic',
      registrationNumber: 'KA 01 MR 7701',
      complexity: 'luxury_or_specialist',
    },
    location: {
      city: 'Bengaluru',
      area: 'Whitefield Prestige Palms',
      address: 'Flat 402, Tower 3, Prestige Palms, Whitefield',
      pincode: '560066',
      sellerName: 'Anil Desai',
      sellerPhone: '+91 98800 11992',
      sellerRelationship: 'dealer',
      askingPrice: 2150000,
    },
    appointment: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      window: '10:00 AM - 12:00 PM',
    },
    pricing: {
      baseFee: 1999,
      complexitySurcharge: 999,
      travelFee: 175,
      subtotal: 3173,
      gst18: 571.14,
      total: 3744.14,
    },
    status: 'paid', // UNASSIGNED - SLA ACTION REQUIRED
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK-2026-8901',
    bookingRef: 'SV-2026-8901',
    customer: {
      name: 'Rohan Sharma',
      phone: '+91 97410 88765',
      email: 'rohan.s@gmail.com',
    },
    vehicle: {
      type: 'car',
      make: 'Hyundai',
      model: 'Creta',
      variant: '1.5 Turbo Petrol SX(O) DCT',
      year: 2021,
      fuel: 'Petrol',
      transmission: 'DCT/DSG',
      registrationNumber: 'KA 03 MX 4921',
      complexity: 'complex',
    },
    location: {
      city: 'Bengaluru',
      area: 'Koramangala 4th Block',
      address: '#88, 80ft Road, Koramangala',
      pincode: '560034',
      sellerName: 'Suresh Kumar',
      sellerPhone: '+91 98860 99887',
      sellerRelationship: 'owner',
      askingPrice: 1180000,
    },
    appointment: {
      date: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString().split('T')[0],
      window: '09:00 AM - 11:00 AM',
    },
    pricing: {
      baseFee: 1999,
      complexitySurcharge: 499,
      travelFee: 0,
      subtotal: 2498,
      gst18: 449.64,
      total: 2947.64,
    },
    status: 'submitted',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    assignedSpecialistId: 'sp-101',
    assignedSpecialistName: 'Rajesh Verma (SV-SPEC-704)',
    reportVersion: 1,
    reportHealthScore: 84,
    reportSubmittedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    payoutEligibilityAt: new Date(Date.now() + 34 * 60 * 60 * 1000).toISOString(),
    hasQualityFlag: false,
    visitEvidence: {
      specialistPhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      numberPlatePhotoUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
      odometerPhotoUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
      odometerKm: 34820,
      gpsCoords: '12.9121° N, 77.6446° E',
      arrivedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'BK-2026-8850',
    bookingRef: 'SV-2026-8850',
    customer: {
      name: 'Priya Sundaram',
      phone: '+91 96112 33441',
      email: 'priya.s@yahoo.com',
    },
    vehicle: {
      type: 'bike',
      make: 'Royal Enfield',
      model: 'Hunter 350',
      variant: 'Dapper Ash',
      year: 2022,
      fuel: 'Petrol',
      transmission: 'Manual',
      registrationNumber: 'KA 04 KJ 9921',
      complexity: 'standard',
    },
    location: {
      city: 'Bengaluru',
      area: 'Jayanagar 4th Block',
      address: '#12, 11th Main, Jayanagar 4th T Block',
      pincode: '560041',
      sellerName: 'Manoj Gowda',
      sellerPhone: '+91 98440 22119',
      sellerRelationship: 'owner',
      askingPrice: 420000,
    },
    appointment: {
      date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString().split('T')[0],
      window: '03:00 PM - 05:00 PM',
    },
    pricing: {
      baseFee: 999,
      complexitySurcharge: 0,
      travelFee: 0,
      subtotal: 999,
      gst18: 179.82,
      total: 1178.82,
    },
    status: 'submitted',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    assignedSpecialistId: 'sp-103',
    assignedSpecialistName: 'Kishore Kumar (SV-SPEC-811)',
    reportVersion: 1,
    reportHealthScore: 68,
    reportSubmittedAt: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(),
    payoutEligibilityAt: new Date(Date.now() + 13 * 60 * 60 * 1000).toISOString(),
    hasQualityFlag: true, // FLAG QUEUE ACTIVE
  },
  {
    id: 'BK-2025-KIA-7712',
    bookingRef: 'SV-2025-KIA-7712',
    customer: {
      name: 'Mr. XXXX',
      phone: '+91 83308 81213',
      email: 'client.xxxx@sureshdrives.com',
    },
    vehicle: {
      type: 'car',
      make: 'Kia',
      model: 'Carnival',
      variant: '2.2 Diesel Limousine',
      year: 2020,
      fuel: 'Diesel',
      transmission: 'Automatic',
      registrationNumber: 'KL 05 AW XXXX',
      complexity: 'luxury_or_specialist',
    },
    location: {
      city: 'Kozhikode',
      area: 'HiLITE Business Park',
      address: 'The Work Book, Ground Floor, HiLITE Business Park',
      pincode: '673014',
      sellerName: 'Used Car Premium Hub',
      sellerPhone: '+91 83308 81213',
      sellerRelationship: 'dealer',
      askingPrice: 2850000,
    },
    appointment: {
      date: '2025-09-11',
      window: '10:00 AM - 12:00 PM',
    },
    pricing: {
      baseFee: 1999,
      complexitySurcharge: 999,
      travelFee: 0,
      subtotal: 2998,
      gst18: 539.64,
      total: 3537.64,
    },
    status: 'submitted',
    createdAt: '2025-09-10T09:00:00.000Z',
    assignedSpecialistId: 'sp-101',
    assignedSpecialistName: 'Ebin Raju (SV-SPEC-602)',
    reportVersion: 1,
    reportHealthScore: 52,
    reportSubmittedAt: '2025-09-11T14:30:00.000Z',
    hasQualityFlag: false,
  },
];

const INITIAL_SPECIALISTS: AdminSpecialist[] = [
  {
    id: 'sp-101',
    name: 'Rajesh Verma',
    badge: 'SV-SPEC-704',
    phone: '+91 98450 11223',
    email: 'rajesh.verma@specialist.sahivahan.com',
    city: 'Bengaluru',
    zones: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Bellandur'],
    rating: 4.94,
    completedJobsCount: 482,
    disputeCount: 1,
    status: 'active',
    joinedDate: '2024-03-15',
    documents: {
      aadhaar: { status: 'verified', ref: '•••• 4910', verifiedAt: '2024-03-15' },
      policeClearance: { status: 'verified', expiry: '2027-10-14' },
      license: { status: 'verified', number: 'DL-04-201100294' },
      certifications: { status: 'verified', title: 'ASDC Master Vehicle Technician', issuer: 'ASDC India' },
    },
    tools: [
      { name: 'Launch X431 V+ OBD-II Scanner', serial: 'SN-99824-OBD', status: 'calibrated' },
      { name: 'Elcometer 456 Paint Meter', serial: 'ELC-456-781', status: 'calibrated' },
      { name: 'Brake Fluid Boiling Point Tester', serial: 'BF-TEST-301', status: 'calibrated' },
    ],
    bankDetails: {
      bankName: 'HDFC Bank Ltd',
      accountMasked: '•••• •••• 9821',
      ifsc: 'HDFC0000240',
      accountHolder: 'Rajesh Verma',
      isVerified: true,
    },
    wallet: {
      pending: 3400,
      available: 6850,
      lifetimeEarnings: 41350,
    },
  },
  {
    id: 'sp-102',
    name: 'Arjun Das',
    badge: 'SV-SPEC-712',
    phone: '+91 97420 55667',
    email: 'arjun.das@specialist.sahivahan.com',
    city: 'Bengaluru',
    zones: ['Whitefield', 'Marathahalli', 'KR Puram'],
    rating: 4.86,
    completedJobsCount: 219,
    disputeCount: 2,
    status: 'active',
    joinedDate: '2024-08-20',
    documents: {
      aadhaar: { status: 'verified', ref: '•••• 8812', verifiedAt: '2024-08-20' },
      policeClearance: { status: 'verified', expiry: '2026-12-31' },
      license: { status: 'verified', number: 'DL-03-201509182' },
      certifications: { status: 'verified', title: 'Bosch Fuel Injection & Sensor Specialist', issuer: 'Bosch Training' },
    },
    tools: [
      { name: 'Autel MaxiCOM MK808 OBD-II', serial: 'AT-808-112', status: 'calibrated' },
      { name: 'Digital Paint Gauge', serial: 'PG-992-01', status: 'calibrated' },
    ],
    bankDetails: {
      bankName: 'ICICI Bank',
      accountMasked: '•••• •••• 4410',
      ifsc: 'ICIC0000047',
      accountHolder: 'Arjun Das',
      isVerified: true,
    },
    wallet: {
      pending: 1750,
      available: 3500,
      lifetimeEarnings: 28400,
    },
  },
  {
    id: 'sp-103',
    name: 'Kishore Kumar',
    badge: 'SV-SPEC-811',
    phone: '+91 98801 33449',
    email: 'kishore.k@specialist.sahivahan.com',
    city: 'Bengaluru',
    zones: ['Jayanagar', 'JP Nagar', 'Banashankari'],
    rating: 4.62,
    completedJobsCount: 145,
    disputeCount: 3,
    status: 'active',
    joinedDate: '2025-01-10',
    documents: {
      aadhaar: { status: 'verified', ref: '•••• 1209' },
      policeClearance: { status: 'verified', expiry: '2027-01-15' },
      license: { status: 'verified', number: 'DL-05-201887123' },
      certifications: { status: 'verified', title: 'Two-Wheeler Diagnostic Cert', issuer: 'TVS Academy' },
    },
    tools: [
      { name: 'OBD-II Bike Transducer', serial: 'BK-OBD-09', status: 'calibrated' },
    ],
    bankDetails: {
      bankName: 'Axis Bank',
      accountMasked: '•••• •••• 1184',
      ifsc: 'UTIB0000122',
      accountHolder: 'Kishore Kumar',
      isVerified: true,
    },
    wallet: {
      pending: 750,
      available: 1500,
      lifetimeEarnings: 14250,
    },
  },
  {
    id: 'sp-104',
    name: 'Sandeep Patil',
    badge: 'SV-SPEC-PENDING',
    phone: '+91 98223 77881',
    email: 'sandeep.p@gmail.com',
    city: 'Bengaluru',
    zones: ['Hebbal', 'Yelahanka', 'Malleshwaram'],
    rating: 0,
    completedJobsCount: 0,
    disputeCount: 0,
    status: 'pending_verification',
    joinedDate: '2026-10-14',
    documents: {
      aadhaar: { status: 'pending', ref: '•••• 3390' },
      policeClearance: { status: 'pending', expiry: '2027-09-30' },
      license: { status: 'pending', number: 'DL-02-201600129' },
      certifications: { status: 'verified', title: 'Hyundai Certified Diagnostic Tech', issuer: 'Hyundai Motor India' },
    },
    tools: [
      { name: 'Launch ThinkTool Pro', serial: 'TT-771-09', status: 'pending_check' },
    ],
    bankDetails: {
      bankName: 'State Bank of India',
      accountMasked: '•••• •••• 7741',
      ifsc: 'SBIN0000843',
      accountHolder: 'Sandeep Patil',
      isVerified: false,
    },
    wallet: {
      pending: 0,
      available: 0,
      lifetimeEarnings: 0,
    },
  },
];

const INITIAL_FLAGS: QualityFlagItem[] = [
  {
    id: 'FLG-2026-081',
    bookingRef: 'SV-2026-8850',
    bookingId: 'BK-2026-8850',
    specialistId: 'sp-103',
    specialistName: 'Kishore Kumar (SV-SPEC-811)',
    vehicle: '2022 Royal Enfield Hunter 350',
    source: 'automated_rule',
    severity: 'medium',
    triggerReason: 'Automated Rule #4: Not Inspected items exceed 15% threshold (Chain Slack & Rear Hub marked Not Inspected without tool constraint)',
    flaggedAt: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
    status: 'pending_review',
    reportVersion: 1,
    payoutHoldActive: true,
    reviewerNotes: 'Automated flag triggered post submission. Customer received report immediately. Review required before 48h payout release.',
  },
  {
    id: 'FLG-2026-079',
    bookingRef: 'SV-2026-8790',
    bookingId: 'BK-2026-8790',
    specialistId: 'sp-102',
    specialistName: 'Arjun Das (SV-SPEC-712)',
    vehicle: '2020 Honda City ZX',
    source: 'customer_escalation',
    severity: 'high',
    triggerReason: 'Customer Escalation: Buyer claims rear bumper repaint was marked "Good" instead of "Average" with 220µm micron coat',
    flaggedAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
    status: 'clarification_requested',
    reportVersion: 1,
    payoutHoldActive: true,
    reviewerNotes: 'Sent query to specialist requesting high-res bumper photos.',
  },
];

const INITIAL_PRICING: PlatformPricingConfig = {
  baseCarPrice: 1999,
  baseBikePrice: 999,
  complexitySurcharges: {
    standard: 0,
    complex: 499,
    luxury_or_specialist: 999,
  },
  freeTravelKm: 15,
  perKmTravelRate: 25,
  gstRate: 0.18,
  specialistBasePayoutCar: 1650,
  specialistBasePayoutBike: 750,
  tier1IncentivePct: 10,
};

const INITIAL_CATALOG: VehicleCatalogModel[] = [
  { id: 'cat-1', make: 'Hyundai', model: 'Creta', type: 'car', yearRange: '2015-2024', fuelOptions: ['Petrol', 'Diesel'], transmissionOptions: ['Manual', 'Automatic', 'DCT/DSG'], complexity: 'complex', popular: true, active: true },
  { id: 'cat-2', make: 'Tata Motors', model: 'Nexon', type: 'car', yearRange: '2017-2024', fuelOptions: ['Petrol', 'Diesel', 'Electric'], transmissionOptions: ['Manual', 'Automatic'], complexity: 'complex', popular: true, active: true },
  { id: 'cat-3', make: 'Maruti Suzuki', model: 'Swift', type: 'car', yearRange: '2010-2024', fuelOptions: ['Petrol', 'CNG'], transmissionOptions: ['Manual', 'AMT'], complexity: 'standard', popular: true, active: true },
  { id: 'cat-4', make: 'Mahindra', model: 'XUV700', type: 'car', yearRange: '2021-2024', fuelOptions: ['Petrol', 'Diesel'], transmissionOptions: ['Manual', 'Automatic'], complexity: 'luxury_or_specialist', popular: true, active: true },
  { id: 'cat-5', make: 'Royal Enfield', model: 'Classic 350', type: 'bike', yearRange: '2012-2024', fuelOptions: ['Petrol'], transmissionOptions: ['Manual'], complexity: 'standard', popular: true, active: true },
  { id: 'cat-6', make: 'BMW', model: '3 Series / 5 Series', type: 'car', yearRange: '2015-2024', fuelOptions: ['Petrol', 'Diesel'], transmissionOptions: ['Automatic'], complexity: 'luxury_or_specialist', popular: false, active: true },
  { id: 'cat-7', make: 'Kia', model: 'Carnival', type: 'car', yearRange: '2020-2024', fuelOptions: ['Diesel'], transmissionOptions: ['Automatic'], complexity: 'luxury_or_specialist', popular: true, active: true },
];

const INITIAL_FINANCE: FinancialLedgerRow[] = [
  { id: 'FIN-1043', timestamp: '2025-09-10T09:00:00.000Z', reference: 'SV-2025-KIA-7712', category: 'customer_collection', amount: 3537.64, description: 'Customer online payment for Kia Carnival Inspection (Mr. XXXX)', status: 'completed' },
  { id: 'FIN-1042', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), reference: 'SV-2026-9042', category: 'customer_collection', amount: 3744.14, description: 'Customer online payment via Razorpay (Booking SV-2026-9042)', status: 'completed' },
  { id: 'FIN-1041', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), reference: 'SV-2026-9041', category: 'customer_collection', amount: 2947.64, description: 'Customer online payment via Razorpay (Booking SV-2026-9041)', status: 'completed' },
  { id: 'FIN-1039', timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), reference: 'SV-2026-8901', category: 'specialist_payout', amount: -1750, description: 'Escrow credit reserved for Rajesh Verma (48h quality hold)', status: 'held_in_escrow' },
  { id: 'FIN-1038', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), reference: 'WDR-2026-381', category: 'specialist_payout', amount: -4500, description: 'Direct IMPS disbursement to Rajesh Verma (HDFC •••• 9821)', status: 'completed' },
  { id: 'FIN-1037', timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), reference: 'REF-2026-092', category: 'customer_refund', amount: -2358.11, description: 'Customer cancellation 80% refund (pre-dispatch window)', status: 'completed' },
];

const INITIAL_AUDIT: AdminAuditEntry[] = [
  { id: 'AUD-01', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), adminName: 'Vikram Sengupta', adminRole: 'super_admin', action: 'ASSIGN_SPECIALIST', category: 'booking', resourceId: 'BK-2026-9041', details: 'Assigned Rajesh Verma (SV-SPEC-704) to Tata Nexon EV inspection' },
  { id: 'AUD-02', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), adminName: 'Vikram Sengupta', adminRole: 'super_admin', action: 'CREATE_FLAG', category: 'quality', resourceId: 'FLG-2026-081', details: 'Automated QA rule trigger on incomplete two-wheeler inspection item check' },
  { id: 'AUD-03', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), adminName: 'Vikram Sengupta', adminRole: 'super_admin', action: 'UPDATE_PRICING', category: 'pricing', resourceId: 'PRC-CFG', details: 'Confirmed standard 18% GST and luxury complexity slab ₹999' },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('sv_admin_user');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('sv_admin_authenticated');
    return saved !== null ? saved === 'true' : true;
  });

  const [bookings, setBookings] = useState<AdminBooking[]>(() => {
    const saved = localStorage.getItem('sv_admin_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [customers, setCustomers] = useState<AdminCustomer[]>(() => {
    const saved = localStorage.getItem('sv_admin_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [reports, setReports] = useState<DetailedInspectionReport[]>(() => {
    const saved = localStorage.getItem('sv_admin_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [specialists, setSpecialists] = useState<AdminSpecialist[]>(() => {
    const saved = localStorage.getItem('sv_admin_specialists');
    return saved ? JSON.parse(saved) : INITIAL_SPECIALISTS;
  });

  const [qualityFlags, setQualityFlags] = useState<QualityFlagItem[]>(() => {
    const saved = localStorage.getItem('sv_admin_flags');
    return saved ? JSON.parse(saved) : INITIAL_FLAGS;
  });

  const [pricingConfig, setPricingConfig] = useState<PlatformPricingConfig>(() => {
    const saved = localStorage.getItem('sv_admin_pricing');
    return saved ? JSON.parse(saved) : INITIAL_PRICING;
  });

  const [vehicleCatalog, setVehicleCatalog] = useState<VehicleCatalogModel[]>(() => {
    const saved = localStorage.getItem('sv_admin_catalog');
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });

  const [financialLedger, setFinancialLedger] = useState<FinancialLedgerRow[]>(() => {
    const saved = localStorage.getItem('sv_admin_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCE;
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>(() => {
    const saved = localStorage.getItem('sv_admin_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('sv_admin_users_list');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('sv_admin_feedbacks');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  // LocalStorage persistence
  useEffect(() => {
    localStorage.setItem('sv_admin_users_list', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('sv_admin_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);
  useEffect(() => {
    localStorage.setItem('sv_admin_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sv_admin_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sv_admin_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('sv_admin_specialists', JSON.stringify(specialists));
  }, [specialists]);

  useEffect(() => {
    localStorage.setItem('sv_admin_flags', JSON.stringify(qualityFlags));
  }, [qualityFlags]);

  useEffect(() => {
    localStorage.setItem('sv_admin_pricing', JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    localStorage.setItem('sv_admin_catalog', JSON.stringify(vehicleCatalog));
  }, [vehicleCatalog]);

  useEffect(() => {
    localStorage.setItem('sv_admin_finance', JSON.stringify(financialLedger));
  }, [financialLedger]);

  useEffect(() => {
    localStorage.setItem('sv_admin_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAudit = (action: string, category: AdminAuditEntry['category'], resourceId: string, details: string) => {
    const newEntry: AdminAuditEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      adminName: currentUser.name,
      adminRole: currentUser.role,
      action,
      category,
      resourceId,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const login = (role: AdminRole = 'super_admin', email?: string) => {
    const roleProfiles: Record<AdminRole, AdminUser> = {
      super_admin: {
        id: 'adm-01',
        name: 'Vikram Sengupta',
        email: email || 'vikram.s@sahivahan.com',
        role: 'super_admin',
        status: 'active',
      },
      operations: {
        id: 'adm-02',
        name: 'Anita Desai',
        email: email || 'anita.d@sahivahan.com',
        role: 'operations',
        status: 'active',
      },
      quality_reviewer: {
        id: 'adm-03',
        name: 'Karan Mehra',
        email: email || 'karan.m@sahivahan.com',
        role: 'quality_reviewer',
        status: 'active',
      },
      finance_controller: {
        id: 'adm-04',
        name: 'Pooja Hegde',
        email: email || 'pooja.h@sahivahan.com',
        role: 'finance_controller',
        status: 'active',
      },
    };

    const user = roleProfiles[role] || DEFAULT_ADMIN;
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('sv_admin_authenticated', 'true');
    localStorage.setItem('sv_admin_user', JSON.stringify(user));

    addAudit('ADMIN_LOGIN', 'security', user.id, `${user.name} logged into Admin Ops Center (${user.role})`);
  };

  const logout = () => {
    addAudit('ADMIN_LOGOUT', 'security', currentUser.id, `${currentUser.name} signed out of Admin Ops Center`);
    setIsAuthenticated(false);
    localStorage.setItem('sv_admin_authenticated', 'false');
  };

  const switchRole = (role: AdminRole) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, role };
      localStorage.setItem('sv_admin_user', JSON.stringify(updated));
      return updated;
    });
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id);
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, notes: c.notes ? `${c.notes} | ${note}` : note } : c
      )
    );
    addAudit('UPDATE_CUSTOMER_NOTE', 'booking', customerId, `Added note to customer ${customerId}: ${note}`);
  };

  const getReportByBookingRef = (ref: string) => {
    return reports.find((r) => r.bookingRef === ref);
  };

  const createOrUpdateReport = (report: DetailedInspectionReport) => {
    setReports((prev) => {
      const idx = prev.findIndex((r) => r.bookingRef === report.bookingRef);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = report;
        return copy;
      }
      return [report, ...prev];
    });

    // Also update booking status to submitted if not already
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingRef === report.bookingRef
          ? {
              ...b,
              status: 'submitted',
              reportVersion: report.version,
              reportHealthScore: report.healthScore,
              reportSubmittedAt: report.createdAt,
            }
          : b
      )
    );

    addAudit('SUBMIT_REPORT', 'quality', report.bookingRef, `Created/Updated inspection report for ${report.bookingRef} (${report.vehicle})`);
  };

  const assignSpecialist = (bookingId: string, specialistId: string) => {
    const spec = specialists.find((s) => s.id === specialistId);
    if (!spec) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'assigned',
              assignedSpecialistId: spec.id,
              assignedSpecialistName: `${spec.name} (${spec.badge})`,
              assignedAt: new Date().toISOString(),
            }
          : b
      )
    );

    addAudit('ASSIGN_SPECIALIST', 'booking', bookingId, `Assigned ${spec.name} to booking ${bookingId}`);
  };

  const reassignSpecialist = (bookingId: string, newSpecialistId: string, reason: string) => {
    const spec = specialists.find((s) => s.id === newSpecialistId);
    if (!spec) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'assigned',
              assignedSpecialistId: spec.id,
              assignedSpecialistName: `${spec.name} (${spec.badge})`,
              assignedAt: new Date().toISOString(),
            }
          : b
      )
    );

    addAudit('REASSIGN_SPECIALIST', 'booking', bookingId, `Reassigned to ${spec.name}. Reason: ${reason}`);
  };

  const cancelBooking = (bookingId: string, reason: string, refundAmount: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              cancellation: {
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'admin',
                reason,
                refundAmount,
                refundStatus: refundAmount > 0 ? 'processed' : 'declined',
              },
            }
          : b
      )
    );

    if (refundAmount > 0) {
      const newLedger: FinancialLedgerRow = {
        id: `FIN-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        reference: bookingId,
        category: 'customer_refund',
        amount: -refundAmount,
        description: `Admin approved cancellation refund for ${bookingId}. Reason: ${reason}`,
        status: 'completed',
      };
      setFinancialLedger((prev) => [newLedger, ...prev]);
    }

    addAudit('CANCEL_BOOKING', 'booking', bookingId, `Cancelled with refund ₹${refundAmount}. Reason: ${reason}`);
  };

  const verifySpecialistDoc = (
    specialistId: string,
    docKey: 'aadhaar' | 'policeClearance' | 'license' | 'certifications',
    status: 'verified' | 'rejected'
  ) => {
    setSpecialists((prev) =>
      prev.map((s) => {
        if (s.id !== specialistId) return s;
        return {
          ...s,
          documents: {
            ...s.documents,
            [docKey]: { ...s.documents[docKey], status },
          },
        };
      })
    );

    addAudit('VERIFY_DOCUMENT', 'specialist', specialistId, `Marked ${docKey} as ${status} for specialist ${specialistId}`);
  };

  const updateSpecialistStatus = (specialistId: string, status: 'active' | 'suspended' | 'pending_verification') => {
    setSpecialists((prev) =>
      prev.map((s) => (s.id === specialistId ? { ...s, status } : s))
    );
    addAudit('UPDATE_SPECIALIST_STATUS', 'specialist', specialistId, `Changed status to ${status}`);
  };

  const resolveQualityFlag = (
    flagId: string,
    decision: 'correction_issued' | 'resolved_valid' | 'dismissed',
    notes: string,
    holdPayout: boolean
  ) => {
    setQualityFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? {
              ...f,
              status: decision,
              reviewerNotes: notes,
              payoutHoldActive: holdPayout,
              resolvedAt: new Date().toISOString(),
              resolvedBy: currentUser.name,
            }
          : f
      )
    );

    addAudit('RESOLVE_QUALITY_FLAG', 'quality', flagId, `Resolved as ${decision}. Hold payout: ${holdPayout}. Notes: ${notes}`);
  };

  const releasePayoutEarly = (bookingRef: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingRef === bookingRef
          ? { ...b, payoutEligibilityAt: new Date().toISOString() }
          : b
      )
    );

    setQualityFlags((prev) =>
      prev.map((f) =>
        f.bookingRef === bookingRef
          ? { ...f, payoutHoldActive: false }
          : f
      )
    );

    addAudit('MANUAL_PAYOUT_RELEASE', 'finance', bookingRef, `Admin approved early payout release for ${bookingRef}`);
  };

  const processRefundDecision = (bookingId: string, approve: boolean, note: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId || !b.cancellation) return b;
        return {
          ...b,
          cancellation: {
            ...b.cancellation,
            refundStatus: approve ? 'processed' : 'declined',
          },
        };
      })
    );

    addAudit('REFUND_DECISION', 'finance', bookingId, `${approve ? 'Approved' : 'Declined'} refund for ${bookingId}. Note: ${note}`);
  };

  const updatePricingConfig = (newConfig: Partial<PlatformPricingConfig>) => {
    setPricingConfig((prev) => ({ ...prev, ...newConfig }));
    addAudit('UPDATE_PRICING', 'pricing', 'GLOBAL', `Updated pricing rules: ${JSON.stringify(newConfig)}`);
  };

  const toggleVehicleCatalogItem = (modelId: string) => {
    setVehicleCatalog((prev) =>
      prev.map((v) => (v.id === modelId ? { ...v, active: !v.active } : v))
    );
    addAudit('TOGGLE_CATALOG_ITEM', 'pricing', modelId, `Toggled active state for vehicle ${modelId}`);
  };

  const addVehicleCatalogItem = (item: Omit<VehicleCatalogModel, 'id'>) => {
    const newItem: VehicleCatalogModel = {
      ...item,
      id: `cat-${Date.now()}`,
    };
    setVehicleCatalog((prev) => [...prev, newItem]);
    addAudit('ADD_CATALOG_ITEM', 'pricing', newItem.id, `Added new vehicle ${item.make} ${item.model}`);
  };

  // Admin User & RBAC Management
  const createAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser => {
    const newUser: AdminUser = {
      ...userData,
      id: `adm-0${adminUsers.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never logged in',
    };
    setAdminUsers((prev) => [newUser, ...prev]);
    addAudit('CREATE_ADMIN_USER', 'security', newUser.id, `Created admin user ${newUser.name} with role ${newUser.role}`);
    return newUser;
  };

  const updateAdminUserStatus = (id: string, status: 'active' | 'inactive') => {
    setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    addAudit('UPDATE_ADMIN_STATUS', 'security', id, `Updated status to ${status} for user ${id}`);
  };

  const updateAdminUserRole = (id: string, role: AdminRole) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    addAudit('UPDATE_ADMIN_ROLE', 'security', id, `Updated role to ${role} for user ${id}`);
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    addAudit('DELETE_ADMIN_USER', 'security', id, `Removed admin user ${id}`);
  };

  // Feedback & CSAT Management
  const createFeedback = (feedback: Omit<FeedbackItem, 'id' | 'createdAt'>) => {
    const newFb: FeedbackItem = {
      ...feedback,
      id: `FB-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFb, ...prev]);
    addAudit('CREATE_FEEDBACK', 'quality', newFb.id, `New feedback logged from ${newFb.userName} (${newFb.category})`);
  };

  const updateFeedbackStatus = (id: string, status: FeedbackItem['status'], notes?: string, resolutionReply?: string) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status,
              internalNotes: notes !== undefined ? notes : f.internalNotes,
              resolutionReply: resolutionReply !== undefined ? resolutionReply : f.resolutionReply,
            }
          : f
      )
    );
    addAudit('UPDATE_FEEDBACK', 'quality', id, `Updated feedback status to ${status}`);
  };

  const convertFeedbackToQualityFlag = (feedbackId: string, flagDetails?: Partial<QualityFlagItem>) => {
    const fb = feedbacks.find((f) => f.id === feedbackId);
    if (!fb) return;

    const newFlag: QualityFlagItem = {
      id: `FLG-${Date.now().toString().slice(-4)}`,
      bookingRef: fb.bookingRef || 'SV-2026-UNLINKED',
      bookingId: 'bk-auto',
      specialistId: 'sp-101',
      specialistName: fb.specialistName || 'Assigned Specialist',
      vehicle: 'Vehicle under inspection',
      source: 'customer_escalation',
      severity: 'high',
      triggerReason: `Converted from customer feedback: ${fb.title} - ${fb.message}`,
      flaggedAt: new Date().toISOString(),
      status: 'pending_review',
      reportVersion: 1,
      payoutHoldActive: true,
      reviewerNotes: `Escalated from Feedback ${fb.id}. Action required.`,
      ...flagDetails,
    };

    setQualityFlags((prev) => [newFlag, ...prev]);
    updateFeedbackStatus(feedbackId, 'converted_to_flag', `Escalated to QA flag ${newFlag.id}`);
    addAudit('ESCALATE_FEEDBACK_TO_FLAG', 'quality', newFlag.id, `Escalated feedback ${feedbackId} into formal QA flag ${newFlag.id}`);
  };

  // Create Customer Action
  const createCustomer = (customerData: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    status?: 'active' | 'vip';
    notes?: string;
  }): AdminCustomer => {
    const newCust: AdminCustomer = {
      id: `CUST-${100 + customers.length + 1}`,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      city: customerData.city,
      address: customerData.address,
      totalBookings: 0,
      lifetimeSpend: 0,
      activeBookingsCount: 0,
      lastBookingDate: 'None',
      registeredDate: new Date().toISOString().split('T')[0],
      status: customerData.status || 'active',
      notes: customerData.notes || 'Registered manually by Admin Operations',
      bookingRefs: [],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAudit('CREATE_CUSTOMER', 'booking', newCust.id, `Manually created customer account for ${newCust.name} (${newCust.phone})`);
    return newCust;
  };

  // Create Specialist Action
  const createSpecialist = (specialistData: {
    name: string;
    badge: string;
    phone: string;
    email: string;
    city: string;
    zones: string[];
    licenseNumber: string;
    tools?: string[];
    bankName: string;
    accountNumber: string;
    ifsc: string;
    status?: 'active' | 'pending_verification';
  }): AdminSpecialist => {
    const newSpec: AdminSpecialist = {
      id: `sp-${200 + specialists.length + 1}`,
      name: specialistData.name,
      badge: specialistData.badge,
      phone: specialistData.phone,
      email: specialistData.email,
      city: specialistData.city,
      zones: specialistData.zones,
      rating: 5.0,
      completedJobsCount: 0,
      disputeCount: 0,
      status: specialistData.status || 'pending_verification',
      joinedDate: new Date().toISOString().split('T')[0],
      documents: {
        aadhaar: { status: 'pending', ref: `AADHAAR-${Date.now().toString().slice(-4)}` },
        policeClearance: { status: 'pending', expiry: '2027-12-31' },
        license: { status: 'verified', number: specialistData.licenseNumber },
        certifications: { status: 'verified', title: 'Certified Used Vehicle Inspector', issuer: 'Automotive Skills Development Council' },
      },
      tools: (specialistData.tools || ['Paint Depth Gauge (Elcometer)', 'OBD-II Bluetooth Scanner', 'Battery & Alternator Tester']).map((name) => ({
        name,
        serial: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'calibrated',
      })),
      bankDetails: {
        bankName: specialistData.bankName,
        accountMasked: `•••• •••• ${specialistData.accountNumber.slice(-4)}`,
        ifsc: specialistData.ifsc,
        accountHolder: specialistData.name,
        isVerified: true,
      },
      wallet: {
        pending: 0,
        available: 0,
        lifetimeEarnings: 0,
      },
    };
    setSpecialists((prev) => [newSpec, ...prev]);
    addAudit('ONBOARD_SPECIALIST', 'specialist', newSpec.id, `Onboarded new specialist ${newSpec.name} (${newSpec.badge}) in ${newSpec.city}`);
    return newSpec;
  };

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        bookings,
        specialists,
        qualityFlags,
        pricingConfig,
        vehicleCatalog,
        financialLedger,
        auditLogs,
        customers,
        reports,
        adminUsers,
        feedbacks,
        createAdminUser,
        updateAdminUserStatus,
        updateAdminUserRole,
        deleteAdminUser,
        createFeedback,
        updateFeedbackStatus,
        convertFeedbackToQualityFlag,
        getCustomerById,
        addCustomerNote,
        createCustomer,
        createSpecialist,
        getReportByBookingRef,
        createOrUpdateReport,
        assignSpecialist,
        reassignSpecialist,
        cancelBooking,
        verifySpecialistDoc,
        updateSpecialistStatus,
        resolveQualityFlag,
        releasePayoutEarly,
        processRefundDecision,
        updatePricingConfig,
        toggleVehicleCatalogItem,
        addVehicleCatalogItem,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
