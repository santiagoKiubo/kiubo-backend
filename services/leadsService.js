// services/leadsService.js
const { pool } = require("../src/db/client");

// Create a lead row
async function createLead(lead) {
  const {
    phone,
    product,
    name,
    age,
    city,
    incomeRange,
    familyMembers,
    currentInsurer,
    coverageAmount,
    preexistingConditions,
    assignedBrokerId,
    status = "collecting",
  } = lead;

  const query = `
    INSERT INTO leads (
      phone,
      product,
      name,
      age,
      city,
      income_range,
      family_members,
      current_insurer,
      coverage_amount,
      preexisting_conditions,
      assigned_broker_id,
      status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING id;
  `;

  const values = [
    phone,
    product,
    name,
    age,
    city,
    incomeRange,
    familyMembers,
    currentInsurer,
    coverageAmount,
    preexistingConditions,
    assignedBrokerId,
    status,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

// We can add more helpers later: updateLeadStatus, rateLead, etc.
module.exports = { createLead };
