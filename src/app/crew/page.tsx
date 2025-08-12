'use client';

import { useState, useEffect } from 'react';
import { UserIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CrewMember {
  id: string;
  name: string;
  rank: string;
  department: string;
  specialization: string;
  status: 'active' | 'off-duty' | 'away' | 'training';
  email: string;
  phone: string;
  experience: number;
  performance: number;
  avatar: string;
}

export default function CrewPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchCrew = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCrewMembers([
          {
            id: '1',
            name: 'Captain Jean-Luc Picard',
            rank: 'Captain',
            department: 'Command',
            specialization: 'Starship Command',
            status: 'active',
            email: 'picard@enterprise.starfleet',
            phone: '001-001',
            experience: 35,
            performance: 98
          },
          {
            id: '2',
            name: 'Commander Data',
            rank: 'Commander',
            department: 'Operations',
            specialization: 'Artificial Intelligence',
            status: 'active',
            email: 'data@enterprise.starfleet',
            phone: '001-002',
            experience: 28,
            performance: 99
          },
          {
            id: '3',
            name: 'Lieutenant Commander Geordi La Forge',
            rank: 'Lieutenant Commander',
            department: 'Engineering',
            specialization: 'Warp Core Systems',
            status: 'active',
            email: 'laforge@enterprise.starfleet',
            phone: '001-003',
            experience: 22,
            performance: 96
          },
          {
            id: '4',
            name: 'Counselor Deanna Troi',
            rank: 'Commander',
            department: 'Medical',
            specialization: 'Psychology & Diplomacy',
            status: 'active',
            email: 'troi@enterprise.starfleet',
            phone: '001-004',
            experience: 18,
            performance: 94
          },
          {
            id: '5',
            name: 'Lieutenant Worf',
            rank: 'Lieutenant',
            department: 'Security',
            specialization: 'Tactical Operations',
            status: 'training',
            email: 'worff@enterprise.starfleet',
            phone: '001-005',
            experience: 15,
            performance: 92
          },
          {
            id: '6',
            name: 'Dr. Beverly Crusher',
            rank: 'Commander',
            department: 'Medical',
            specialization: 'Chief Medical Officer',
            status: 'active',
            email: 'crusher@enterprise.starfleet',
            phone: '001-006',
            experience: 25,
            performance: 97
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch crew:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrew();
  }, []);

  const handleAddCrewMember = () => {
    console.log('Adding new crew member...');
    // Navigate to crew member creation form
  };

  const handleViewCrewMember = (crewId: string) => {
    console.log('Viewing crew member:', crewId);
    // Navigate to crew member detail
  };

  const handleEditCrewMember = (crewId: string) => {
    console.log('Editing crew member:', crewId);
    // Navigate to crew member edit form
  };

  const handleDeleteCrewMember = (crewId: string) => {
    console.log('Deleting crew member:', crewId);
    // Show confirmation dialog and delete
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--lcars-green)';
      case 'off-duty': return 'var(--lcars-yellow)';
      case 'away': return 'var(--lcars-blue)';
      case 'training': return 'var(--lcars-orange)';
      default: return 'var(--lcars-gray)';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Command': return 'var(--lcars-red)';
      case 'Operations': return 'var(--lcars-blue)';
      case 'Engineering': return 'var(--lcars-orange)';
      case 'Medical': return 'var(--lcars-green)';
      case 'Security': return 'var(--lcars-african-violet)';
      default: return 'var(--lcars-gray)';
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="lcars-elbow-container">
          <div className="lcars-elbow-header">CREW MANAGEMENT</div>
          <div className="lcars-elbow-content">
            <p className="lcars-text">Loading Crew...</p>
            <p className="lcars-text-small">Initializing personnel database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Crew Management Header */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">CREW MANAGEMENT</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-medium">Manage Starfleet personnel and crew assignments</p>
          <div className="lcars-responsive-grid lcars-grid-2">
            <button onClick={handleAddCrewMember} className="lcars-cta-button lcars-cta-primary">
              <PlusIcon className="lcars-icon" />
              <span>ADD CREW MEMBER</span>
            </button>
            <button className="lcars-cta-button lcars-cta-secondary">
              <ShieldCheckIcon className="lcars-icon" />
              <span>SECURITY CLEARANCE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Crew Statistics */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">CREW STATISTICS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-4">
            <div className="lcars-grid-item">
              <h3 className="lcars-text-orange lcars-text">TOTAL CREW</h3>
              <p className="lcars-text-large">{crewMembers.length}</p>
              <p className="lcars-text-small">Personnel</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-blue lcars-text">ACTIVE DUTY</h3>
              <p className="lcars-text-large">{crewMembers.filter(c => c.status === 'active').length}</p>
              <p className="lcars-text-small">On Duty</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-green lcars-text">DEPARTMENTS</h3>
              <p className="lcars-text-large">{new Set(crewMembers.map(c => c.department)).size}</p>
              <p className="lcars-text-small">Active</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-yellow lcars-text">AVG EXPERIENCE</h3>
              <p className="lcars-text-large">
                {Math.round(crewMembers.reduce((acc, c) => acc + c.experience, 0) / crewMembers.length)}
              </p>
              <p className="lcars-text-small">Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crew Directory */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">CREW DIRECTORY</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-2">
            {crewMembers.map(crewMember => (
              <div key={crewMember.id} className="lcars-grid-item lcars-crew-card">
                <div className="lcars-crew-header">
                  <div className="lcars-crew-avatar">
                    <UserIcon className="lcars-icon-large" />
                  </div>
                  <div className="lcars-crew-info">
                    <h3 className="lcars-text-medium lcars-text-orange">{crewMember.name}</h3>
                    <p className="lcars-text-small lcars-text-blue">{crewMember.rank}</p>
                  </div>
                  <div className="lcars-crew-status">
                    <span 
                      className="lcars-status-badge"
                      style={{ backgroundColor: getStatusColor(crewMember.status) }}
                    >
                      {crewMember.status.toUpperCase()}
                    </span>
                    <span 
                      className="lcars-department-badge"
                      style={{ backgroundColor: getDepartmentColor(crewMember.department) }}
                    >
                      {crewMember.department.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="lcars-crew-details">
                  <div className="lcars-crew-specialization">
                    <h4 className="lcars-text-small lcars-text-yellow">Specialization</h4>
                    <p className="lcars-text-small">{crewMember.specialization}</p>
                  </div>
                  
                  <div className="lcars-crew-contact">
                    <div className="lcars-contact-item">
                      <EnvelopeIcon className="lcars-icon-small" />
                      <span className="lcars-text-small">{crewMember.email}</span>
                    </div>
                    <div className="lcars-contact-item">
                      <PhoneIcon className="lcars-icon-small" />
                      <span className="lcars-text-small">{crewMember.phone}</span>
                    </div>
                  </div>
                  
                  <div className="lcars-crew-metrics">
                    <div className="lcars-metric-item">
                      <StarIcon className="lcars-icon-small" />
                      <span className="lcars-text-small">Experience: {crewMember.experience} years</span>
                    </div>
                    <div className="lcars-metric-item">
                      <ShieldCheckIcon className="lcars-icon-small" />
                      <span className="lcars-text-small">Performance: {crewMember.performance}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="lcars-crew-actions">
                  <button 
                    onClick={() => handleViewCrewMember(crewMember.id)}
                    className="lcars-cta-button lcars-cta-info"
                  >
                    <EyeIcon className="lcars-icon-small" />
                    <span>VIEW</span>
                  </button>
                  <button 
                    onClick={() => handleEditCrewMember(crewMember.id)}
                    className="lcars-cta-button lcars-cta-warning"
                  >
                    <PencilIcon className="lcars-icon-small" />
                    <span>EDIT</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteCrewMember(crewMember.id)}
                    className="lcars-cta-button lcars-cta-danger"
                  >
                    <TrashIcon className="lcars-icon-small" />
                    <span>DELETE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
