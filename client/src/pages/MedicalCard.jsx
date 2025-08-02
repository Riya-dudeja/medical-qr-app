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
    <Card sx={{ 
      maxWidth: 450, 
      mx: "auto", 
      mt: 4, 
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)", 
      borderRadius: 12,
    }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <div style={{
          backgroundColor: "#dc2626",
          color: "white",
          padding: "12px 16px",
          textAlign: "center",
          borderRadius: "16px 16px 0 0"
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Emergency Medical Info
          </Typography>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Patient Info */}
          <div style={{ marginBottom: "16px" }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: "#374151", 
              marginBottom: "8px",
              fontSize: "0.95rem"
            }}>
              Patient Information
            </Typography>
            
            <Typography variant="body1" sx={{ marginBottom: "4px" }}>
              <strong>Name:</strong> {data?.userId?.name || data?.name || "N/A"}
            </Typography>
            
            <Typography variant="body1" sx={{ marginBottom: "8px" }}>
              <strong>Blood Type:</strong> <span style={{ color: "#dc2626", fontWeight: 600 }}>
                {data?.bloodGroup || "Unknown"}
              </span>
            </Typography>
          </div>

          <Divider sx={{ my: 2 }} />

          {/* Medical Info */}
          <div style={{ marginBottom: "16px" }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: "#dc2626", 
              marginBottom: "8px",
              fontSize: "0.95rem"
            }}>
              Critical Medical Information
            </Typography>
            
            <Typography variant="body2" sx={{ marginBottom: "4px" }}>
              <strong>Drug Allergies:</strong> {
                flattenArray(data?.drugAllergies || data?.allergies).length 
                  ? flattenArray(data?.drugAllergies || data?.allergies).slice(0, 3).join(", ")
                  : "None known"
              }
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: "4px" }}>
              <strong>Medical Conditions:</strong> {
                flattenArray(data?.conditions).length 
                  ? flattenArray(data.conditions).slice(0, 3).join(", ")
                  : "None known"
              }
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: "4px" }}>
              <strong>Current Medications:</strong> {
                flattenArray(data?.medications).length 
                  ? flattenArray(data.medications).slice(0, 2).join(", ") + (flattenArray(data.medications).length > 2 ? "..." : "")
                  : "None listed"
              }
            </Typography>

            {data?.medicalDevices && (
              <Typography variant="body2" sx={{ marginBottom: "4px" }}>
                <strong>Medical Devices:</strong> {data.medicalDevices}
              </Typography>
            )}
          </div>

          <Divider sx={{ my: 2 }} />

          {/* Emergency Contacts */}
          <div style={{ marginBottom: "12px" }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600, 
              color: "#374151", 
              marginBottom: "8px",
              fontSize: "0.95rem"
            }}>
              Emergency Contacts
            </Typography>

            {(data?.emergencyContact || []).slice(0, 2).map((contact, index) => (
              <div key={index} style={{ 
                marginBottom: 8, 
                padding: "10px",
                backgroundColor: index === 0 ? "#f8fafc" : "#ffffff", 
                border: "1px solid #e5e7eb",
                borderRadius: "6px"
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: index === 0 ? "#1e40af" : "#374151",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  marginBottom: "2px"
                }}>
                  {index === 0 ? "Primary" : "Secondary"}
                </Typography>
                
                <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: "2px" }}>
                  {contact.name || "N/A"}
                </Typography>
                
                <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  {contact.relation || "N/A"} • {contact.phone || "N/A"}
                </Typography>
              </div>
            ))}

            {(data?.emergencyContact || []).length === 0 && (
              <Typography variant="body2" sx={{ 
                color: "#6b7280", 
                fontStyle: "italic", 
                textAlign: "center", 
                py: 1
              }}>
                No emergency contacts
              </Typography>
            )}

            {/* Primary Doctor */}
            {data?.primaryDoctor && (
              <div style={{ 
                marginTop: 8,
                padding: "8px",
                backgroundColor: "#f0f9ff", 
                border: "1px solid #bfdbfe",
                borderRadius: "6px"
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: "#1e40af",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  marginBottom: "2px"
                }}>
                  Primary Doctor
                </Typography>
                
                <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#1e40af" }}>
                  {data.primaryDoctor.name || "N/A"} • {data.primaryDoctor.phone || "N/A"}
                </Typography>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "6px",
            padding: "10px",
            textAlign: "center"
          }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 500,
              color: "#92400e",
              fontSize: "0.8rem"
            }}>
              FOR EMERGENCY USE ONLY
            </Typography>
            <Typography variant="body2" sx={{ 
              color: "#92400e",
              fontSize: "0.7rem",
              mt: 0.5
            }}>
              Call 911 for life-threatening emergencies • Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalCard;