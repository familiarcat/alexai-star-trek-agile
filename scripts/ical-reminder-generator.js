#!/usr/bin/env node

/**
 * 🚀 iCal Reminder Generator for Weekly Execution Plan
 * Generates calendar events with alarms for maximum productivity
 */

const fs = require('fs');
const path = require('path');

// Weekly execution plan data
const weeklyPlan = {
  week1: {
    monday: {
      date: '2025-01-13', // Adjust to your start date
      focus: 'Foundation & Setup',
      revenueTarget: '$0',
      timeInvestment: '8 hours',
      morningTasks: [
        'Choose business name and commit to it',
        'Set up free business email (Gmail)',
        'Create professional email signature',
        'Set up email folders for organization'
      ],
      afternoonTasks: [
        'Write and publish first LinkedIn post',
        'Create first Twitter thread (6 tweets)',
        'Start first blog post draft',
        'Set up content calendar'
      ],
      eveningTasks: [
        'Review tomorrow\'s tasks',
        'Prepare content for Tuesday',
        'Update project management system',
        'Set iCal reminders for tomorrow'
      ]
    },
    tuesday: {
      date: '2025-01-14',
      focus: 'Content & Networking',
      revenueTarget: '$0',
      timeInvestment: '8 hours',
      morningTasks: [
        'Complete blog post from Monday',
        'Create Tuesday LinkedIn post',
        'Plan Wednesday content',
        'Research trending topics in AI/business'
      ],
      afternoonTasks: [
        'Create assessment templates',
        'Develop workflow optimization tools',
        'Build emergency support protocols',
        'Document service delivery processes'
      ]
    },
    wednesday: {
      date: '2025-01-15',
      focus: 'Service Delivery Prep',
      revenueTarget: '$0',
      timeInvestment: '8 hours',
      morningTasks: [
        'Test assessment tools with sample data',
        'Refine workflow optimization processes',
        'Practice emergency support scenarios',
        'Create client onboarding materials'
      ],
      afternoonTasks: [
        'Conduct first free consultation',
        'Refine consultation process',
        'Document client needs',
        'Create follow-up materials'
      ]
    },
    thursday: {
      date: '2025-01-16',
      focus: 'First Revenue Generation',
      revenueTarget: '$500-$1,250',
      timeInvestment: '8 hours',
      morningTasks: [
        'Deliver first paid service',
        'Conduct client consultation',
        'Implement initial optimizations',
        'Document results and feedback'
      ],
      afternoonTasks: [
        'Analyze first client results',
        'Refine service delivery process',
        'Identify upsell opportunities',
        'Plan next client acquisition'
      ]
    },
    friday: {
      date: '2025-01-17',
      focus: 'Scaling & Optimization',
      revenueTarget: '$750-$2,000',
      timeInvestment: '8 hours',
      morningTasks: [
        'Deliver second paid service',
        'Refine delivery process',
        'Collect client testimonials',
        'Identify improvement areas'
      ],
      afternoonTasks: [
        'Document successful processes',
        'Create standard operating procedures',
        'Optimize client onboarding',
        'Plan next week\'s strategy'
      ]
    },
    saturday: {
      date: '2025-01-18',
      focus: 'Weekend Momentum',
      revenueTarget: '$500-$1,500',
      timeInvestment: '4 hours',
      morningTasks: [
        'Create weekend social media content',
        'Write blog post for next week',
        'Plan Monday\'s marketing strategy',
        'Engage with weekend audience'
      ],
      afternoonTasks: [
        'Review week\'s accomplishments',
        'Plan next week\'s goals',
        'Update project management system',
        'Set Sunday objectives'
      ]
    },
    sunday: {
      date: '2025-01-19',
      focus: 'Reflection & Planning',
      revenueTarget: '$0',
      timeInvestment: '4 hours',
      morningTasks: [
        'Analyze week\'s results',
        'Calculate total revenue generated',
        'Identify successful strategies',
        'Document lessons learned'
      ],
      afternoonTasks: [
        'Set next week\'s revenue targets',
        'Plan content calendar',
        'Schedule client consultations',
        'Update project management system'
      ]
    }
  }
};

