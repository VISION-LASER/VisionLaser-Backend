// src/models/dashboard.model.js
const db = require('../config/connectDatabase');

const DashboardModel = {

  // Enregistrer une visite
  async recordVisit(data) {
    const { page, region, device, language, sessionId } = data;
    try {
      const pool = db.db; // Accéder au pool via db.db
      const [result] = await pool.execute(
        `INSERT INTO visits (page, region, device, language, session_id, visited_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [page, region || 'Inconnue', device || 'Inconnu', language || 'fr', sessionId]
      );
      return result;
    } catch (error) {
      console.error('recordVisit DB error:', error);
      throw error;
    }
  },

  // Stats globales
  async getGlobalStats(days = 30) {
    try {
      const pool = db.db;
      const [rows] = await pool.execute(
        `SELECT
          COUNT(DISTINCT session_id) AS total_visitors,
          COUNT(*) AS total_page_views,
          ROUND(COUNT(*) / NULLIF(COUNT(DISTINCT session_id), 0), 1) AS pages_per_visit,
          ROUND(
            SUM(CASE WHEN session_page_count = 1 THEN 1 ELSE 0 END)
            / NULLIF(COUNT(DISTINCT session_id), 0) * 100, 1
          ) AS bounce_rate,
          ROUND(AVG(session_duration), 0) AS avg_duration_seconds
        FROM (
          SELECT
            session_id,
            COUNT(*) AS session_page_count,
            TIMESTAMPDIFF(SECOND, MIN(visited_at), MAX(visited_at)) AS session_duration
          FROM visits
          WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY session_id
        ) AS sessions`,
        [days]
      );
      return rows[0] || {
        total_visitors: 0,
        total_page_views: 0,
        pages_per_visit: 0,
        bounce_rate: 0,
        avg_duration_seconds: 0
      };
    } catch (error) {
      console.error('getGlobalStats DB error:', error);
      throw error;
    }
  },

  // Évolution des visites
  async getVisitsPerDay(days = 7) {
    try {
      const pool = db.db;
      const [rows] = await pool.execute(
        `SELECT
           DATE(visited_at) AS date,
           COUNT(DISTINCT session_id) AS visitors,
           COUNT(*) AS page_views
         FROM visits
         WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY DATE(visited_at)
         ORDER BY date ASC`,
        [days]
      );
      return rows;
    } catch (error) {
      console.error('getVisitsPerDay DB error:', error);
      return [];
    }
  },

  // Visiteurs par région
  async getVisitorsByRegion(days = 30) {
    try {
      const pool = db.db;
      const [rows] = await pool.execute(
        `SELECT
           region,
           COUNT(DISTINCT session_id) AS visitors
         FROM visits
         WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY region
         ORDER BY visitors DESC`,
        [days]
      );
      return rows;
    } catch (error) {
      console.error('getVisitorsByRegion DB error:', error);
      return [];
    }
  },

  // Pages les plus visitées
  async getTopPages(days = 30, limit = 5) {
    try {
      const pool = db.db;
      const [rows] = await pool.execute(
        `SELECT
           page,
           COUNT(*) AS visits
         FROM visits
         WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY page
         ORDER BY visits DESC
         LIMIT ?`,
        [days, limit]
      );
      return rows;
    } catch (error) {
      console.error('getTopPages DB error:', error);
      return [];
    }
  },

  // Nouveaux vs visiteurs récurrents
  async getNewVsReturning(days = 30) {
    try {
      const pool = db.db;
      const [rows] = await pool.execute(
        `SELECT
           SUM(CASE WHEN first_visit >= DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 ELSE 0 END) AS new_visitors,
           SUM(CASE WHEN first_visit < DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 ELSE 0 END) AS returning_visitors
         FROM (
           SELECT session_id, MIN(visited_at) AS first_visit
           FROM visits
           GROUP BY session_id
         ) AS s`,
        [days, days]
      );
      return rows[0] || { new_visitors: 0, returning_visitors: 0 };
    } catch (error) {
      console.error('getNewVsReturning DB error:', error);
      return { new_visitors: 0, returning_visitors: 0 };
    }
  },
};

module.exports = DashboardModel;