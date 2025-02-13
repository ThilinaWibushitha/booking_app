import { sql } from "../config/db.js";

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await sql`SELECT * FROM appointments`;
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await sql`SELECT * FROM appointments WHERE id = ${id}`;

    if (appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment" });
  }
};

// Create an appointment
export const createAppointment = async (req, res) => {
  try {
    const { userName, email, phone, slotId } = req.body;

    // Check if the slot is already booked
    const slot = await sql`SELECT * FROM slots WHERE id = ${slotId}`;
    if (!slot.length) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot[0].isBooked) {
      return res.status(400).json({ message: "Slot is already booked" });
    }

    // Create the appointment
    const appointment = await sql`
      INSERT INTO appointments (userName, email, phone, slotId, date, time)
      VALUES (${userName}, ${email}, ${phone}, ${slotId}, ${slot[0].date}, ${slot[0].time})
      RETURNING *;
    `;

    // Mark the slot as booked
    await sql`UPDATE slots SET isBooked = true WHERE id = ${slotId}`;

    res.status(201).json(appointment[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment" });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, phone } = req.body;

    // Check if the appointment exists
    const existingAppointment =
      await sql`SELECT * FROM appointments WHERE id = ${id}`;
    if (!existingAppointment.length) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the appointment
    const updatedAppointment = await sql`
      UPDATE appointments
      SET userName = ${userName}, email = ${email}, phone = ${phone}
      WHERE id = ${id}
      RETURNING *;
    `;

    res.status(200).json(updatedAppointment[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the appointment exists
    const existingAppointment =
      await sql`SELECT * FROM appointments WHERE id = ${id}`;
    if (!existingAppointment.length) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Free the slot before deleting the appointment
    await sql`UPDATE slots SET isBooked = false WHERE id = ${existingAppointment[0].slotId}`;

    // Delete the appointment
    await sql`DELETE FROM appointments WHERE id = ${id}`;

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
