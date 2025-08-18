import { NextRequest, NextResponse } from 'next/server';

// 🚀 YouTube Project Extraction Microservice API Route
// This route provides a client interface for the n8n YouTube extraction microservice

interface YouTubeExtractionRequest {
  channelUrl: string;
  extractionType: 'full' | 'quick' | 'targeted';
  options?: {
    maxVideos?: number;
    includeArchived?: boolean;
    revenueEstimation?: boolean;
    complexityAssessment?: boolean;
    autoApproval?: boolean;
    emailNotification?: boolean;
    agileIntegration?: boolean;
    recipients?: string[];
  };
  requestId?: string;
}

interface YouTubeExtractionResponse {
  success: boolean;
  requestId: string;
  timestamp: string;
  extractionStatus: string;
  channel: {
    channelId: string;
    channelUrl: string;
    name: string;
    subscribers: string;
    videoCount: string;
    description: string;
    category: string;
    createdDate: string;
    lastUpdated: string;
    extractionStatus: string;
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    revenuePotential: number;
    targetMarket: string;
    complexity: 'Simple' | 'Medium' | 'Complex';
    estimatedTime: string;
    category: string;
    features: string[];
    n8nWorkflowTemplate: string;
    nextJsComponent: string;
    apiRoute: string;
    sourceVideo: string;
    sourceChannel: string;
    status: 'pending' | 'approved' | 'archived' | 'deleted';
    createdAt: string;
    metadata: {
      detectedKeywords: string[];
      viewCount: string;
      publishedDate: string;
    };
  }>;
  revenue: {
    totalProjects: number;
    totalRevenuePotential: number;
    averageRevenuePerProject: number;
    revenueByCategory: Record<string, number>;
    complexityDistribution: Record<string, number>;
    estimatedROI: number;
    extractionCost: number;
    netProfit: number;
  };
  email?: {
    subject: string;
    html: string;
    text: string;
    recipients: string[];
    metadata: {
      channelName: string;
      extractionDate: string;
      totalProjects: number;
      totalRevenue: number;
    };
  };
  agile?: Array<{
    agileId: string;
    sprint: string;
    priority: string;
    storyPoints: number;
    assignedTo: string;
    status: string;
    estimatedHours: number;
    dependencies: string[];
    acceptanceCriteria: string[];
    technicalRequirements: string[];
  }>;
  metadata: {
    totalProjects: number;
    totalRevenue: number;
    averageRevenue: number;
    roi: number;
    processingTime: number;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    timestamp: string;
    requestId: string;
  };
  metadata: {
    service: string;
    version: string;
    status: string;
  };
}

// Configuration
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
const N8N_API_TOKEN = process.env.N8N_API_TOKEN;
const MICROSERVICE_WEBHOOK_PATH = 'youtube-project-extraction';

// Helper function to call n8n microservice
async function callYouTubeExtractionMicroservice(request: YouTubeExtractionRequest): Promise<YouTubeExtractionResponse> {
  const webhookUrl = `${N8N_BASE_URL}/webhook/${MICROSERVICE_WEBHOOK_PATH}`;
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${N8N_API_TOKEN}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Microservice request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// POST endpoint for YouTube extraction requests
export async function POST(request: NextRequest): Promise<NextResponse<YouTubeExtractionResponse | ErrorResponse>> {
  try {
    const body: YouTubeExtractionRequest = await request.json();
    
    // Validate required fields
    if (!body.channelUrl) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'channelUrl is required',
          code: 'MISSING_CHANNEL_URL',
          timestamp: new Date().toISOString(),
          requestId: body.requestId || `error_${Date.now()}`,
        },
        metadata: {
          service: 'YouTube Project Extraction Microservice API',
          version: '1.0.0',
          status: 'error',
        },
      }, { status: 400 });
    }

    if (!body.extractionType) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'extractionType is required (full, quick, or targeted)',
          code: 'MISSING_EXTRACTION_TYPE',
          timestamp: new Date().toISOString(),
          requestId: body.requestId || `error_${Date.now()}`,
        },
        metadata: {
          service: 'YouTube Project Extraction Microservice API',
          version: '1.0.0',
          status: 'error',
        },
      }, { status: 400 });
    }

    // Set default options
    const defaultOptions = {
      maxVideos: 50,
      includeArchived: false,
      revenueEstimation: true,
      complexityAssessment: true,
      autoApproval: false,
      emailNotification: true,
      agileIntegration: false,
    };

    const validatedRequest: YouTubeExtractionRequest = {
      ...body,
      options: { ...defaultOptions, ...body.options },
      requestId: body.requestId || `extraction_${Date.now()}`,
    };

    // Call the n8n microservice
    const result = await callYouTubeExtractionMicroservice(validatedRequest);

    return NextResponse.json(result);

  } catch (error) {
    console.error('YouTube extraction microservice error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'MICROSERVICE_ERROR',
        timestamp: new Date().toISOString(),
        requestId: `error_${Date.now()}`,
      },
      metadata: {
        service: 'YouTube Project Extraction Microservice API',
        version: '1.0.0',
        status: 'error',
      },
    }, { status: 500 });
  }
}

