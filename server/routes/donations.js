import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Helper to format donation with urgency and computed fields
function enrichDonation(donation) {
  const now = new Date().getTime();
  const expiryTime = new Date(donation.available_until).getTime();
  const minutesLeft = Math.round((expiryTime - now) / 60000);
  
  const isUrgent = donation.status === 'available' && minutesLeft > 0 && minutesLeft <= 120;
  const isExpired = donation.status === 'available' && minutesLeft <= 0;

  return {
    ...donation,
    minutes_left: minutesLeft,
    is_urgent: isUrgent,
    is_expired: isExpired,
    urgency_label: isExpired 
      ? 'Expired' 
      : isUrgent 
        ? `Expiring soon (~${minutesLeft} mins)` 
        : `${Math.max(0, Math.round(minutesLeft / 60))} hours left`
  };
}

// GET /api/donations - Browse all donations with filters
router.get('/', (req, res) => {
  const { status, food_type, search, urgent_only } = req.query;

  let query = `
    SELECT 
      d.*,
      u.name as donor_name,
      u.organization as donor_org,
      u.phone as donor_phone,
      c.id as claim_id,
      c.ngo_id,
      c.claimed_at,
      c.pickup_time,
      c.notes as claim_notes,
      ngo.name as ngo_name,
      ngo.organization as ngo_org
    FROM donations d
    JOIN users u ON d.donor_id = u.id
    LEFT JOIN claims c ON d.id = c.donation_id
    LEFT JOIN users ngo ON c.ngo_id = ngo.id
    WHERE 1=1
  `;
  const params = [];

  if (status && status !== 'all') {
    query += ' AND d.status = ?';
    params.push(status);
  }

  if (food_type && food_type !== 'all') {
    query += ' AND d.food_type = ?';
    params.push(food_type);
  }

  if (search && search.trim()) {
    query += ' AND (d.food_name LIKE ? OR d.description LIKE ? OR d.location LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY d.created_at DESC';

  const rows = db.prepare(query).all(...params);
  let enriched = rows.map(enrichDonation);

  if (urgent_only === 'true') {
    enriched = enriched.filter(d => d.is_urgent);
  }

  res.json({ donations: enriched, total: enriched.length });
});

// GET /api/donations/my - Donations created by authenticated user
router.get('/my', authMiddleware, (req, res) => {
  const query = `
    SELECT 
      d.*,
      c.id as claim_id,
      c.ngo_id,
      c.claimed_at,
      c.pickup_time,
      c.notes as claim_notes,
      ngo.name as ngo_name,
      ngo.organization as ngo_org,
      ngo.phone as ngo_phone
    FROM donations d
    LEFT JOIN claims c ON d.id = c.donation_id
    LEFT JOIN users ngo ON c.ngo_id = ngo.id
    WHERE d.donor_id = ?
    ORDER BY d.created_at DESC
  `;

  const rows = db.prepare(query).all(req.user.id);
  res.json({ donations: rows.map(enrichDonation) });
});

// GET /api/donations/:id - Single donation details
router.get('/:id', (req, res) => {
  const query = `
    SELECT 
      d.*,
      u.name as donor_name,
      u.organization as donor_org,
      u.phone as donor_phone,
      u.email as donor_email,
      c.id as claim_id,
      c.ngo_id,
      c.claimed_at,
      c.pickup_time,
      c.notes as claim_notes,
      ngo.name as ngo_name,
      ngo.organization as ngo_org,
      ngo.phone as ngo_phone
    FROM donations d
    JOIN users u ON d.donor_id = u.id
    LEFT JOIN claims c ON d.id = c.donation_id
    LEFT JOIN users ngo ON c.ngo_id = ngo.id
    WHERE d.id = ?
  `;

  const row = db.prepare(query).get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  const logs = db.prepare(`
    SELECT l.*, u.name as user_name 
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    WHERE l.donation_id = ?
    ORDER BY l.created_at ASC
  `).all(req.params.id);

  res.json({ donation: enrichDonation(row), logs });
});

// POST /api/donations - Create a new donation
router.post('/', authMiddleware, requireRole('donor', 'admin'), (req, res) => {
  const {
    food_name,
    food_type,
    quantity,
    unit = 'meals',
    description = '',
    location,
    pickup_address,
    available_from,
    available_until,
    image_url
  } = req.body;

  if (!food_name || !food_type || !quantity || !location || !pickup_address || !available_until) {
    return res.status(400).json({
      error: 'Please fill in food name, type, quantity, location, pickup address, and available until time.'
    });
  }

  const id = `don-${Date.now()}`;
  const fromTime = available_from || new Date().toISOString();
  
  // Default placeholder food image if none provided
  const fallbackImages = {
    cooked: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    packaged: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    fruits_veg: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80',
    other: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80'
  };

  const finalImage = image_url && image_url.trim() ? image_url.trim() : (fallbackImages[food_type] || fallbackImages.cooked);

  const insert = db.prepare(`
    INSERT INTO donations (
      id, donor_id, food_name, food_type, quantity, unit, description, 
      location, pickup_address, available_from, available_until, image_url, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
  `);

  insert.run(
    id,
    req.user.id,
    food_name.trim(),
    food_type,
    parseInt(quantity, 10),
    unit,
    description.trim(),
    location.trim(),
    pickup_address.trim(),
    fromTime,
    available_until,
    finalImage
  );

  // Add activity log
  db.prepare(`
    INSERT INTO activity_logs (id, donation_id, user_id, action, details)
    VALUES (?, ?, ?, 'DONATION_CREATED', ?)
  `).run(
    `log-${crypto.randomUUID()}`,
    id,
    req.user.id,
    `${req.user.name} created donation: ${quantity} ${unit} of ${food_name}`
  );

  const created = db.prepare('SELECT * FROM donations WHERE id = ?').get(id);
  res.status(201).json({ message: 'Donation created successfully', donation: enrichDonation(created) });
});

// PUT /api/donations/:id - Update donation
router.put('/:id', authMiddleware, (req, res) => {
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  // Only donor owner or admin can edit
  if (donation.donor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to edit this donation' });
  }

  const {
    food_name = donation.food_name,
    quantity = donation.quantity,
    unit = donation.unit,
    description = donation.description,
    location = donation.location,
    pickup_address = donation.pickup_address,
    available_until = donation.available_until,
    status = donation.status
  } = req.body;

  db.prepare(`
    UPDATE donations 
    SET food_name = ?, quantity = ?, unit = ?, description = ?, location = ?, pickup_address = ?, available_until = ?, status = ?
    WHERE id = ?
  `).run(
    food_name,
    parseInt(quantity, 10),
    unit,
    description,
    location,
    pickup_address,
    available_until,
    status,
    req.params.id
  );

  db.prepare(`
    INSERT INTO activity_logs (id, donation_id, user_id, action, details)
    VALUES (?, ?, ?, 'DONATION_UPDATED', ?)
  `).run(
    `log-${crypto.randomUUID()}`,
    req.params.id,
    req.user.id,
    `${req.user.name} updated donation details`
  );

  const updated = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  res.json({ message: 'Donation updated successfully', donation: enrichDonation(updated) });
});

// DELETE /api/donations/:id - Cancel or delete donation
router.delete('/:id', authMiddleware, (req, res) => {
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  if (donation.donor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to delete this donation' });
  }

  db.prepare('DELETE FROM donations WHERE id = ?').run(req.params.id);

  db.prepare(`
    INSERT INTO activity_logs (id, donation_id, user_id, action, details)
    VALUES (?, ?, ?, 'DONATION_DELETED', ?)
  `).run(
    `log-${crypto.randomUUID()}`,
    req.params.id,
    req.user.id,
    `${req.user.name} removed donation ${donation.food_name}`
  );

  res.json({ message: 'Donation removed successfully' });
});

export default router;
