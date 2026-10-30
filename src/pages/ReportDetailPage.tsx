import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Car,
  Calendar,
  User,
  Clock,
  Gauge,
  Camera,
  Check,
  Edit,
  Save,
  Download
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { DetailedInspectionReport, InspectionQuestionAnswer, InspectionGradeCode } from '../types/admin';

export const ReportDetailPage: React.FC = () => {
  const { bookingRef } = useParams<{ bookingRef: string }>();
  const navigate = useNavigate();
  const { getReportByBookingRef, createOrUpdateReport } = useAdmin();

  const report = getReportByBookingRef(bookingRef || '');

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<DetailedInspectionReport | null>(report || null);
  const [newComment, setNewComment] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  if (!report) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs text-donezo-green dark:text-emerald-400 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </Link>
        <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-12 text-center shadow-donezo">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inspection Report Pending or Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            The specialist has not yet finalized and delivered the inspection report for booking reference{' '}
            <strong className="text-donezo-green dark:text-emerald-400">{bookingRef}</strong>.
          </p>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="px-5 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all shadow-sm"
          >
            Return to Dispatch Desk
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedReport) return;
    createOrUpdateReport({
      ...editedReport,
      version: editedReport.version + 1,
    });
    setIsEditing(false);
  };

  const handleGradeChange = (
    sectionKey: 'interiorCondition' | 'gaugesAndAudio' | 'carpetAndTrunk' | 'electricalSystem' | 'underTheHood' | 'underTheCar' | 'roadTest' | 'finalInspectionSummary',
    index: number,
    newGrade: InspectionGradeCode
  ) => {
    if (!editedReport) return;
    const updatedSection = [...editedReport[sectionKey]];
    updatedSection[index] = { ...updatedSection[index], condition: newGrade };
    setEditedReport({ ...editedReport, [sectionKey]: updatedSection });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedReport || !newComment.trim()) return;
    setEditedReport({
      ...editedReport,
      comments: [...editedReport.comments, newComment.trim()],
    });
    setNewComment('');
  };

  const currentData = isEditing && editedReport ? editedReport : report;

  // Render Table for a section
  const renderQuestionnaireTable = (
    title: string,
    items: InspectionQuestionAnswer[],
    sectionKey: 'interiorCondition' | 'gaugesAndAudio' | 'carpetAndTrunk' | 'electricalSystem' | 'underTheHood' | 'underTheCar' | 'roadTest' | 'finalInspectionSummary'
  ) => {
    return (
      <div className="border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-2xl overflow-hidden mb-6 bg-white dark:bg-[#0E1318]">
        <div className="bg-slate-50 dark:bg-donezo-darkCard px-4 py-3 flex items-center justify-between border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            {title}
          </span>
          <div className="flex items-center gap-6 text-[11px] font-bold">
            <span className="text-emerald-600 dark:text-emerald-400">E</span>
            <span className="text-amber-600 dark:text-amber-400">G</span>
            <span className="text-rose-600 dark:text-rose-400">B</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-donezo-darkBorder">
          {items.map((row, idx) => (
            <div key={idx} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex-1 pr-4">
                <span className="text-slate-800 dark:text-slate-200 font-medium">{row.item}</span>
                {row.notes && (
                  <span className="block text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">Note: {row.notes}</span>
                )}
              </div>

              <div className="flex items-center gap-6">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleGradeChange(sectionKey, idx, 'E')}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                        row.condition === 'E'
                          ? 'border-emerald-500 bg-emerald-500 text-white font-black shadow-sm'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:border-emerald-400'
                      }`}
                    >
                      E
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGradeChange(sectionKey, idx, 'G')}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                        row.condition === 'G'
                          ? 'border-amber-500 bg-amber-500 text-white font-black shadow-sm'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:border-amber-400'
                      }`}
                    >
                      G
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGradeChange(sectionKey, idx, 'B')}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                        row.condition === 'B'
                          ? 'border-rose-500 bg-rose-500 text-white font-black shadow-sm'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:border-rose-400'
                      }`}
                    >
                      B
                    </button>
                  </>
                ) : (
                  <>
                    <span className="w-6 flex justify-center">
                      {row.condition === 'E' ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 inline-block" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 inline-block" />
                      )}
                    </span>
                    <span className="w-6 flex justify-center">
                      {row.condition === 'G' ? (
                        <span className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/20 inline-block" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 inline-block" />
                      )}
                    </span>
                    <span className="w-6 flex justify-center">
                      {row.condition === 'B' ? (
                        <span className="w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-500/20 inline-block" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 inline-block" />
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs text-donezo-green dark:text-emerald-400 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings Directory
        </Link>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => {
                setEditedReport(report);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Edit className="w-3.5 h-3.5 text-donezo-green dark:text-emerald-400" /> Edit / Create Revision (v{report.version + 1})
            </button>
          ) : (
            <button
              onClick={handleSaveEdits}
              className="px-5 py-2 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Publish New Version (v{currentData.version + 1})
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Main Official Inspection Report Sheet */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-6 sm:p-10 shadow-donezo relative">
        {/* Header Branding */}
        <div className="border-b border-donezo-lightBorder dark:border-donezo-darkBorder pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                SURESH DRIVES AUTOCHECK LLP
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The Work Book, Ground Floor, HiLITE Business Park, Kozhikode - 673014, Kerala, India.
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Mob & Whatsapp: +91 8330 88 12 13 | MSME: UDAYAM-KL-08-0089693 | GSTIN: 32AFPFS4965Q1ZZ
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 bg-donezo-greenLight dark:bg-emerald-950/40 text-donezo-green dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase rounded-full">
                Report v{currentData.version}.0 Official
              </span>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Ref: {currentData.bookingRef}</div>
            </div>
          </div>
        </div>

        {/* Vehicle & Customer Metadata Grid (matching PDF layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Date of Inspection:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{currentData.dateOfInspection}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Customer Name:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{currentData.customerName}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Vehicle:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm uppercase">{currentData.vehicle}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Registration number:</span>
            <div className="font-bold text-donezo-green dark:text-emerald-400 font-mono text-sm">{currentData.registrationNumber}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Date of Registration:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{currentData.dateOfRegistration}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Model Year:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{currentData.modelYear}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Chassis Number:</span>
            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">{currentData.chassisNumber}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Engine Number:</span>
            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">{currentData.engineNumber}</div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Kilometers at Inspection:</span>
            <div className="font-bold text-slate-900 dark:text-white text-base font-mono">{currentData.kilometersAtInspection.toLocaleString()} km</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder mb-6 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-emerald-700 dark:text-emerald-400">E - Excellent Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-amber-700 dark:text-amber-400">G - Good Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-rose-700 dark:text-rose-400">B - Bad Condition</span>
          </div>
        </div>

        {/* Category Tables matching PDF */}
        {renderQuestionnaireTable('INTERIOR CONDITION', currentData.interiorCondition, 'interiorCondition')}
        {renderQuestionnaireTable('GAUGES, AUDIO SYSTEM & NAVIGATION', currentData.gaugesAndAudio, 'gaugesAndAudio')}
        {renderQuestionnaireTable('CARPET, UPHOLSTERY & TRUNK', currentData.carpetAndTrunk, 'carpetAndTrunk')}
        {renderQuestionnaireTable('ELECTRICAL SYSTEM', currentData.electricalSystem, 'electricalSystem')}
        {renderQuestionnaireTable('UNDER THE HOOD', currentData.underTheHood, 'underTheHood')}
        {renderQuestionnaireTable('UNDER THE CAR', currentData.underTheCar, 'underTheCar')}
        {renderQuestionnaireTable('ROAD TEST', currentData.roadTest, 'roadTest')}
        {renderQuestionnaireTable('FINAL INSPECTION SUMMARY', currentData.finalInspectionSummary, 'finalInspectionSummary')}

        {/* Brake Checklist */}
        <div className="border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-2xl p-4 bg-white dark:bg-[#0E1318] mb-6">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            BRAKE INSPECTION
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.brakesCheck.noise}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    brakesCheck: { ...editedReport.brakesCheck, noise: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span>Noise</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.brakesCheck.vibration}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    brakesCheck: { ...editedReport.brakesCheck, vibration: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span>Vibration</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.brakesCheck.effort}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    brakesCheck: { ...editedReport.brakesCheck, effort: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span>Effort</span>
            </label>
          </div>
        </div>

        {/* Suspension Checklist */}
        <div className="border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-2xl p-4 bg-white dark:bg-[#0E1318] mb-6">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            SUSPENSION INSPECTION
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.suspensionCheck.ok}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    suspensionCheck: { ...editedReport.suspensionCheck, ok: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span>OK</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.suspensionCheck.noise}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    suspensionCheck: { ...editedReport.suspensionCheck, noise: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span>Noise</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.suspensionCheck.rough}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    suspensionCheck: { ...editedReport.suspensionCheck, rough: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span>Rough</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentData.suspensionCheck.weak}
                disabled={!isEditing}
                onChange={(e) =>
                  editedReport &&
                  setEditedReport({
                    ...editedReport,
                    suspensionCheck: { ...editedReport.suspensionCheck, weak: e.target.checked },
                  })
                }
                className="rounded text-donezo-green focus:ring-donezo-green"
              />
              <span className="font-bold text-rose-500">Weak</span>
            </label>
          </div>
        </div>

        {/* Expert Comments & Critical Observations */}
        <div className="border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-2xl p-5 bg-white dark:bg-[#0E1318] mb-6">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center justify-between">
            <span>DETAILED TECHNICAL COMMENTS & OBSERVATIONS</span>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">Critical Safety Assessment</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {currentData.comments.map((comment, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder">
                {comment}
              </div>
            ))}
          </div>

          {isEditing && (
            <form onSubmit={handleAddComment} className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Add technician comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-donezo-green"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-5 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all disabled:opacity-50"
              >
                Add Comment
              </button>
            </form>
          )}
        </div>

        {/* Evidence Images Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setImageModalOpen(true)}
            className="px-6 py-2.5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-donezo transition-all"
          >
            <Camera className="w-4 h-4 text-donezo-green dark:text-emerald-400" /> View Inspection Images ({currentData.evidenceImages.length})
          </button>
        </div>

        {/* Signatures & Certification Stamp (matching PDF page 5) */}
        <div className="pt-6 border-t border-donezo-lightBorder dark:border-donezo-darkBorder flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
              Name of Technician:
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
              <User className="w-4 h-4 text-donezo-green dark:text-emerald-400" /> {currentData.technicianName}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-2xl p-3 text-center bg-slate-50 dark:bg-[#0E1318]">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Report Cross Checked By</div>
              <div className="text-xs font-extrabold text-donezo-green dark:text-emerald-400 font-mono mt-0.5">{currentData.teamLeaderName}</div>
            </div>

            <div className="border-2 border-emerald-500/80 rounded-2xl p-2.5 text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-black uppercase tracking-wider">QUALITY VERIFIED</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-300">SURESH DRIVES / SAHIVAHAN</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-donezo-lightBorder dark:border-donezo-darkBorder mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-donezo-green dark:text-emerald-400" /> Photographic Inspection Evidence
              </h3>
              <button
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentData.evidenceImages.map((imgUrl, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-donezo-lightBorder dark:border-donezo-darkBorder bg-slate-50 dark:bg-[#0E1318]">
                  <img src={imgUrl} alt={`Evidence ${i + 1}`} className="w-full h-48 object-cover" />
                  <div className="p-2 text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Evidence Image #{i + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-6 border-t border-donezo-lightBorder dark:border-donezo-darkBorder flex justify-end">
              <button
                onClick={() => setImageModalOpen(false)}
                className="px-6 py-2 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