// Generate iCal content for a single event
function generateICalEvent(summary, description, startDate, startTime, duration, alarmMinutes = 15) {
  const startDateTime = `${startDate.replace(/-/g, '')}T${startTime.replace(/:/g, '')}00`;
  const endDateTime = calculateEndTime(startDate, startTime, duration);
  
  return `BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${summary}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT${alarmMinutes}M
ACTION:DISPLAY
DESCRIPTION:${summary}
END:VALARM
END:VEVENT`;
}

// Calculate end time based on duration
function calculateEndTime(startDate, startTime, duration) {
  const [hours, minutes] = duration.split(' ')[0].split(':').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  
  let endHour = startHour + hours;
  let endMinute = startMinute + minutes;
  
  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }
  
  if (endHour >= 24) {
    endHour = endHour % 24;
  }
  
  const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  return `${startDate.replace(/-/g, '')}T${endTime.replace(/:/g, '')}00`;
}

// Generate daily reminders
function generateDailyReminders() {
  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AlexAI//Weekly Execution Plan//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  Object.entries(weeklyPlan.week1).forEach(([day, plan]) => {
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
    
    // Morning reminder (8:00 AM)
    const morningSummary = `🚀 ${dayName} - ${plan.focus} - Revenue Target: ${plan.revenueTarget}`;
    const morningDescription = `Today's Focus: ${plan.focus}
Revenue Target: ${plan.revenueTarget}
Key Tasks:
${plan.morningTasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

Time Investment: ${plan.timeInvestment}
Success Metrics: Complete all planned tasks and meet revenue target`;
    
    icalContent += generateICalEvent(
      morningSummary,
      morningDescription,
      plan.date,
      '08:00',
      '1:00',
      15
    );

    // Midday check-in (12:00 PM)
    const middaySummary = `📊 Midday Progress Check - ${dayName}`;
    const middayDescription = `Progress Update:
✅ Completed: Review morning tasks
🔄 In Progress: Continue with afternoon priorities
⏳ Pending: Complete remaining daily objectives

Revenue Generated: Track progress toward ${plan.revenueTarget}
Next 4 Hours Focus: ${plan.afternoonTasks.slice(0, 2).join(', ')}`;
    
    icalContent += generateICalEvent(
      middaySummary,
      middayDescription,
      plan.date,
      '12:00',
      '0:30',
      5
    );

    // Evening wrap-up (5:00 PM)
    const eveningSummary = `🌟 ${dayName} Complete - Review & Plan Tomorrow`;
    const eveningDescription = `${dayName} Accomplishments:
💰 Revenue: Track today's earnings
✅ Tasks Completed: Review completed objectives
📈 Progress Made: Document achievements

Tomorrow's Preparation:
1. Review next day's plan
2. Prepare content and materials
3. Update project management system`;
    
    icalContent += generateICalEvent(
      eveningSummary,
      eveningDescription,
      plan.date,
      '17:00',
      '0:30',
      5
    );

    // Add specific task blocks for longer sessions
    if (plan.morningTasks.length > 0) {
      const morningTasksSummary = `📋 ${dayName} Morning Tasks`;
      const morningTasksDescription = `Morning Session (4 hours):
${plan.morningTasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

Focus: ${plan.focus}
Revenue Target: ${plan.revenueTarget}`;
      
      icalContent += generateICalEvent(
        morningTasksSummary,
        morningTasksDescription,
        plan.date,
        '09:00',
        '4:00'
      );
    }

    if (plan.afternoonTasks.length > 0) {
      const afternoonTasksSummary = `📋 ${dayName} Afternoon Tasks`;
      const afternoonTasksDescription = `Afternoon Session (4 hours):
${plan.afternoonTasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

Focus: ${plan.focus}
Revenue Target: ${plan.revenueTarget}`;
      
      icalContent += generateICalEvent(
        afternoonTasksSummary,
        afternoonTasksDescription,
        plan.date,
        '13:00',
        '4:00'
      );
    }

    // Add evening session if applicable
    if (plan.eveningTasks && plan.eveningTasks.length > 0) {
      const eveningTasksSummary = `📋 ${dayName} Evening Planning`;
      const eveningTasksDescription = `Evening Session (2 hours):
${plan.eveningTasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

Focus: Planning and preparation for tomorrow`;
      
      icalContent += generateICalEvent(
        eveningTasksSummary,
        eveningTasksDescription,
        plan.date,
        '19:00',
        '2:00'
      );
    }
  });

  // Add weekly planning session (Sunday 2:00 PM)
  const weeklyPlanningSummary = `📋 Week 1 Review & Week 2 Planning`;
  const weeklyPlanningDescription = `Week 1 Results:
💰 Total Revenue: Calculate week's earnings
✅ Goals Achieved: Review accomplishments
📊 Performance Metrics: Analyze results

Week 2 Planning:
🎯 Revenue Target: Set next week's goals
📅 Key Milestones: Plan major objectives
🚀 Strategic Focus: Define priorities`;
  
  icalContent += generateICalEvent(
    weeklyPlanningSummary,
    weeklyPlanningDescription,
    '2025-01-19',
    '14:00',
    '2:00',
    10
  );

  icalContent += `END:VCALENDAR`;
  
  return icalContent;
}

