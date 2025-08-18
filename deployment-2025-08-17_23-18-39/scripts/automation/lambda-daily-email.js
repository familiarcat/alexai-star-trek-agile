// 🚀 AlexAI Star Trek System - Daily Execution Plan Email Lambda Function
// This Lambda function sends daily execution plan emails at 10:00 AM

// Use built-in AWS SDK (no need to package aws-sdk)
const { SESClient, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');

// Configure AWS SES client
const sesClient = new SESClient({ region: process.env.AWS_SES_REGION || 'us-east-2' });

// Email template data
const EMAIL_TEMPLATE = 'DailyExecutionPlan';
const CONFIGURATION_SET = 'daily-execution-plans';

// Generate daily execution plan content
function generateExecutionPlan() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Default content (can be enhanced with database queries)
    const priorityTasks = [
        "Review project status and priorities",
        "Update workflow automation systems", 
        "Plan next sprint and resource allocation"
    ].join('\n');
    
    const progressUpdate = "Current sprint is 75% complete with 3 projects active";
    
    const nextActions = [
        "Schedule team meeting for tomorrow",
        "Review budget allocation for Q4",
        "Update project documentation"
    ].join('\n');
    
    return {
        date: dateStr,
        day_name: dayName,
        name: "Brady",
        priority_tasks: priorityTasks,
        progress_update: progressUpdate,
        next_actions: nextActions,
        project_status: "Active"
    };
}

// Send email using AWS SES
async function sendDailyEmail(templateData) {
    const params = {
        Source: process.env.AWS_SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [process.env.AWS_SES_FROM_EMAIL]
        },
        Template: EMAIL_TEMPLATE,
        TemplateData: JSON.stringify(templateData),
        ConfigurationSetName: CONFIGURATION_SET
    };
    
    try {
        const command = new SendTemplatedEmailCommand(params);
        const result = await sesClient.send(command);
        
        console.log('✅ Daily execution plan email sent successfully');
        console.log('📨 Message ID:', result.MessageId);
        return result;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
}

// Main Lambda handler
exports.handler = async (event, context) => {
    console.log('🚀 Starting daily execution plan email automation...');
    console.log('📅 Event:', JSON.stringify(event, null, 2));
    
    try {
        // Validate environment variables
        const requiredEnvVars = [
            'AWS_SES_FROM_EMAIL',
            'AWS_SES_REGION'
        ];
        
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
        
        console.log('🔧 Environment configuration verified');
        console.log('📧 From email:', process.env.AWS_SES_FROM_EMAIL);
        console.log('🌍 Region:', process.env.AWS_SES_REGION);
        
        // Generate execution plan
        console.log('📝 Generating daily execution plan...');
        const templateData = generateExecutionPlan();
        console.log('✅ Daily execution plan generated');
        
        // Send email
        console.log('📧 Sending daily execution plan email...');
        const result = await sendDailyEmail(templateData);
        
        console.log('🎉 Daily execution plan email automation completed successfully');
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Daily execution plan email sent successfully',
                messageId: result.MessageId,
                timestamp: new Date().toISOString(),
                templateData: templateData
            })
        };
        
    } catch (error) {
        console.error('❌ Daily execution plan email automation failed:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send daily execution plan email',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

// Test function for local development
if (require.main === module) {
    console.log('🧪 Testing Lambda function locally...');
    
    // Set test environment variables
    process.env.AWS_SES_FROM_EMAIL = 'brady@pbradygeorgen.com';
    process.env.AWS_SES_REGION = 'us-east-2';
    
    exports.handler({}, {})
        .then(result => {
            console.log('✅ Local test successful:', result);
        })
        .catch(error => {
            console.error('❌ Local test failed:', error);
        });
}
