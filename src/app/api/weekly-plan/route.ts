import { NextResponse } from 'next/server';

interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  revenueTarget: number;
  currentRevenue: number;
  days: DailyPlan[];
  progress: {
    tasksCompleted: number;
    totalTasks: number;
    revenueGenerated: number;
    timeInvested: number;
  };
}

interface DailyPlan {
  day: string;
  focus: string;
  revenueTarget: number;
  timeInvestment: string;
  morningTasks: string[];
  afternoonTasks: string[];
  eveningTasks: string[];
  completed: boolean;
  revenueGenerated: number;
  tasksCompleted: number;
}

export async function GET() {
  try {
    // Generate current week's execution plan
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday
    
    const weekNumber = Math.ceil((currentDate.getTime() - new Date(2025, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    const weeklyPlan: WeeklyPlan = {
      weekNumber,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      revenueTarget: 10000,
      currentRevenue: 0,
      days: [
        {
          day: "Monday",
          focus: "Foundation & Setup",
          revenueTarget: 0,
          timeInvestment: "8 hours",
          morningTasks: [
            "Choose business name and commit to it",
            "Set up free business email (Gmail)",
            "Create professional email signature",
            "Set up email folders for organization"
          ],
          afternoonTasks: [
            "Write and publish first LinkedIn post",
            "Create first Twitter thread (6 tweets)",
            "Start first blog post draft",
            "Set up content calendar"
          ],
          eveningTasks: [
            "Review tomorrow's tasks",
            "Prepare content for Tuesday",
            "Update project management system",
            "Set iCal reminders for tomorrow"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        },
        {
          day: "Tuesday",
          focus: "Content & Networking",
          revenueTarget: 0,
          timeInvestment: "8 hours",
          morningTasks: [
            "Complete blog post from Monday",
            "Create Tuesday LinkedIn post",
            "Plan Wednesday content",
            "Research trending topics in AI/business"
          ],
          afternoonTasks: [
            "Create assessment templates",
            "Develop workflow optimization tools",
            "Build emergency support protocols",
            "Document service delivery processes"
          ],
          eveningTasks: [
            "Follow up with LinkedIn connections",
            "Engage in online communities",
            "Plan Thursday's strategy",
            "Update progress tracking"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        },
        {
          day: "Wednesday",
          focus: "Service Delivery Prep",
          revenueTarget: 0,
          timeInvestment: "8 hours",
          morningTasks: [
            "Test assessment tools with sample data",
            "Refine workflow optimization processes",
            "Practice emergency support scenarios",
            "Create client onboarding materials"
          ],
          afternoonTasks: [
            "Conduct first free consultation",
            "Refine consultation process",
            "Document client needs",
            "Create follow-up materials"
          ],
          eveningTasks: [
            "Analyze consultation feedback",
            "Prepare for paid services",
            "Update service offerings",
            "Plan revenue generation"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        },
        {
          day: "Thursday",
          focus: "First Revenue Generation",
          revenueTarget: 1250,
          timeInvestment: "8 hours",
          morningTasks: [
            "Deliver first paid service",
            "Conduct client consultation",
            "Implement initial optimizations",
            "Document results and feedback"
          ],
          afternoonTasks: [
            "Create Thursday LinkedIn post",
            "Share client success story",
            "Develop testimonial collection process",
            "Plan Friday's content"
          ],
          eveningTasks: [
            "Analyze first client results",
            "Refine service delivery process",
            "Identify upsell opportunities",
            "Plan next client acquisition"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        },
        {
          day: "Friday",
          focus: "Scaling & Optimization",
          revenueTarget: 2000,
          timeInvestment: "8 hours",
          morningTasks: [
            "Deliver second paid service",
            "Refine delivery process",
            "Collect client testimonials",
            "Identify improvement areas"
          ],
          afternoonTasks: [
            "Create Friday LinkedIn post",
            "Analyze content performance",
            "Optimize posting schedule",
            "Plan weekend content"
          ],
          eveningTasks: [
            "Document successful processes",
            "Create standard operating procedures",
            "Optimize client onboarding",
            "Plan next week's strategy"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        },
        {
          day: "Saturday",
          focus: "Weekend Momentum",
          revenueTarget: 1500,
          timeInvestment: "4 hours",
          morningTasks: [
            "Create weekend social media content",
            "Write blog post for next week",
            "Plan Monday's marketing strategy",
            "Engage with weekend audience"
          ],
          afternoonTasks: [
            "Review week's accomplishments",
            "Plan next week's goals",
            "Update project management system",
            "Set Sunday objectives"
          ],
          eveningTasks: [
            "Relax and recharge",
            "Prepare for Sunday planning",
            "Celebrate week's progress",
            "Set personal goals"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        },
        {
          day: "Sunday",
          focus: "Reflection & Planning",
          revenueTarget: 0,
          timeInvestment: "4 hours",
          morningTasks: [
            "Analyze week's results",
            "Calculate total revenue generated",
            "Identify successful strategies",
            "Document lessons learned"
          ],
          afternoonTasks: [
            "Set next week's revenue targets",
            "Plan content calendar",
            "Schedule client consultations",
            "Update project management system"
          ],
          eveningTasks: [
            "Prepare for Monday",
            "Set weekly goals",
            "Review personal development",
            "Plan work-life balance"
          ],
          completed: false,
          revenueGenerated: 0,
          tasksCompleted: 0
        }
      ],
      progress: {
        tasksCompleted: 0,
        totalTasks: 0,
        revenueGenerated: 0,
        timeInvested: 0
      }
    };

    // Calculate total tasks
    weeklyPlan.progress.totalTasks = weeklyPlan.days.reduce((total, day) => 
      total + day.morningTasks.length + day.afternoonTasks.length + day.eveningTasks.length, 0
    );

    return NextResponse.json({
      success: true,
      weeklyPlan,
      message: "Weekly execution plan generated successfully"
    });
  } catch (error) {
    console.error('Error generating weekly plan:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate weekly execution plan'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { day, taskIndex, completed, revenueGenerated } = body;

    // In a real implementation, this would update the database
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: `Updated ${day} task ${taskIndex}`,
      data: {
        day,
        taskIndex,
        completed,
        revenueGenerated
      }
    });
  } catch (error) {
    console.error('Error updating weekly plan:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update weekly execution plan'
    }, { status: 500 });
  }
}
