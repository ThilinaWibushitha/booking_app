import { sql } from "../config/db.js";

// Get all available slots
export const getAllSlots = async (req, res) => {
  try {
    const slots = await sql`SELECT * FROM slots WHERE isBooked = false`;
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots" });
  }
};

// Get a single slot by ID
export const getSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await sql`SELECT * FROM slots WHERE id = ${id}`;

    if (slot.length === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.status(200).json(slot[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slot" });
  }
};

// Create a new slot
export const createSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    // Ensure the same slot doesn't already exist
    const existingSlot = await sql`
      SELECT * FROM slots WHERE date = ${date} AND time = ${time}
    `;
    if (existingSlot.length > 0) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    const newSlot = await sql`
      INSERT INTO slots (date, time, isBooked) VALUES (${date}, ${time}, false) RETURNING *;
    `;

    res.status(201).json(newSlot[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot" });
  }
};

// Update a slot
export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    // Check if the slot exists
    const existingSlot = await sql`SELECT * FROM slots WHERE id = ${id}`;
    if (existingSlot.length === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const updatedSlot = await sql`
      UPDATE slots SET date = ${date}, time = ${time} WHERE id = ${id} RETURNING *;
    `;

    res.status(200).json(updatedSlot[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating slot" });
  }
};

// Delete a slot
export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the slot exists
    const existingSlot = await sql`SELECT * FROM slots WHERE id = ${id}`;
    if (existingSlot.length === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Prevent deleting booked slots
    if (existingSlot[0].isBooked) {
      return res.status(400).json({ message: "Cannot delete a booked slot" });
    }

    await sql`DELETE FROM slots WHERE id = ${id}`;

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting slot" });
  }
};
