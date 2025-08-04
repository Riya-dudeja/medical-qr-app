import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const MedicationSafetyChecker = () => {
  const [flaggedMeds, setFlaggedMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    const fetchSafety = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          '/api/medsafe/check-medications',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFlaggedMeds(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching medication safety');
      } finally {
        setLoading(false);
      }
    };
    fetchSafety();
  }, [authLoading]);

  // Split flaggedMeds into safe and unsafe
  const safeMeds = flaggedMeds.filter(med => !med.issues || med.issues.length === 0);
  const unsafeMeds = flaggedMeds.filter(med => med.issues && med.issues.length > 0);

  // Collect all medicines to avoid (from issues)
  const avoidList = unsafeMeds.map(med => ({
    name: med.name,
    reasons: med.issues
  }));

  // Show More state for notes
  const [showMoreIdx, setShowMoreIdx] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Medication Safety Checker</h2>
      {loading && <p>Checking your medications for safety...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {/* Unsafe meds section */}
          {unsafeMeds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Medicines to Avoid</h3>
              <ul className="space-y-4">
                {avoidList.map((med, idx) => (
                  <li key={idx} className="border rounded p-4 bg-red-50">
                    <h4 className="font-semibold text-lg text-red-700">{med.name}</h4>
                    <ul className="list-disc ml-6 text-red-700">
                      {med.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safe meds section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Safe Medicines</h3>
            {safeMeds.length > 0 ? (
              <ul className="space-y-4">
                {safeMeds.map((med, idx) => (
                  <li key={idx} className="border rounded p-4 bg-green-50">
                    <h4 className="font-semibold text-lg text-green-700">{med.name}</h4>
                    <p className="text-green-700">No safety issues detected.</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No safe medicines found in your current list.</p>
            )}
          </div>

          {/* Full details for all meds */}
          <div>
            <h3 className="text-xl font-semibold mb-2">All Medication Details</h3>
            <ul className="space-y-4">
              {flaggedMeds.map((med, idx) => (
                <li key={idx} className="border rounded p-4 bg-white">
                  <h4 className="font-semibold text-lg">{med.name}</h4>
                  {/* Key actionable facts */}
                  {med.issues && med.issues.length > 0 && (
                    <ul className="list-disc ml-6 text-red-700">
                      {med.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  )}
                  {med.pregnancyRisk && (
                    <div className="mt-2 text-orange-700">
                      <span className="font-medium">Pregnancy Risk:</span> {med.pregnancyRisk}
                    </div>
                  )}
                  {med.allergyTriggers && med.allergyTriggers.length > 0 && (
                    <div className="mt-2 text-pink-700">
                      <span className="font-medium">Allergy Triggers:</span> {med.allergyTriggers.join(', ')}
                    </div>
                  )}
                  {med.interactions && med.interactions.length > 0 && (
                    <div className="mt-2 text-blue-700">
                      <span className="font-medium">Drug Interactions:</span> {med.interactions.join(', ')}
                    </div>
                  )}
                  {med.alternatives && med.alternatives.length > 0 && (
                    <div className="mt-2 text-green-700">
                      <span className="font-medium">Safer alternatives:</span> {med.alternatives.join(', ')}
                    </div>
                  )}
                  {/* Collapsible notes */}
                  {med.notes && (
                    <div className="mt-2 text-gray-700">
                      <span className="font-medium">Notes:</span>
                      {med.notes.length > 350 ? (
                        <>
                          <span> {showMoreIdx === idx ? med.notes : med.notes.slice(0, 350) + '...'} </span>
                          <button
                            className="ml-2 text-blue-500 underline text-sm"
                            onClick={() => setShowMoreIdx(showMoreIdx === idx ? null : idx)}
                          >
                            {showMoreIdx === idx ? 'Show Less' : 'Show More'}
                          </button>
                        </>
                      ) : (
                        <span> {med.notes} </span>
                      )}
                    </div>
                  )}
                  {/* If no issues, show safe message */}
                  {(!med.issues || med.issues.length === 0) && (
                    <p className="text-green-700">No safety issues detected.</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicationSafetyChecker;
