import React, { useState, useEffect } from "react";

const MedicalInfoCard = ({ qrData }) => {
  const [medicalInfo, setMedicalInfo] = useState(null);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(qrData);
      setMedicalInfo(parsedData);
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  }, [qrData]);

  if (!medicalInfo) {
    return <p className="text-center text-red-500 font-semibold mt-8">Invalid QR data</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-8 flex flex-col items-center my-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 shadow">
        <span className="text-3xl">🚑</span>
      </div>
      <h2 className="text-2xl font-extrabold text-blue-800 mb-2 text-center tracking-tight">Emergency Medical Info</h2>
      <div className="w-full mt-2 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🩸</span>
          <span className="font-semibold">Blood Group:</span>
          <span className="ml-auto text-blue-700 font-bold">{medicalInfo.bloodGroup}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <span className="font-semibold">Allergies:</span>
          <span className="ml-auto text-gray-800">{medicalInfo.allergies?.length ? medicalInfo.allergies.join(", ") : "None"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">💊</span>
          <span className="font-semibold">Medications:</span>
          <span className="ml-auto text-gray-800">{medicalInfo.medications?.length ? medicalInfo.medications.join(", ") : "None"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🏥</span>
          <span className="font-semibold">Conditions:</span>
          <span className="ml-auto text-gray-800">{medicalInfo.conditions?.length ? medicalInfo.conditions.join(", ") : "None"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📞</span>
          <span className="font-semibold">Emergency Contact:</span>
          <span className="ml-auto text-gray-800">{medicalInfo.emergencyContact || "Not Available"}</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalInfoCard;
