import React, { useState } from 'react';
import {
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  UserIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface HierarchicalLevel {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  profitMetrics: string[];
  crewImpact: string[];
  optimizationTools: string[];
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  profitContribution: number;
  optimizationPotential: number;
  ethicalCompliance: number;
}

const hierarchicalLevels: HierarchicalLevel[] = [
  {
    id: 'level1',
    name: 'Strategic Overview',
    icon: RocketLaunchIcon,
    description: 'Enterprise-wide business strategy and market positioning',
    profitMetrics: ['Market Share', 'Revenue Growth', 'Profit Margins', 'ROI'],
    crewImpact: ['All crew members', 'Strategic coordination', 'Market leadership'],
    optimizationTools: ['Strategic Dashboard', 'Market Analysis', 'Competitive Intelligence']
  },
  {
    id: 'level2',
    name: 'Crew Performance',
    icon: UserGroupIcon,
    description: 'Team collaboration and collective optimization',
    profitMetrics: ['Team Efficiency', 'Collaboration ROI', 'Collective Output', 'Synergy Gains'],
    crewImpact: ['Cross-functional teams', 'Knowledge sharing', 'Coordinated efforts'],
    optimizationTools: ['Team Dashboard', 'Performance Metrics', 'Collaboration Tools']
  },
  {
    id: 'level3',
    name: 'Individual Optimization',
    icon: UserIcon,
    description: 'Personal contribution and skill development',
    profitMetrics: ['Individual ROI', 'Skill Utilization', 'Productivity Gains', 'Innovation Output'],
    crewImpact: ['Personal growth', 'Specialized expertise', 'Individual excellence'],
    optimizationTools: ['Personal Dashboard', 'Skill Tracker', 'Goal Setting']
  },
  {
    id: 'level4',
    name: 'Profit Metrics',
    icon: CurrencyDollarIcon,
    description: 'Financial performance and optimization opportunities',
    profitMetrics: ['Revenue', 'Costs', 'Profit', 'Efficiency Ratios'],
    crewImpact: ['Financial awareness', 'Cost optimization', 'Revenue generation'],
    optimizationTools: ['Financial Dashboard', 'Profit Tracker', 'Cost Analyzer']
  },
  {
    id: 'level5',
    name: 'Ethical Compliance',
    icon: ShieldCheckIcon,
    description: 'Values alignment and sustainable business practices',
    profitMetrics: ['Ethical ROI', 'Compliance Savings', 'Reputation Value', 'Sustainability Gains'],
    crewImpact: ['Moral integrity', 'Trust building', 'Long-term success'],
    optimizationTools: ['Ethics Dashboard', 'Compliance Tracker', 'Values Alignment']
  }
];

const mockCrewMembers: CrewMember[] = [
  {
    id: 'captain-picard',
    name: 'Captain Picard',
    role: 'Strategic Leadership',
    profitContribution: 85,
    optimizationPotential: 90,
    ethicalCompliance: 95
  },
  {
    id: 'chief-engineer-scott',
    name: 'Chief Engineer Scott',
    role: 'Technical Excellence',
    profitContribution: 92,
    optimizationPotential: 95,
    ethicalCompliance: 88
  },
  {
    id: 'counselor-troi',
    name: 'Counselor Troi',
    role: 'Ethical Guidance',
    profitContribution: 78,
    optimizationPotential: 85,
    ethicalCompliance: 98
  },
  {
    id: 'commander-data',
    name: 'Commander Data',
    role: 'AI Optimization',
    profitContribution: 88,
    optimizationPotential: 92,
    ethicalCompliance: 90
  },
  {
    id: 'lieutenant-worf',
    name: 'Lieutenant Worf',
    role: 'Security & Protection',
    profitContribution: 82,
    optimizationPotential: 87,
    ethicalCompliance: 92
  },
  {
    id: 'ships-computer',
    name: 'Ship\'s Computer',
    role: 'System Coordination',
    profitContribution: 90,
    optimizationPotential: 94,
    ethicalCompliance: 89
  }
];

export default function QuarkHierarchicalDashboard() {
  const [selectedLevel, setSelectedLevel] = useState<string>('level1');
  const [selectedCrewMember, setSelectedCrewMember] = useState<string | null>(null);

  const currentLevel = hierarchicalLevels.find(level => level.id === selectedLevel);
  const currentCrewMember = selectedCrewMember ? mockCrewMembers.find(member => member.id === selectedCrewMember) : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">💎 Quark's Hierarchical Business Dashboard</h2>
        <p className="text-gray-600">Multi-level profit optimization and crew performance analysis</p>
      </div>

      {/* Hierarchical Level Navigation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hierarchical Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {hierarchicalLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedLevel === level.id
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                  : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-25'
              }`}
            >
              <level.icon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{level.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Level Details */}
      {currentLevel && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <currentLevel.icon className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentLevel.name}</h3>
              <p className="text-gray-600">{currentLevel.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                Profit Metrics
              </h4>
              <ul className="space-y-2">
                {currentLevel.profitMetrics.map((metric, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                Crew Impact
              </h4>
              <ul className="space-y-2">
                {currentLevel.crewImpact.map((impact, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    {impact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CogIcon className="h-5 w-5 text-purple-600 mr-2" />
                Optimization Tools
              </h4>
              <ul className="space-y-2">
                {currentLevel.optimizationTools.map((tool, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Crew Member Performance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Crew Performance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCrewMembers.map((member) => (
            <div
              key={member.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedCrewMember === member.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-25'
              }`}
              onClick={() => setSelectedCrewMember(selectedCrewMember === member.id ? null : member.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {member.role}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profit Contribution:</span>
                  <span className="font-medium text-green-600">{member.profitContribution}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.profitContribution}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Optimization Potential:</span>
                  <span className="font-medium text-blue-600">{member.optimizationPotential}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.optimizationPotential}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Ethical Compliance:</span>
                  <span className="font-medium text-purple-600">{member.ethicalCompliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.ethicalCompliance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Crew Member Details */}
      {currentCrewMember && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🎯 {currentCrewMember.name} - Detailed Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Quark's Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Focus on {currentCrewMember.role.toLowerCase()} optimization</li>
                <li>• Leverage {currentCrewMember.optimizationPotential}% optimization potential</li>
                <li>• Maintain {currentCrewMember.ethicalCompliance}% ethical compliance</li>
                <li>• Maximize {currentCrewMember.profitContribution}% profit contribution</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Ferengi Wisdom</h4>
              <p className="text-sm text-gray-700 italic">
                "Rule of Acquisition #{currentCrewMember.name}: The best profit is one that benefits both the individual and the collective. {currentCrewMember.name} demonstrates how excellence in {currentCrewMember.role.toLowerCase()} translates to sustainable profit growth."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quark's Final Assessment */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">💎 Quark's Business Assessment</h3>
        <div className="text-center">
          <p className="text-gray-700 mb-3">
            "This crew demonstrates exceptional potential for profit optimization while maintaining the highest ethical standards. 
            Each member brings unique value that, when properly coordinated, creates a profit-generating machine that would make 
            even the Grand Nagus proud!"
          </p>
          <p className="text-sm text-gray-600">
            - Quark, Ferengi Business Strategist & Profit Optimization Expert
          </p>
        </div>
      </div>
    </div>
  );
}
