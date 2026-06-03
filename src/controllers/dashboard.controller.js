const DashboardModel = require('../models/dashboard.model');

const DashboardController = {

  async recordVisit(req, res) {
    try {
      console.log('📊 recordVisit body:', req.body);
      const { page, region, device, language, sessionId } = req.body;

      if (!page || !sessionId) {
        return res.status(400).json({ error: 'page et sessionId sont requis' });
      }

      const result = await DashboardModel.recordVisit({ page, region, device, language, sessionId });
      return res.status(201).json({ success: true });
    } catch (err) {
      console.error('❌ recordVisit error:', err);
      return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    }
  },

  async getStats(req, res) {
    try {
      console.log('📊 getStats appelé');
      const days = parseInt(req.query.days) || 30;
      console.log('📊 days:', days);

      const [global, perDay, byRegion, topPages, newVsReturning] = await Promise.all([
        DashboardModel.getGlobalStats(days),
        DashboardModel.getVisitsPerDay(7),
        DashboardModel.getVisitorsByRegion(days),
        DashboardModel.getTopPages(days),
        DashboardModel.getNewVsReturning(days),
      ]);

      console.log('✅ global:', global);
      console.log('✅ perDay length:', perDay?.length);
      console.log('✅ byRegion length:', byRegion?.length);
      console.log('✅ topPages length:', topPages?.length);
      console.log('✅ newVsReturning:', newVsReturning);

      const totalRegionVisitors = byRegion.reduce((sum, r) => sum + r.visitors, 0);
      const regionsWithPercent = byRegion.map((r) => ({
        ...r,
        percentage: totalRegionVisitors
          ? Math.round((r.visitors / totalRegionVisitors) * 100)
          : 0,
      }));

      const avgSec = global?.avg_duration_seconds || 0;
      const avgFormatted = `${Math.floor(avgSec / 60)}m ${avgSec % 60}s`;

      const totalVisitors = (newVsReturning?.new_visitors || 0) + (newVsReturning?.returning_visitors || 0);
      const newPercent = totalVisitors
        ? Math.round((newVsReturning.new_visitors / totalVisitors) * 100)
        : 0;

      const response = {
        global: {
          total_visitors: global?.total_visitors || 0,
          total_page_views: global?.total_page_views || 0,
          pages_per_visit: global?.pages_per_visit || 0,
          bounce_rate: global?.bounce_rate || 0,
          avg_duration: avgFormatted,
          new_visitors_percent: newPercent,
        },
        visits_per_day: perDay || [],
        regions: regionsWithPercent || [],
        top_pages: topPages || [],
      };

      console.log('📊 Réponse envoyée');
      return res.json(response);
    } catch (err) {
      console.error('❌ getStats error:', err);
      console.error('❌ Stack trace:', err.stack);
      return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
    }
  },
};

module.exports = DashboardController;