module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  // Mock data for now
  const stats = {
    total_projects: 8,
    total_tasks: 0,
    active_tasks: 0,
    completed_tasks: 0,
    completed_today: 0
  };
  
  res.status(200).json({
    success: true,
    stats,
    environment: 'Vercel Production'
  });
}; 