// GET endpoint for service information and health check
export async function GET(): Promise<NextResponse> {
  try {
    // Test microservice connectivity
    const webhookUrl = `${N8N_BASE_URL}/webhook/${MICROSERVICE_WEBHOOK_PATH}`;
    const testResponse = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${N8N_API_TOKEN}`,
      },
    });

    const serviceInfo = {
      service: 'YouTube Project Extraction Microservice API',
      version: '1.0.0',
      status: 'operational',
      microservice: {
        url: webhookUrl,
        status: testResponse.ok ? 'connected' : 'disconnected',
        lastChecked: new Date().toISOString(),
      },
      capabilities: {
        extractionTypes: ['full', 'quick', 'targeted'],
        supportedOptions: [
          'maxVideos',
          'includeArchived',
          'revenueEstimation',
          'complexityAssessment',
          'autoApproval',
          'emailNotification',
          'agileIntegration',
        ],
        features: [
          'YouTube channel analysis',
          'Video content extraction',
          'Business opportunity detection',
          'Project template generation',
          'Revenue analysis and ROI calculation',
          'Email notification generation',
          'Agile workflow integration',
        ],
      },
      endpoints: {
        POST: '/api/youtube-extraction-microservice',
        GET: '/api/youtube-extraction-microservice',
      },
      documentation: {
        swagger: '/api/youtube-extraction-microservice/swagger',
        examples: '/api/youtube-extraction-microservice/examples',
      },
    };

    return NextResponse.json(serviceInfo);

  } catch (error) {
    console.error('Service health check error:', error);
    
    return NextResponse.json({
      service: 'YouTube Project Extraction Microservice API',
      version: '1.0.0',
      status: 'degraded',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    }, { status: 503 });
  }
}

// PUT endpoint for updating microservice configuration
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Validate configuration update
    if (!body.config || typeof body.config !== 'object') {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Configuration object is required',
          code: 'INVALID_CONFIG',
          timestamp: new Date().toISOString(),
        },
      }, { status: 400 });
    }

    // Here you would typically update the microservice configuration
    // For now, we'll just return a success response
    const updateResult = {
      success: true,
      message: 'Configuration updated successfully',
      timestamp: new Date().toISOString(),
      config: body.config,
    };

    return NextResponse.json(updateResult);

  } catch (error) {
    console.error('Configuration update error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'CONFIG_UPDATE_ERROR',
        timestamp: new Date().toISOString(),
      },
    }, { status: 500 });
  }
}

// DELETE endpoint for cleaning up extraction data
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    
    if (!requestId) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'requestId parameter is required',
          code: 'MISSING_REQUEST_ID',
          timestamp: new Date().toISOString(),
        },
      }, { status: 400 });
    }

    // Here you would typically clean up extraction data
    // For now, we'll just return a success response
    const cleanupResult = {
      success: true,
      message: 'Extraction data cleaned up successfully',
      timestamp: new Date().toISOString(),
      requestId,
    };

    return NextResponse.json(cleanupResult);

  } catch (error) {
    console.error('Data cleanup error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'CLEANUP_ERROR',
        timestamp: new Date().toISOString(),
      },
    }, { status: 500 });
  }
}
