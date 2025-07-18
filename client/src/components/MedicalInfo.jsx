import React, { useState, useEffect } from "react";
import Card from './Card';
import CardContent from './CardContent';
import Input from "./Input";
import Button from "./Button";
import Label from "./Label";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import api from '../services/api.js';

const commonAllergies = ["Peanuts", "Dairy", "Gluten", "Seafood", "Soy", "Eggs", "Shellfish"];

const MedicalInfoForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showAllAllergies, setShowAllAllergies] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    allergies: [],
    conditions: "",
    medications: "",
    emergencyContact:[{ name: "", email:"", phone: "", relation: "", city: "", priority: "" }],
  });
  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    fetchMedicalInfo();
  }, []);

  const fetchMedicalInfo = async () => {
    try {
      const res = await api.get("/api/medical/me");
      
      const data = res.data;
      if (data) {
        setFormData({
          bloodGroup: data.bloodGroup || "",
          allergies: data.allergies || [],
          conditions: data.conditions || "",
          medications: data.medications || "",
          emergencyContact: data.emergencyContact?.length 
            ? data.emergencyContact 
            : [{ name: "", email: "", phone: "", relation: "", city: "", priority: "" }]
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session Expired! Try logging in again");
        console.error("Unauthorized: Invalid token or session expired.");
        navigate('/');
        return;
      }
      if (error.response?.status === 404) {
        console.warn("Medical info not found. The user might be new.");
        setFormData((prev) => ({
          ...prev,
          bloodGroup: "",
          allergies: [],
          conditions: "",
          medications: "",
          emergencyContact: []
        }));
        return;
      }
      console.error("Error fetching medical info:", error);
      toast.error("Failed to load medical information");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAllergyChange = (e, allergy) => {
    const { checked } = e.target;
    setFormData(prev => {
      const customAllergies = prev.allergies.filter(a => !commonAllergies.includes(a));
      let newCommonAllergies;
      if (checked) {
        newCommonAllergies = [...prev.allergies.filter(a => commonAllergies.includes(a)), allergy];
      } else {
        newCommonAllergies = prev.allergies.filter(a => commonAllergies.includes(a) && a !== allergy);
      }
      return {
        ...prev,
        allergies: [...newCommonAllergies, ...customAllergies]
      };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log("Current formData:", formData);

    if (!formData.bloodGroup) {
      toast.error("Please select a blood group.");
      return;
    }

    if (!formData.allergies || formData.allergies.length === 0) {
      toast.error("Please select at least one allergy or enter a custom one.");
      return;
    }

    if (!formData.conditions) {
      toast.error("Please enter medical conditions.");
      return;
    }

    if (!formData.medications) {
      toast.error("Please enter medications.");
      return;
    }

    setStep(2);
    console.log("Step changed to 2");
  };


  const handlePrev = (e) =>{
    e.preventDefault();
    setStep(1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalidContact = formData.emergencyContact.some(contact =>
      !contact.name?.trim() || !contact.phone?.trim() || !contact.relation?.trim()
    );
    if (invalidContact) {
      toast.error("Please fill out all emergency contact details.");
      return;
    }

    try {
      console.log("Submitting Data:", JSON.stringify(formData, null, 2));

      const res = await api.post("/api/medical/add", formData);
      console.log("API Response:", res.data);

      toast.success("Medical info updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update medical info";
      toast.error(errorMessage);
    }
  };

  const handleAddEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: [
        ...prev.emergencyContact,
        { name: '', email: '', phone: '', relation: '', city: '', priority: '' }
      ]
    }));
  };

  const handleEmergencyContactChange = (index) => (e) => {
    const { name, value } = e.target;
    const fieldName = name.split(".")[1];

    setFormData((prev) => {
      const updatedContacts = [...prev.emergencyContact];
      updatedContacts[index] = { ...updatedContacts[index], [fieldName]: value, };
      console.log('Updated formData:', { ...prev, emergencyContact: updatedContacts });
      return { ...prev, emergencyContact: updatedContacts };
    });
  };

  const handleRemoveEmergencyContact = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: prev.emergencyContact.filter((_, i) => i !== indexToRemove)
    }));
  };

  return (
    <div className="max-w-xl mx-auto w-90">
      <div className="border-0 rounded-2xl g-gradient-to-br from-blue-50 to-gray-100 p-5">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Medical Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-800 font-semibold">Blood Group</Label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="px-4 py-2.5 border rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-900 font-medium w-full focus:outline-none  focus:border-blue-400  border-gray-400"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-800 font-semibold">Allergies</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(showAllAllergies ? commonAllergies : commonAllergies.slice(0, 2)).map((allergy) => (
                      <label key={allergy} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={allergy}
                          checked={formData.allergies?.includes(allergy) || false}
                          onChange={(e) => handleAllergyChange(e, allergy)}
                          className="form-checkbox"
                        />
                        <span>{allergy}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllAllergies(!showAllAllergies)} className="text-blue-800 text-sm mt-2">
                    {showAllAllergies ? "Show Less" : "Show More"}
                  </button>
                  <Input
                    name="allergies"
                    value={formData.allergies.filter(a => !commonAllergies.includes(a)).join(", ")}
                    onChange={e => {
                      const customAllergies = e.target.value
                        .split(",")
                        .map(a => a.trim())
                        .filter(a => a && !commonAllergies.includes(a));
                      setFormData(prev => ({
                        ...prev,
                        allergies: [
                          // Keep all checked common allergies
                          ...prev.allergies.filter(a => commonAllergies.includes(a)),
                          // Plus the custom ones from the input
                          ...customAllergies
                        ]
                      }));
                    }}
                    placeholder="Other allergies (comma separated)"
                    className="p-3 border shadow-sm focus:ring-2 focus:ring-blue-300 w-full mt-2"
                  />
                </div>
                <div>
                  <Label className="text-gray-800 font-semibold">Medical Conditions</Label>
                  <Input
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleChange}
                    placeholder="Enter any medical conditions"
                    className="p-3 border shadow-sm w-full"
                  />
                </div>
                <div>
                  <Label className="text-gray-800 font-semibold">Medications</Label>
                  <Input
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="Enter medications you're taking"
                    className="p-3 border shadow-sm w-full"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                {Array.isArray(formData.emergencyContact) && formData.emergencyContact.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200"
                  >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <h3 className="text-lg font-semibold text-blue-900">
                      Emergency Contact {index + 1}
                    </h3>
                    <span className="text-gray-500">
                      {expandedIndex === index ? "▼" : "►"}
                    </span>
                  </div>
                  <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, padding: 3 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 space-y-4"
                    >
                      <Input
                        name={`emergencyContact[${index}].name`}
                        value={contact.name}
                        onChange={handleEmergencyContactChange(index)}
                        placeholder="Contact Name"
                      />
                      <Input
                        name={`emergencyContact[${index}].email`}
                        value={contact.email}
                        onChange={handleEmergencyContactChange(index)}
                        placeholder="Contact Email address"
                      />
                      <Input
                        name={`emergencyContact[${index}].phone`}
                        value={contact.phone}
                        onChange={handleEmergencyContactChange(index)}
                        placeholder="Phone Number"
                      />
                      <select
                        name={`emergencyContact[${index}].relation`}
                        value={contact.relation}
                        onChange={handleEmergencyContactChange(index)}
                        className="px-4 py-2.5 border rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-900 font-medium w-full focus:outline-none  focus:border-blue-400  border-gray-400"
                      >
                        <option value="">Relation</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                      <Input
                        name={`emergencyContact[${index}].city`}
                        value={contact.city}
                        onChange={handleEmergencyContactChange(index)}
                        placeholder="City"
                      />
                      <Input
                        name={`emergencyContact[${index}].priority`}
                        value={contact.priority}
                        onChange={handleEmergencyContactChange(index)}
                        placeholder="Priority (1 is highest)"
                        type="number"
                      />

                      <button
                        onClick={() => handleRemoveEmergencyContact(index)}
                        className="text-red-600 text-sm underline"
                      >
                        Remove this contact
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                </motion.div>
                ))}

                {/* Add More Emergency Contact Button */}
                <div className="flex justify-between gap-4 mt-4">
                  <Button
                    type="button"
                    onClick={handleAddEmergencyContact}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
                  >
                    Add More
                  </Button>

                  <Button
                    type="button"
                    onClick={handlePrev}
                    className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default MedicalInfoForm;