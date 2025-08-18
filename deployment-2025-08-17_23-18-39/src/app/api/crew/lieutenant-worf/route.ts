import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context, userRole, urgency } = body;

    // Lieutenant Worf - Security and Tactical Operations
    const response = {
      crewMember: "lieutenant-worf",
      role: "Security Chief & Tactical Operations",
      greeting: "Security protocols must be maintained. I will ensure the integrity of our systems.",
      guidance: generateSecurityGuidance(query, context, userRole, urgency),
      securityAssessment: analyzeSecurityContext(query, context, urgency),
      recommendations: provideSecurityRecommendations(query, context, userRole),
      nextSteps: suggestSecurityApproach(query, context, urgency),
      starfleetProtocol: "Security vigilance and tactical readiness per Starfleet Security protocols"
    };

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Lieutenant Worf endpoint error:', error);
    return NextResponse.json(
      { error: 'Lieutenant Worf is securing the perimeter - tactical response temporarily unavailable' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    crewMember: "lieutenant-worf",
    role: "Security Chief & Tactical Operations",
    status: "Maintaining security vigilance and protecting system integrity",
    specialties: [
      "Cybersecurity",
      "Authentication systems",
      "Access control",
      "Threat assessment",
      "Security auditing",
      "Compliance monitoring",
      "Incident response",
      "Risk management"
    ]
  });
}

function generateSecurityGuidance(query: string, context: string, userRole: string, urgency: string) {
  const guidanceTemplates = {
    'security-breach': "A security breach requires immediate tactical response! All security protocols must be activated. I will coordinate the defensive measures.",
    'authentication': "Authentication is the first line of defense. We must implement robust authentication mechanisms to verify user identity with absolute certainty.",
    'access-control': "Access control must be precisely configured. Each user should have only the minimum permissions required for their duties - no more, no less.",
    'vulnerability': "Security vulnerabilities are threats to our mission. They must be identified, assessed, and neutralized before they can be exploited by hostile forces.",
    'compliance': "Compliance with security regulations is not optional. It is a duty that protects the entire organization from legal and operational threats.",
    'incident-response': "Security incidents require swift, coordinated response. I will implement our security protocols to contain and neutralize the threat.",
    'default': "Security is not merely a technical concern - it is a mindset. Constant vigilance and adherence to security protocols are essential for mission success."
  };

  const baseGuidance = guidanceTemplates[context as keyof typeof guidanceTemplates] || guidanceTemplates.default;
  
  if (urgency === 'critical') {
    return `${baseGuidance} This is a critical security situation! All defensive measures must be implemented immediately. I recommend elevating to red alert status until the threat is neutralized.`;
  }
  
  return baseGuidance;
}

function analyzeSecurityContext(query: string, context: string, urgency: string = 'normal') {
  const securityPatterns = {
    authentication: /auth|login|password|token|session|credential/i,
    authorization: /permission|access|role|privilege|acl|rbac/i,
    encryption: /encrypt|ssl|tls|certificate|crypto|hash/i,
    vulnerability: /vulnerability|exploit|attack|breach|hack|malware/i,
    monitoring: /monitor|log|audit|alert|siem|detection/i,
    compliance: /compliance|gdpr|hipaa|sox|pci|regulation/i,
    network: /firewall|proxy|vpn|network|port|protocol/i
  };

  const detectedPatterns = Object.entries(securityPatterns)
    .filter(([_, pattern]) => pattern.test(query))
    .map(([category, _]) => category);

  const threatLevel = assessThreatLevel(query, context, urgency);
  
  return {
    securityDomains: detectedPatterns.length > 0 ? detectedPatterns : ['general'],
    threatLevel: threatLevel,
    riskFactors: identifyRiskFactors(query, context),
    defensivePosture: determineDfensivePosture(threatLevel, urgency),
    recommendation: threatLevel === 'high' 
      ? "Immediate security measures required. Implement all available defensive protocols."
      : "Maintain security vigilance and follow established security procedures."
  };
}

