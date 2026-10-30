import React, { useState } from 'react';
import {
  Tag,
  Car,
  Bike,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  ReceiptIndianRupee,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { VehicleCatalogModel } from '../types/admin';

export const PricingCatalogPage: React.FC = () => {
  const { pricingConfig, updatePricingConfig, vehicleCatalog, toggleVehicleCatalogItem, addVehicleCatalogItem } = useAdmin();

  // Pricing Form State
  const [formData, setFormData] = useState(pricingConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add Vehicle Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<{
    make: string;
    model: string;
    type: 'car' | 'bike';
    yearRange: string;
    complexity: 'standard' | 'complex' | 'luxury_or_specialist';
  }>({
    make: '',
    model: '',
    type: 'car',
    yearRange: '2018-2025',
    complexity: 'standard',
  });

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.model) return;

    addVehicleCatalogItem({
      make: newVehicle.make,
      model: newVehicle.model,
      type: newVehicle.type,
      yearRange: newVehicle.yearRange,
      fuelOptions: ['Petrol', 'Diesel'],
      transmissionOptions: ['Manual', 'Automatic'],
      complexity: newVehicle.complexity,
      popular: false,
      active: true,
    });

    setAddModalOpen(false);
    setNewVehicle({
      make: '',
      model: '',
      type: 'car',
      yearRange: '2018-2025',
      complexity: 'standard',
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Pricing Rules & Vehicle Catalog
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Dynamic fee schedules, vehicle complexity tier multipliers, distance travel rules, and active make/model index.
        </p>
      </div>

      {/* Pricing Rule Configuration Form */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-6 shadow-donezo">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-donezo-green dark:text-emerald-400" /> Core Pricing Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modifications apply immediately to new customer booking funnels. Existing paid bookings remain locked.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Pricing Config Saved
            </div>
          )}
        </div>

        <form onSubmit={handleSavePricing} className="space-y-6">
          {/* Base Inspection Pricing */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Base Inspection Rates (Standard Vehicle)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4 text-donezo-green dark:text-emerald-400" /> Car Base Inspection Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.baseCarPrice}
                    onChange={(e) => setFormData({ ...formData, baseCarPrice: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Bike className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Bike Base Inspection Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.baseBikePrice}
                    onChange={(e) => setFormData({ ...formData, baseBikePrice: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Complexity Tier Surcharges */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Vehicle Complexity Surcharges (Added to Base)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Standard Tier
                </label>
                <div className="text-xs text-slate-400 mb-2">Hatchbacks, Commuter 150cc bikes</div>
                <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">₹0 (Base)</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-donezo-green dark:text-emerald-400 uppercase tracking-wider mb-1">
                  Complex Tier Surcharge (₹)
                </label>
                <div className="text-xs text-slate-400 mb-2">Turbo Sedans, Mid SUVs, Compact EVs</div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.complexitySurcharges.complex}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complexitySurcharges: {
                          ...formData.complexitySurcharges,
                          complex: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl pl-8 pr-4 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                  Luxury / Specialist Surcharge (₹)
                </label>
                <div className="text-xs text-slate-400 mb-2">AWD, 7-seaters, BMW, Merc, Audi, Superbikes</div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.complexitySurcharges.luxury_or_specialist}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complexitySurcharges: {
                          ...formData.complexitySurcharges,
                          luxury_or_specialist: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl pl-8 pr-4 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travel & Distance Parameters */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Travel Distance Slabs (Calculated from City Center)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Complimentary Radius (Km)
                </label>
                <input
                  type="number"
                  value={formData.freeTravelKm}
                  onChange={(e) => setFormData({ ...formData, freeTravelKm: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <div className="text-[10px] text-slate-400 mt-1">₹0 travel fee for bookings within this radius</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Per Km Travel Rate (₹/Km)
                </label>
                <input
                  type="number"
                  value={formData.perKmTravelRate}
                  onChange={(e) => setFormData({ ...formData, perKmTravelRate: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <div className="text-[10px] text-slate-400 mt-1">Charged beyond complimentary radius</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    GST Tax Rate
                  </label>
                  <div className="text-xs text-slate-400">Government statutory compliance</div>
                </div>
                <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">18% Flat (CGST 9% + SGST 9%)</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white font-bold rounded-full text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Pricing Matrix
            </button>
          </div>
        </form>
      </div>

      {/* Vehicle Catalog Management */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-6 shadow-donezo">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-donezo-green dark:text-emerald-400" /> Vehicle Model Master Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active index of vehicles displayed in customer booking select dropdowns.
            </p>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white font-bold rounded-full text-xs flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Vehicle Model
          </button>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0E1318] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
              <tr>
                <th className="p-3.5">Make & Brand</th>
                <th className="p-3.5">Model</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Production Years</th>
                <th className="p-3.5">Assigned Complexity</th>
                <th className="p-3.5">Catalog Status</th>
                <th className="p-3.5 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-donezo-darkBorder">
              {vehicleCatalog.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{v.make}</td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-200">{v.model}</td>
                  <td className="p-3.5 uppercase text-[10px] font-bold text-slate-400">{v.type}</td>
                  <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{v.yearRange}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-donezo-lightBorder dark:border-donezo-darkBorder">
                      {v.complexity.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        v.active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleVehicleCatalogItem(v.id)}
                      className="text-slate-400 hover:text-donezo-green transition-colors"
                    >
                      {v.active ? (
                        <ToggleRight className="w-6 h-6 text-donezo-green dark:text-emerald-400 inline" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400 inline" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Add Vehicle Model to Catalog</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Expand customer vehicle selector with new manufacturer models.
            </p>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Manufacturer Make
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kia, Toyota, Volkswagen"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Seltos, Fortuner, Taigun"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="car">Car (4 Wheeler)</option>
                    <option value="bike">Bike (2 Wheeler)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Complexity Tier
                  </label>
                  <select
                    value={newVehicle.complexity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, complexity: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="standard">Standard (₹0)</option>
                    <option value="complex">Complex (+₹499)</option>
                    <option value="luxury_or_specialist">Luxury (+₹999)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
