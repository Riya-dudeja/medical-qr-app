import * as QRCode from 'qrcode';
import axios from 'axios';
import MedicalData from "../models/MedicalData.js";

/**
 * @desc   Get logged-in user's medical info
 * @route  GET /api/medical/me
 * @access Private
 */
const getMedicalInfo = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized: No user found." });
        }

        let medicalData = await MedicalData.findOne(
            { userId: req.user.id }
        ).populate("userId", "name");
        if (!medicalData) {
            medicalData = new MedicalData({ userId: req.user.id });
            await medicalData.save();
        }

        res.json(medicalData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc   Add or update medical information (merged add & edit)
 * @route  POST /api/medical/update
 * @access Private
 */
const updateMedicalInfo = async (req, res) => {
    try {
        const { bloodGroup, allergies, selectedAllergies, conditions, medications, emergencyContact } = req.body;

        if (!req.user?.id) {
            console.log("🔴 User ID missing in request!");
            return res.status(400).json({ error: "User ID missing" });
        }

        let medicalData = await MedicalData.findOne({ userId: req.user.id });

        if (!medicalData) {
            medicalData = new MedicalData({ userId: req.user.id });
        }

        medicalData.bloodGroup = bloodGroup ?? medicalData.bloodGroup;
        medicalData.allergies = allergies ?? medicalData.allergies;
        medicalData.selectedAllergies = selectedAllergies ?? medicalData.selectedAllergies;
        medicalData.conditions = conditions ?? medicalData.conditions;
        medicalData.medications = medications ?? medicalData.medications;
        medicalData.emergencyContact = emergencyContact ?? medicalData.emergencyContact;

        const qrCodeUrl = await generateQRCode(req.user.id);
        medicalData.qrCode = qrCodeUrl;

        await medicalData.save();

        res.status(200).json({
            message: "Medical info updated successfully!",
            data: medicalData,
            qrCodeUrl,
        });
    } catch (error) {
        console.error("🔴 Error updating medical info:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getNgrokUrl = async () => {
    try {
        const response = await axios.get("http://localhost:4040/api/tunnels");
        const tunnels = response.data.tunnels;
        const publicUrl = tunnels.tunnels[0].find(tunnel => tunnel.proto === "https")?.public_url;

        if (!publicUrl){
            console.error('🔴 Ngrok URL missing from response:', response.data);
            return null;
        }
        return publicUrl;
    } catch (error) {
        console.error("🔴 Error fetching ngrok URL:", error);
        return null;
    }
};


export const generateQRCode = async (userId) => {
    try {
        // Use production frontend URL for QR codes
        const frontendUrl = process.env.FRONTEND_URL || 'https://medical-qr-app.vercel.app';
        const qrUrl = `${frontendUrl}/qr-result/${userId}`;
        const qrCodeUrl = await QRCode.toDataURL(qrUrl);
        console.log("🔗 Generated QR URL:", qrUrl);
        return qrCodeUrl;
    } catch (err) {
        console.error("🔴 QR Code generation error:", err);
        throw new Error("QR Code generation failed");
    }
};

const getMedicalQR = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({ error: "User ID missing" });
        }

        const medicalInfo = await MedicalData.findOne(
            { userId: req.user.id }
        ).populate("userId", "name");

        if (!medicalInfo) {
            return res.status(404).json({ error: "Medical info not found" });
        }

        console.log("🔍 Medical Info from DB:", medicalInfo);

        // Generate QR code with proper URL
        const qrUrl = `https://medical-qr-app.vercel.app/qr-result/${req.user.id}`;
        const qrCodeUrl = await QRCode.toDataURL(qrUrl);

        res.status(200).json({ 
            qrCodeUrl,
            qrUrl: qrUrl
        });

    } catch (error) {
        console.error("Error fetching QR data:", error);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @desc   Get medical info by user ID (For QR Scan)
 * @route  GET /qr-result/:userId
 * @access Public
 */
const getMedicalInfoByQR = async (req, res) => {
    try {
        const { userId } = req.params;

        const medicalInfo = await MedicalData.findOne({ userId }).populate("userId", "name");;

        if (!medicalInfo) {
            return res.status(404).json({ message: "Medical information not found." });
        }

        res.status(200).json({
            name: medicalInfo.userId.name || "Unknown",
            bloodGroup: medicalInfo.bloodGroup || "N/A",
            allergies: medicalInfo.allergies || [],
            conditions: medicalInfo.conditions ? [medicalInfo.conditions] : [],
            medications: medicalInfo.medications ? [medicalInfo.medications] : [],
            emergencyContact: Array.isArray(medicalInfo.emergencyContact) ? medicalInfo.emergencyContact : []
        });

    } catch (error) {
        console.error("🔴 Error retrieving medical info via QR:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export { getMedicalInfo, updateMedicalInfo, getMedicalQR, getMedicalInfoByQR };
