const express = require("express")
const router = express.Router()
const { addSchoolValidators, listSchoolsValidators } = require("../validators/validators")
const { pool } = require("../config/db")

function calDistances(lat1, lon1, lat2, lon2) {
    const R = 6371
    const toRad = (deg) => (deg * Math.PI) / 180

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

router.get("/", (req, res) => {
    res.send("School Management System")
})

router.post("/addSchool", addSchoolValidators, async (req, res) => {
    const { name, address, latitude, longitude } = req.body

    try {
        const [result] = await pool.query(
            "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
            [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
        )

        return res.status(201).json({
            success: true,
            message: "School added successfully",
            data: {
                id: result.insertId,
                name: name.trim(),
                address: address.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
        })
    } catch (err) {
        console.error("addSchool error:", err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
})

router.get("/listSchools", listSchoolsValidators, async (req, res) => {
    const userLat = parseFloat(req.query.latitude)
    const userLon = parseFloat(req.query.longitude)

    try {
        const [rows] = await pool.query(
            "SELECT id, name, address, latitude, longitude FROM schools"
        )

        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No schools found",
                data: [],
            })
        }

        const annotated = rows.map((school) => ({
            ...school,
            distance_km: parseFloat(
                calDistances(
                    userLat,
                    userLon,
                    school.latitude,
                    school.longitude
                ).toFixed(2)
            ),
        }))

        annotated.sort((a, b) => a.distance_km - b.distance_km)

        return res.status(200).json({
            success: true,
            message: "Schools retrieved and sorted by proximity",
            user_location: { latitude: userLat, longitude: userLon },
            total: annotated.length,
            data: annotated,
        });
    } catch (err) {
        console.error("listSchools error:", err)
        return res.status(500).json({
            success: false,
            message: "Internal server error – could not retrieve schools",
        })
    }
})

module.exports = router;