// Generate project management integration reminders
function generateProjectManagementReminders() {
  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AlexAI//Project Management Integration//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  // Daily system integration reminders
  const integrationDates = ['2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17'];
  
  integrationDates.forEach(date => {
    // Morning system update
    const morningUpdateSummary = `🔄 Morning System Update`;
    const morningUpdateDescription = `Project Management Integration:
1. Review daily goals
2. Update task status
3. Check client communications
4. Review metrics dashboard

System: Update project management system with today's objectives`;
    
    icalContent += generateICalEvent(
      morningUpdateSummary,
      morningUpdateDescription,
      date,
      '08:00',
      '0:15'
    );

    // Evening system update
    const eveningUpdateSummary = `🔄 Evening System Update`;
    const eveningUpdateDescription = `Project Management Integration:
1. Complete daily tasks
2. Log accomplishments
3. Update project status
4. Plan tomorrow's priorities

System: Update project management system with today's results`;
    
    icalContent += generateICalEvent(
      eveningUpdateSummary,
      eveningUpdateDescription,
      date,
      '17:00',
      '0:15'
    );
  });

  // Weekly system review (Sunday)
  const weeklySystemSummary = `🔄 Weekly System Review`;
  const weeklySystemDescription = `Project Management System Review:
1. Analyze week's performance
2. Update project metrics
3. Plan next week's strategy
4. Generate progress reports

System: Comprehensive update and optimization`;
  
  icalContent += generateICalEvent(
    weeklySystemSummary,
    weeklySystemDescription,
    '2025-01-19',
    '16:00',
    '1:00'
  );

  icalContent += `END:VCALENDAR`;
  
  return icalContent;
}

// Main execution
function main() {
  console.log('🚀 Generating iCal reminders for Weekly Execution Plan...');
  
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate daily execution reminders
  const dailyReminders = generateDailyReminders();
  const dailyRemindersPath = path.join(outputDir, 'weekly-execution-plan.ics');
  fs.writeFileSync(dailyRemindersPath, dailyReminders);
  console.log(`✅ Daily execution reminders saved to: ${dailyRemindersPath}`);
  
  // Generate project management integration reminders
  const systemReminders = generateProjectManagementReminders();
  const systemRemindersPath = path.join(outputDir, 'project-management-integration.ics');
  fs.writeFileSync(systemRemindersPath, systemReminders);
  console.log(`✅ Project management integration reminders saved to: ${systemRemindersPath}`);
  
  // Generate combined calendar
  const combinedCalendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AlexAI//Complete Weekly Plan//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${dailyReminders.split('BEGIN:VEVENT').slice(1).join('BEGIN:VEVENT')}
${systemReminders.split('BEGIN:VEVENT').slice(1).join('BEGIN:VEVENT')}
END:VCALENDAR`;
  
  const combinedPath = path.join(outputDir, 'complete-weekly-plan.ics');
  fs.writeFileSync(combinedPath, combinedCalendar);
  console.log(`✅ Combined calendar saved to: ${combinedPath}`);
  
  console.log('\n📅 iCal Reminder Generation Complete!');
  console.log('\n📱 To use these reminders:');
  console.log('1. Open the .ics files with your calendar app');
  console.log('2. Import them into Google Calendar, Outlook, or Apple Calendar');
  console.log('3. The alarms will automatically notify you at the specified times');
  console.log('\n🚀 Your weekly execution plan is now integrated with calendar reminders!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  generateDailyReminders,
  generateProjectManagementReminders,
  weeklyPlan
};
