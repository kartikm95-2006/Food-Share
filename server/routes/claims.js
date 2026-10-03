import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/claims/:donationId - NGO claims an available donation
router.post('/:donationId', authMiddleware, requireRole('ngo', 'admin'), (req, res) => {
  const { donationId } = req.params;
  const { notes = '', pickup_time } = req.body;

  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(donationId);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  if (donation.status !== 'available') {
    return res.status(400).json({ error: `Cannot claim donation. Current status: ${donation.status}` });
  }

  const claimId = `clm-${Date.now()}`;
  const estimatedPickup = pickup_time || new Date(Date.now() + 60 * 60000).toISOString();

  const insertClaim = db.prepare(`
    INSERT INTO claims (id, donation_id, ngo_id, claimed_at, pickup_time, notes, status)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, 'active')
  `);

  const updateDonation = db.prepare(`
    UPDATE donations SET status = 'claimed' WHERE id = ?
  `);

  const insertLog = db.prepare(`
    INSERT INTO activity_logs (id, donation_id, user_id, action, details)
    VALUES (?, ?, ?, 'DONATION_CLAIMED', ?)
  `);

  // Execute in transaction
  const executeClaim = db.transaction(() => {
    insertClaim.run(claimId, donationId, req.user.id, estimatedPickup, notes);
    updateDonation.run(donationId);
    insertLog.run(
      `log-${crypto.randomUUID()}`,
      donationId,
      req.user.id,
      `${req.user.name} (${req.user.organization || 'NGO'}) claimed donation of ${donation.quantity} ${donation.unit} ${donation.food_name}`
    );
  });

  executeClaim();

  res.status(201).json({
    message: 'Donation claimed successfully! Please coordinate pickup.',
    claimId,
    donationId,
    status: 'claimed'
  });
});

// PUT /api/claims/:claimId/status - Update pickup and completion status
// Accepts: { status: 'picked_up' | 'completed' }
router.put('/:claimId/status', authMiddleware, (req, res) => {
  const { claimId } = req.params;
  const { status } = req.body;

  if (!['picked_up', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be picked_up or completed' });
  }

  const claim = db.prepare(`
    SELECT c.*, d.food_name, d.quantity, d.unit 
    FROM claims c
    JOIN donations d ON c.donation_id = d.id
    WHERE c.id = ?
  `).get(claimId);

  if (!claim) {
    return res.status(404).json({ error: 'Claim record not found' });
  }

  // Update claim and donation status
  const updateClaim = db.prepare(`
    UPDATE claims SET status = ? WHERE id = ?
  `);
  const updateDonation = db.prepare(`
    UPDATE donations SET status = ? WHERE id = ?
  `);
  const insertLog = db.prepare(`
    INSERT INTO activity_logs (id, donation_id, user_id, action, details)
    VALUES (?, ?, ?, ?, ?)
  `);

  const actionName = status === 'picked_up' ? 'DONATION_PICKED_UP' : 'DONATION_COMPLETED';
  const detailText = status === 'picked_up'
    ? `${req.user.name} picked up ${claim.food_name}`
    : `${req.user.name} marked ${claim.food_name} as successfully delivered & completed! 🎉`;

  const runUpdate = db.transaction(() => {
    updateClaim.run(status === 'completed' ? 'completed' : 'active', claimId);
    updateDonation.run(status, claim.donation_id);
    insertLog.run(`log-${crypto.randomUUID()}`, claim.donation_id, req.user.id, actionName, detailText);
  });

  runUpdate();

  res.json({
    message: `Status successfully updated to ${status}`,
    claimId,
    donationId: claim.donation_id,
    newStatus: status
  });
});

// GET /api/claims/my - Claims for current NGO
router.get('/my', authMiddleware, (req, res) => {
  const query = `
    SELECT 
      c.*,
      d.food_name,
      d.food_type,
      d.quantity,
      d.unit,
      d.location,
      d.pickup_address,
      d.available_from,
      d.available_until,
      d.image_url,
      d.status as donation_status,
      u.name as donor_name,
      u.organization as donor_org,
      u.phone as donor_phone
    FROM claims c
    JOIN donations d ON c.donation_id = d.id
    JOIN users u ON d.donor_id = u.id
    WHERE c.ngo_id = ?
    ORDER BY c.claimed_at DESC
  `;

  const claims = db.prepare(query).all(req.user.id);
  res.json({ claims });
});

export default router;
