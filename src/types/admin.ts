export type AdminRole = 'super_admin' | 'operations' | 'quality_reviewer' | 'finance_controller';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt?: string;
  permissions?: string[];
}

export type BookingStatus =
  | 'paid'
  | 'assigned'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'inspecting'
  | 'submitted'
  | 'completed'
  | 'cancelled';

export interface AdminBooking {
  id: string;
  bookingRef: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  vehicle: {
    type: 'car' | 'bike';
    make: string;
    model: string;
    variant: string;
    year: number;
    fuel: string;
    transmission: string;
    registrationNumber?: string;
    complexity: 'standard' | 'complex' | 'luxury_or_specialist';
  };
  location: {
    city: string;
    area: string;
    address: string;
    pincode: string;
    sellerName: string;
    sellerPhone: string;
    sellerRelationship: string;
    askingPrice?: string | number;
  };
  appointment: {
    date: string;
    window: string;
  };
  pricing: {
    baseFee: number;
    complexitySurcharge: number;
    travelFee: number;
    subtotal: number;
    gst18: number;
    total: number;
  };
  status: BookingStatus;
  createdAt: string;
  assignedSpecialistId?: string;
  assignedSpecialistName?: string;
  assignedAt?: string;
  reportVersion?: number;
  reportHealthScore?: number;
  reportSubmittedAt?: string;
  payoutEligibilityAt?: string;
  hasQualityFlag?: boolean;
  visitEvidence?: {
    specialistPhotoUrl: string;
    numberPlatePhotoUrl: string;
    odometerPhotoUrl: string;
    odometerKm: number;
    gpsCoords: string;
    arrivedAt: string;
  };
  cancellation?: {
    cancelledAt: string;
    cancelledBy: 'customer' | 'specialist' | 'admin';
    reason: string;
    refundAmount: number;
    refundStatus: 'pending' | 'processed' | 'declined';
  };
}

export interface AdminSpecialist {
  id: string;
  name: string;
  badge: string;
  phone: string;
  email: string;
  city: string;
  zones: string[];
  rating: number;
  completedJobsCount: number;
  disputeCount: number;
  status: 'active' | 'pending_verification' | 'suspended' | 'offline';
  joinedDate: string;
  documents: {
    aadhaar: { status: 'verified' | 'pending' | 'rejected'; ref: string; verifiedAt?: string };
    policeClearance: { status: 'verified' | 'pending' | 'rejected'; expiry: string };
    license: { status: 'verified' | 'pending' | 'rejected'; number: string };
    certifications: { status: 'verified' | 'pending' | 'rejected'; title: string; issuer: string };
  };
  tools: Array<{ name: string; serial: string; status: 'calibrated' | 'pending_check' | 'expired' }>;
  bankDetails: {
    bankName: string;
    accountMasked: string;
    ifsc: string;
    accountHolder: string;
    isVerified: boolean;
  };
  wallet: {
    pending: number;
    available: number;
    lifetimeEarnings: number;
  };
}

export interface QualityFlagItem {
  id: string;
  bookingRef: string;
  bookingId: string;
  specialistId: string;
  specialistName: string;
  vehicle: string;
  source: 'automated_rule' | 'customer_escalation';
  severity: 'critical' | 'high' | 'medium' | 'advisory';
  triggerReason: string;
  flaggedAt: string;
  status: 'pending_review' | 'clarification_requested' | 'correction_issued' | 'resolved_valid' | 'dismissed';
  reportVersion: number;
  payoutHoldActive: boolean;
  reviewerNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PlatformPricingConfig {
  baseCarPrice: number;
  baseBikePrice: number;
  complexitySurcharges: {
    standard: number;
    complex: number;
    luxury_or_specialist: number;
  };
  freeTravelKm: number;
  perKmTravelRate: number;
  gstRate: number; // 0.18
  specialistBasePayoutCar: number;
  specialistBasePayoutBike: number;
  tier1IncentivePct: number;
}

export interface VehicleCatalogModel {
  id: string;
  make: string;
  model: string;
  type: 'car' | 'bike';
  yearRange: string;
  fuelOptions: string[];
  transmissionOptions: string[];
  complexity: 'standard' | 'complex' | 'luxury_or_specialist';
  popular: boolean;
  active: boolean;
}

export interface FinancialLedgerRow {
  id: string;
  timestamp: string;
  reference: string;
  category: 'customer_collection' | 'specialist_payout' | 'customer_refund' | 'platform_commission' | 'gst_tax';
  amount: number;
  description: string;
  status: 'completed' | 'held_in_escrow' | 'processing' | 'failed';
}

export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  category: 'booking' | 'specialist' | 'quality' | 'pricing' | 'finance' | 'security';
  resourceId: string;
  details: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  totalBookings: number;
  lifetimeSpend: number;
  activeBookingsCount: number;
  lastBookingDate: string;
  registeredDate: string;
  status: 'active' | 'vip' | 'inactive';
  notes?: string;
  bookingRefs: string[];
}

export type InspectionGradeCode = 'E' | 'G' | 'B' | 'N'; // E=Excellent, G=Good, B=Bad, N=Not Inspected

export interface InspectionQuestionAnswer {
  item: string;
  condition: InspectionGradeCode;
  notes?: string;
}

export interface DetailedInspectionReport {
  id: string;
  bookingRef: string;
  dateOfInspection: string;
  customerName: string;
  customerPhone?: string;
  vehicle: string;
  registrationNumber: string;
  dateOfRegistration: string;
  modelYear: number;
  chassisNumber: string;
  engineNumber: string;
  kilometersAtInspection: number;
  healthScore: number;
  recommendation: string;
  // Questionnaire Categories matching PDF
  interiorCondition: InspectionQuestionAnswer[];
  gaugesAndAudio: InspectionQuestionAnswer[];
  carpetAndTrunk: InspectionQuestionAnswer[];
  electricalSystem: InspectionQuestionAnswer[];
  underTheHood: InspectionQuestionAnswer[];
  underTheCar: InspectionQuestionAnswer[];
  roadTest: InspectionQuestionAnswer[];
  finalInspectionSummary: InspectionQuestionAnswer[];
  brakesCheck: {
    noise: boolean;
    vibration: boolean;
    effort: boolean;
  };
  suspensionCheck: {
    ok: boolean;
    noise: boolean;
    rough: boolean;
    weak: boolean;
  };
  comments: string[];
  evidenceImages: string[];
  technicianName: string;
  teamLeaderName: string;
  qualityVerified: boolean;
  version: number;
  createdAt: string;
}

export type FeedbackType = 'customer_review' | 'specialist_feedback' | 'app_bug_report';

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  source: 'customer' | 'specialist' | 'platform';
  userName: string;
  userPhone?: string;
  userEmail?: string;
  bookingRef?: string;
  specialistName?: string;
  rating?: number; // 1-5
  category: 'specialist_behavior' | 'inspection_quality' | 'punctuality' | 'app_bug' | 'feature_request' | 'seller_issue' | 'pricing';
  title: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'acknowledged' | 'converted_to_flag' | 'resolved';
  internalNotes?: string;
  resolutionReply?: string;
}

