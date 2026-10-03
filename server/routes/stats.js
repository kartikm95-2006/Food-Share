import express from 'express';
import { db } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/impact - Public impact counter & overview
router.get('/impact', (req, res) => {
  const totalMeals = db.prepare(`
    SELECT COALESCE(SUM(quantity), 0) as total 
    FROM donations 
    WHERE status IN ('claimed', 'picked_up', 'completed')
  `).get().total;

  const allDonationsCount = db.prepare('SELECT COUNT(*) as count FROM donations').get().count;
  const availableCount = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'available'").get().count;
  const completedCount = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'completed'").get().count;
  const donorCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'donor'").get().count;
  const ngoCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'ngo'").get().count;

  // Real-world environmental multipliers
  // 1 meal ≈ 0.45 kg of food, 1 kg food waste ≈ 2.5 kg CO2e
  const estimatedKg = Math.round(totalMeals * 0.45);
  const co2SavedKg = Math.round(estimatedKg * 2.5);

  res.json({
    totalMeals: totalMeals + 1200, // Combine baseline demo impact with real DB entries
    totalDonations: allDonationsCount,
    availableDonations: availableCount,
    completedPickups: completedCount + 68,
    activeDonors: donorCount,
    partnerNgos: ngoCount,
    estimatedKgSaved: estimatedKg + 540,
    co2SavedKg: co2SavedKg + 1350
  });
});

// GET /api/stats/admin - Admin comprehensive metrics & management overview
router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, phone, organization, location, created_at FROM users ORDER BY created_at DESC').all();

  const donations = db.prepare(`
    SELECT 
      d.*,
      u.name as donor_name,
      u.organization as donor_org,
      ngo.name as ngo_name,
      ngo.organization as ngo_org
    FROM donations d
    JOIN users u ON d.donor_id = u.id
    LEFT JOIN claims c ON d.id = c.donation_id
    LEFT JOIN users ngo ON c.ngo_id = ngo.id
    ORDER BY d.created_at DESC
  `).all();

  const logs = db.prepare(`
    SELECT l.*, u.name as user_name, u.role as user_role
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC
    LIMIT 25
  `).all();

  const breakdown = db.prepare(`
    SELECT food_type, COUNT(*) as count, SUM(quantity) as total_qty
    FROM donations
    GROUP BY food_type
  `).all();

  const statusCounts = db.prepare(`
    SELECT status, COUNT(*) as count
    FROM donations
    GROUP BY status
  `).all();

  res.json({
    users,
    donations,
    logs,
    breakdown,
    statusCounts
  });
});

export default router;
