import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Typography, Divider, CircularProgress, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const MedicalCard = ({ data : propData }) => {
  const location = useLocation();
  const data = propData || location.state?.data || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!data) {
      setLoading(false);
      setError(true);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  const renderMissingDataMessage = (field) => (
    <Typography variant="body2" sx={{ color: "gray", fontStyle: "italic" }}>
      {field || "Data Missing"}
    </Typography>
  );

  const flattenArray = (arr) => (Array.isArray(arr) ? arr.flat(Infinity).filter(Boolean) : []);


  if (loading) {
    return (
      <Card sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2, boxShadow: 3, borderRadius: 8 }}>
        <CardContent>
          <center><CircularProgress /></center>
          <Typography variant="h6" sx={{ mt: 2 }}>Loading Medical Data...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Error state rendering
  if (error) {
    return (
      <Card sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2, boxShadow: 3, borderRadius: 8 }}>
        <CardContent>
          <Typography variant="h6" color="error">Failed to load medical data</Typography>
        </CardContent>
      </Card>
    );
  }

  // Main content rendering
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 flex flex-col items-center my-8">
      {/* Header */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 shadow">
        <span className="text-3xl">🚑</span>
      </div>
      <h2 className="text-2xl font-extrabold text-blue-800 mb-2 text-center tracking-tight">Emergency Medical Info</h2>
      <div className="w-full mt-2 space-y-3 text-gray-700">
        {/* Patient Info */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Name:</span>
          <span className="ml-auto text-gray-800">{data?.userId?.name || data?.name || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Blood Type:</span>
          <span className="ml-auto text-blue-700 font-bold">{data?.bloodGroup || "Unknown"}</span>
        </div>
        {/* Medical Info */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Drug Allergies:</span>
          <span className="ml-auto text-gray-800">{
            flattenArray(data?.drugAllergies || data?.allergies).length 
              ? flattenArray(data?.drugAllergies || data?.allergies).slice(0, 3).join(", ")
              : "None known"
          }</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Medical Conditions:</span>
          <span className="ml-auto text-gray-800">{
            flattenArray(data?.conditions).length 
              ? flattenArray(data.conditions).slice(0, 3).join(", ")
              : "None known"
          }</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Current Medications:</span>
          <span className="ml-auto text-gray-800">{
            flattenArray(data?.medications).length 
              ? flattenArray(data.medications).slice(0, 2).join(", ") + (flattenArray(data.medications).length > 2 ? "..." : "")
              : "None listed"
          }</span>
        </div>
        {data?.medicalDevices && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Medical Devices:</span>
            <span className="ml-auto text-gray-800">{data.medicalDevices}</span>
          </div>
        )}
        {/* Emergency Contacts */}
        <div className="flex flex-col gap-2 mt-4">
          <span className="font-semibold text-gray-700">Emergency Contacts:</span>
          {(data?.emergencyContact || []).slice(0, 2).map((contact, index) => (
            <div key={index} className={`flex flex-col p-3 rounded-lg border ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <span className="text-xs font-bold uppercase text-blue-700 mb-1">{index === 0 ? "Primary" : "Secondary"}</span>
              <span className="font-semibold">{contact.name || "N/A"}</span>
              <span className="text-xs text-gray-500">{contact.relation || "N/A"} • {contact.phone || "N/A"}</span>
            </div>
          ))}
          {(data?.emergencyContact || []).length === 0 && (
            <span className="italic text-gray-400 text-center py-1">No emergency contacts</span>
          )}
        </div>
        {/* Primary Doctor */}
        {data?.primaryDoctor && (
          <div className="flex flex-col p-3 rounded-lg border bg-blue-50 border-blue-200 mt-2">
            <span className="text-xs font-bold uppercase text-blue-700 mb-1">Primary Doctor</span>
            <span className="font-semibold">{data.primaryDoctor.name || "N/A"}</span>
            <span className="text-xs text-blue-700">{data.primaryDoctor.phone || "N/A"}</span>
          </div>
        )}
        {/* Footer */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center mt-4">
          <span className="block font-semibold text-yellow-800 text-xs">FOR EMERGENCY USE ONLY</span>
          <span className="block text-yellow-800 text-xs mt-1">Call 911 for life-threatening emergencies • Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalCard;