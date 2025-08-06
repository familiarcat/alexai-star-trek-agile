module.exports = (req, res) => { res.json({ success: true, stats: { total_projects: 8, total_tasks: 0, active_tasks: 0, completed_tasks: 0, completed_today: 0 }, environment: 'Vercel' }); };