function assessThreatLevel(query: string, context: string, urgency: string) {
  const highThreatIndicators = /attack|breach|hack|exploit|malware|virus|intrusion|compromise/i;
  const mediumThreatIndicators = /vulnerable|risk|threat|suspicious|unauthorized|exposure/i;
  const lowThreatIndicators = /review|audit|policy|procedure|training|documentation/i;

  if (urgency === 'critical' || highThreatIndicators.test(query)) return 'high';
  if (urgency === 'high' || mediumThreatIndicators.test(query)) return 'medium';
  if (lowThreatIndicators.test(query)) return 'low';
  
  return 'medium'; // Default to medium threat level for security vigilance
}

function identifyRiskFactors(query: string, context: string) {
  const riskFactors = [];
  
  if (/public|external|internet|open/i.test(query)) {
    riskFactors.push('External exposure');
  }
  if (/admin|root|privileged|elevated/i.test(query)) {
    riskFactors.push('Privileged access');
  }
  if (/legacy|old|outdated|deprecated/i.test(query)) {
    riskFactors.push('Legacy system vulnerabilities');
  }
  if (/third-party|vendor|external|integration/i.test(query)) {
    riskFactors.push('Third-party dependencies');
  }
  if (/data|database|sensitive|personal|confidential/i.test(query)) {
    riskFactors.push('Sensitive data exposure');
  }
  
  return riskFactors.length > 0 ? riskFactors : ['Standard operational risks'];
}

function determineDfensivePosture(threatLevel: string, urgency: string) {
  if (threatLevel === 'high' || urgency === 'critical') {
    return 'Red Alert - Maximum defensive measures';
  }
  if (threatLevel === 'medium' || urgency === 'high') {
    return 'Yellow Alert - Heightened security vigilance';
  }
  return 'Green Status - Standard security protocols';
}

function provideSecurityRecommendations(query: string, context: string, userRole: string) {
  const roleBasedRecommendations = {
    'security-engineer': [
      "Implement defense-in-depth strategy with multiple security layers",
      "Conduct regular penetration testing and vulnerability assessments",
      "Maintain comprehensive security monitoring and incident response plans",
      "Ensure all security controls are documented and regularly reviewed"
    ],
    'devops-engineer': [
      "Integrate security scanning into your CI/CD pipeline",
      "Implement infrastructure as code with security best practices",
      "Use container security scanning and image vulnerability assessment",
      "Monitor infrastructure for security compliance and configuration drift"
    ],
    'developer': [
      "Follow secure coding practices and input validation procedures",
      "Implement proper error handling without information disclosure",
      "Use parameterized queries to prevent SQL injection attacks",
      "Never hard-code credentials or sensitive data in source code"
    ],
    'project-manager': [
      "Include security requirements in all project planning phases",
      "Ensure adequate security training for all team members",
      "Implement security review processes for all deliverables",
      "Maintain clear incident response and escalation procedures"
    ],
    'default': [
      "Follow the principle of least privilege for all access controls",
      "Implement multi-factor authentication wherever possible",
      "Keep all systems and dependencies updated with security patches",
      "Maintain security awareness and report suspicious activities immediately"
    ]
  };

  return roleBasedRecommendations[userRole as keyof typeof roleBasedRecommendations] || roleBasedRecommendations.default;
}

function suggestSecurityApproach(query: string, context: string, urgency: string) {
  if (urgency === 'critical') {
    return [
      "Implement immediate incident response procedures",
      "Isolate affected systems to prevent further compromise",
      "Activate security team and establish command center",
      "Begin forensic analysis and evidence preservation",
      "Communicate with stakeholders per incident response plan",
      "Document all actions taken for post-incident review"
    ];
  }

  if (urgency === 'high') {
    return [
      "Conduct immediate threat assessment and risk analysis",
      "Implement additional security controls as countermeasures",
      "Increase monitoring and alerting for suspicious activities",
      "Review and update security policies and procedures",
      "Schedule security audit and compliance review"
    ];
  }

  return [
    "Conduct comprehensive security assessment and gap analysis",
    "Develop security implementation roadmap with priorities",
    "Implement security controls following industry best practices",
    "Establish ongoing security monitoring and maintenance procedures",
    "Provide security training and awareness programs for team members",
    "Schedule regular security reviews and updates"
  ];
}
