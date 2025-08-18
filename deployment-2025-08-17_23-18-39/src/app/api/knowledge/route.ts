import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const query = searchParams.get('query');
    const agent = searchParams.get('agent');
    
    const knowledgeBase = path.join(process.cwd(), 'alexai-knowledge-base');
    
    if (domain) {
      // Return specific domain information
      const domainPath = path.join(knowledgeBase, domain);
      const files = await fs.readdir(domainPath, { recursive: true });
      
      return NextResponse.json({
        domain,
        files: files.filter(file => file.endsWith('.md') || file.endsWith('.sh')),
        timestamp: new Date().toISOString()
      });
    }
    
    if (query) {
      // Search across knowledge base
      // Implementation for full-text search would go here
      return NextResponse.json({
        query,
        results: [],
        message: 'Search functionality to be implemented',
        timestamp: new Date().toISOString()
      });
    }
    
    if (agent) {
      // Return agent-specific knowledge
      const agentKnowledge = {
        'captain-picard': ['01-foundations', '04-projects'],
        'lieutenant-data': ['01-foundations/standards', '02-ai-agents', '03-operations'],
        'counselor-troi': ['02-ai-agents/capabilities/emotional-intelligence', '04-projects'],
        'chief-engineer-scott': ['03-operations', '01-foundations/architecture'],
        'commander-spock': ['01-foundations/standards', '05-evolution'],
        'lieutenant-worf': ['01-foundations/standards/security-protocols', '03-operations/troubleshooting']
      };
      
      return NextResponse.json({
        agent,
        relevantDomains: agentKnowledge[agent as keyof typeof agentKnowledge] || [],
        timestamp: new Date().toISOString()
      });
    }
    
    // Return knowledge base overview
    const overview = {
      domains: [
        '01-foundations',
        '02-ai-agents', 
        '03-operations',
        '04-projects',
        '05-evolution',
        '06-reference'
      ],
      totalFiles: 'To be calculated',
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(overview);
    
  } catch (error) {
    console.error('Knowledge API error:', error);
    return NextResponse.json(
      { error: 'Failed to access knowledge base' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { domain, filename, content, agent } = await request.json();
    
    // Add new knowledge to the base
    const knowledgeBase = path.join(process.cwd(), 'alexai-knowledge-base');
    const targetPath = path.join(knowledgeBase, domain, filename);
    
    await fs.writeFile(targetPath, content, 'utf-8');
    
    return NextResponse.json({
      message: 'Knowledge added successfully',
      path: targetPath,
      agent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Knowledge addition error:', error);
    return NextResponse.json(
      { error: 'Failed to add knowledge' },
      { status: 500 }
    );
  }
}
