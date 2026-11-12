import React, { useState } from 'react';
import { BloodGroup } from '../types';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY, isCompatible } from '../data/mockData';
import { Activity, Check, Heart } from 'lucide-react';

export const CompatibilityGuide: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');

  const info = BLOOD_COMPATIBILITY[selectedGroup];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-rose-100 backdrop-blur mb-2">
          <Activity className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive Medical Reference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Blood Compatibility Matrix
        </h1>
        <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
          Understanding blood type compatibility is vital during transfusions. Select any blood group below to see who they can safely donate red blood cells to and receive from.
        </p>
      </div>

      {/* Interactive Selector */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Click A Blood Group to Inspect:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {BLOOD_GROUPS.map(bg => (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`py-3 rounded-2xl font-black text-base border transition-all ${
                  selectedGroup === bg
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-105 ring-2 ring-red-400/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Group Detailed Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                {selectedGroup}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Blood Group: {selectedGroup}
                </h3>
                <p className="text-xs text-slate-600 font-medium">{info.description}</p>
              </div>
            </div>

            {selectedGroup === 'O-' && (
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                ⭐ Universal Red Cell Donor
              </span>
            )}
            {selectedGroup === 'AB+' && (
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                ⭐ Universal Recipient
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Can Donate To */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Can Donate Red Blood Cells To:</span>
              </span>
              <p className="text-xs text-slate-500 mb-3">
                Patients with any of these blood types can safely accept {selectedGroup} blood:
              </p>
              <div className="flex flex-wrap gap-2">
                {info.canDonateTo.map(bg => (
                  <span
                    key={bg}
                    className="px-3 py-1.5 rounded-xl text-sm font-black bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs"
                  >
                    {bg}
                  </span>
                ))}
              </div>
            </div>

            {/* Can Receive From */}
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-2">
                <Heart className="w-4 h-4 text-blue-600" />
                <span>Can Receive Red Blood Cells From:</span>
              </span>
              <p className="text-xs text-slate-500 mb-3">
                If an emergency occurs, an {selectedGroup} patient can receive blood from:
              </p>
              <div className="flex flex-wrap gap-2">
                {info.canReceiveFrom.map(bg => (
                  <span
                    key={bg}
                    className="px-3 py-1.5 rounded-xl text-sm font-black bg-blue-50 text-blue-700 border border-blue-300 shadow-xs"
                  >
                    {bg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Matrix Table */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Complete Transfusion Compatibility Grid
          </h3>
          <p className="text-xs text-slate-500">
            Rows represent Donor Blood Group; Columns represent Patient / Recipient Group.
          </p>
        </div>

        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-3 bg-slate-100 rounded-tl-xl text-slate-700 font-bold border border-slate-200">
                Donor \ Recipient
              </th>
              {BLOOD_GROUPS.map(recipient => (
                <th
                  key={recipient}
                  className={`p-3 font-extrabold border border-slate-200 ${
                    recipient === selectedGroup ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-800'
                  }`}
                >
                  {recipient}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BLOOD_GROUPS.map(donor => (
              <tr key={donor}>
                <td
                  className={`p-3 font-extrabold text-left border border-slate-200 ${
                    donor === selectedGroup ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-800'
                  }`}
                >
                  {donor} {donor === 'O-' ? '(Univ. Donor)' : ''}
                </td>
                {BLOOD_GROUPS.map(recipient => {
                  const compatible = isCompatible(donor, recipient);
                  return (
                    <td
                      key={recipient}
                      className={`p-3 border border-slate-200 font-bold ${
                        compatible ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50/40 text-slate-300'
                      }`}
                    >
                      {compatible ? (
                        <div className="flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preparation tips for donors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 font-bold text-base">
            💧
          </div>
          <h4 className="font-bold text-sm text-slate-800">Hydrate Thoroughly</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Drink an extra 16-32 oz of water in the hours leading up to your donation to help blood volume and recovery.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-red-600 flex items-center justify-center mb-2 font-bold text-base">
            🥗
          </div>
          <h4 className="font-bold text-sm text-slate-800">Eat an Iron-Rich Meal</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Consume healthy iron-rich foods such as spinach, lean meats, beans, or raisins before donating. Avoid heavy fats.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold text-base">
            🛡️
          </div>
          <h4 className="font-bold text-sm text-slate-800">Rest & Refresh</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Get adequate sleep the night before. Wait at least 90 days between whole blood donations to keep red cells healthy.
          </p>
        </div>
      </div>
    </div>
  );
};
