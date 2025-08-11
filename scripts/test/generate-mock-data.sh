#!/bin/bash

# Mock Data Generator for AlexAI Agent Testing
# Generates realistic test data for comprehensive agent validation

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MOCK_DATA_DIR="$PROJECT_ROOT/tests/fixtures/mock-data"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Ensure mock data directory exists
mkdir -p "$MOCK_DATA_DIR"

echo -e "${CYAN}🎭 AlexAI Mock Data Generator${NC}"
echo -e "${CYAN}============================${NC}"
echo ""

# Function to generate crew agent mock data
generate_crew_mock_data() {
    echo -e "${BLUE}🤖 Generating crew agent mock data...${NC}"
    
    cat > "$MOCK_DATA_DIR/crew_agents.json" << 'EOF'
{
  "captain_picard": {
    "context": "Strategic decision making for diplomatic mission to Betazed",
    "priority": "high",
    "crew_members": ["lieutenant_data", "counselor_troi", "commander_riker"],
    "mission_type": "diplomatic",
    "stardate": "47988.1",
    "sector": "Beta Quadrant",
    "threat_level": "moderate",
    "diplomatic_protocols": ["first_contact", "cultural_exchange", "trade_negotiation"],
    "expected_duration": "72_hours",
    "resources_required": ["diplomatic_team", "cultural_database", "translation_matrix"]
  },
  "lieutenant_data": {
    "context": "Technical analysis of advanced alien technology discovered in asteroid field",
    "priority": "medium",
    "crew_members": ["chief_engineer_scott", "chief_obrien"],
    "analysis_type": "technology_assessment",
    "technology_category": "propulsion_system",
    "complexity_level": "advanced",
    "safety_concerns": ["unknown_energy_signatures", "unstable_quantum_fields"],
    "analysis_tools": ["tricorder", "quantum_scanner", "energy_analyzer"],
    "estimated_analysis_time": "48_hours",
    "potential_applications": ["warp_drive_enhancement", "shield_technology", "weapon_systems"]
  },
  "counselor_troi": {
    "context": "Psychological profile analysis of newly discovered telepathic species",
    "priority": "medium",
    "crew_members": ["captain_picard", "dr_crusher"],
    "analysis_type": "psychological_assessment",
    "species_characteristics": ["telepathic", "emotionally_sensitive", "collective_consciousness"],
    "risk_factors": ["mental_projection", "emotional_overwhelm", "cultural_shock"],
    "assessment_methods": ["empathic_scan", "cultural_observation", "interaction_analysis"],
    "adaptation_strategies": ["mental_shields", "cultural_mediation", "gradual_exposure"],
    "recommended_approach": "cautious_optimism"
  },
  "chief_engineer_scott": {
    "context": "Critical engineering solution for warp core instability during battle",
    "priority": "critical",
    "crew_members": ["lieutenant_data", "chief_obrien", "ensign_la_forge"],
    "problem_type": "warp_core_issue",
    "symptoms": ["plasma_leaks", "energy_fluctuations", "containment_breach_imminent"],
    "root_cause": "damaged_dilithium_crystals",
    "immediate_actions": ["emergency_shutdown", "containment_field_reinforcement", "coolant_injection"],
    "repair_priority": "immediate",
    "estimated_repair_time": "6_hours",
    "required_materials": ["dilithium_crystals", "plasma_conduits", "containment_field_generators"],
    "safety_protocols": ["radiation_shielding", "emergency_evacuation", "containment_breach_protocols"]
  },
  "commander_spock": {
    "context": "Logical analysis of temporal paradox caused by time travel incident",
    "priority": "high",
    "crew_members": ["lieutenant_data", "captain_picard", "dr_crusher"],
    "analysis_type": "temporal_analysis",
    "paradox_type": "grandfather_paradox",
    "temporal_anomaly_indicators": ["chroniton_particles", "temporal_distortion_fields", "causality_loops"],
    "affected_timeline_period": "past_100_years",
    "potential_solutions": ["temporal_reset", "causality_restoration", "timeline_merging"],
    "risk_assessment": "extreme",
    "required_precautions": ["temporal_shielding", "causality_monitoring", "emergency_temporal_reset"],
    "analysis_complexity": "maximum"
  },
  "lieutenant_worf": {
    "context": "Security protocol assessment for hostile environment in Klingon space",
    "priority": "high",
    "crew_members": ["captain_picard", "security_team_alpha"],
    "security_level": "maximum",
    "threat_assessment": "hostile_klingon_factions",
    "environmental_hazards": ["ion_storms", "gravitational_anomalies", "radiation_belts"],
    "security_measures": ["enhanced_shields", "weapons_ready", "cloaking_detection"],
    "evasion_protocols": ["stealth_mode", "emergency_escape_routes", "distress_beacon_disabled"],
    "combat_readiness": "maximum",
    "escape_plan": "multiple_evasion_routes",
    "backup_support": "federation_fleet_standby"
  }
}
EOF

    echo -e "${GREEN}✅ Crew agent mock data generated${NC}"
}

# Function to generate specialized agent mock data
generate_specialized_mock_data() {
    echo -e "${BLUE}🔬 Generating specialized agent mock data...${NC}"
    
    cat > "$MOCK_DATA_DIR/specialized_agents.json" << 'EOF'
{
  "ships_computer": {
    "context": "Comprehensive database query for historical mission data analysis",
    "query_type": "mission_history",
    "timeframe": "last_5_years",
    "data_categories": ["diplomatic_missions", "scientific_discoveries", "combat_engagements", "first_contacts"],
    "analysis_depth": "comprehensive",
    "correlation_factors": ["stardate", "sector", "crew_composition", "mission_outcome"],
    "output_format": "detailed_report",
    "data_volume": "large_dataset",
    "processing_priority": "high",
    "required_insights": ["mission_success_patterns", "risk_assessment_trends", "crew_performance_metrics"]
  },
  "multimodal_agency": {
    "context": "Advanced analysis of visual sensor data from unknown alien object",
    "data_type": "visual_sensors",
    "analysis_depth": "comprehensive",
    "sensor_data": {
      "visual_spectrum": ["visible_light", "infrared", "ultraviolet"],
      "energy_signatures": ["plasma_emissions", "quantum_fields", "temporal_distortions"],
      "structural_analysis": ["molecular_composition", "energy_patterns", "temporal_anomalies"]
    },
    "analysis_parameters": {
      "resolution": "maximum",
      "temporal_analysis": "real_time",
      "pattern_recognition": "advanced_ai",
      "threat_assessment": "immediate"
    },
    "expected_outputs": ["object_identification", "threat_assessment", "interaction_protocols", "safety_recommendations"]
  },
  "bilateral_learning": {
    "context": "Cross-agent knowledge synthesis for enhanced mission coordination",
    "agents_involved": ["captain_picard", "lieutenant_data", "counselor_troi"],
    "learning_type": "collaborative",
    "knowledge_domains": ["strategic_planning", "technical_analysis", "psychological_insights"],
    "synthesis_methods": ["pattern_matching", "cross_reference_analysis", "emergent_knowledge_generation"],
    "learning_objectives": ["improved_coordination", "enhanced_decision_making", "adaptive_strategies"],
    "expected_outcomes": ["unified_mission_strategy", "optimized_crew_utilization", "enhanced_risk_mitigation"],
    "integration_level": "deep_synthesis"
  },
  "enhanced_knowledge": {
    "context": "Knowledge base expansion with new discoveries from alien civilization",
    "discovery_type": "alien_civilization",
    "integration_priority": "high",
    "discovery_categories": ["technology", "culture", "history", "philosophy", "science"],
    "knowledge_volume": "extensive",
    "verification_status": "preliminary",
    "integration_methods": ["categorization", "cross_referencing", "validation", "synthesis"],
    "access_levels": ["public", "restricted", "classified", "captain_only"],
    "update_frequency": "real_time",
    "quality_metrics": ["accuracy", "completeness", "relevance", "timeliness"]
  }
}
EOF

    echo -e "${GREEN}✅ Specialized agent mock data generated${NC}"
}

# Function to generate orchestration agent mock data
generate_orchestration_mock_data() {
    echo -e "${BLUE}🎯 Generating orchestration agent mock data...${NC}"
    
    cat > "$MOCK_DATA_DIR/orchestration_agents.json" << 'EOF'
{
  "crew_coordination": {
    "context": "Multi-agent mission coordination for deep space exploration mission",
    "mission_type": "exploration",
    "crew_size": 6,
    "duration": "72_hours",
    "mission_parameters": {
      "destination": "unexplored_nebula",
      "objectives": ["scientific_analysis", "resource_mapping", "anomaly_investigation"],
      "risk_level": "moderate",
      "resource_allocation": "standard"
    },
    "coordination_requirements": {
      "communication_protocols": ["real_time", "hierarchical", "emergency_override"],
      "decision_making": ["consensus", "captain_authority", "expert_opinion"],
      "resource_sharing": ["equipment", "data", "expertise"],
      "conflict_resolution": ["immediate", "escalation_protocols", "mediation"]
    },
    "success_metrics": ["mission_completion", "crew_safety", "scientific_discoveries", "efficiency"]
  },
  "ship_agency": {
    "context": "Automated ship systems management during critical operations",
    "systems": ["life_support", "navigation", "communications", "weapons", "shields", "engines"],
    "autonomy_level": "full",
    "operational_modes": {
      "normal": "standard_automation",
      "alert": "enhanced_monitoring",
      "battle": "combat_automation",
      "emergency": "survival_automation"
    },
    "decision_parameters": {
      "safety_thresholds": "maximum",
      "efficiency_optimization": "balanced",
      "resource_conservation": "moderate",
      "crew_comfort": "standard"
    },
    "emergency_protocols": ["automatic_evasion", "emergency_shields", "life_support_priority", "distress_beacon"]
  },
  "llm_orchestration": {
    "context": "Multi-LLM task distribution for complex problem solving",
    "llm_providers": ["openai", "anthropic", "local", "specialized"],
    "task_complexity": "high",
    "orchestration_strategy": {
      "task_decomposition": "hierarchical",
      "llm_selection": "capability_based",
      "result_synthesis": "intelligent_merging",
      "quality_assurance": "cross_validation"
    },
    "task_categories": {
      "strategic_planning": "openai_gpt4",
      "technical_analysis": "anthropic_claude",
      "creative_solutions": "local_models",
      "specialized_knowledge": "domain_specific"
    },
    "coordination_mechanisms": ["workflow_management", "result_aggregation", "conflict_resolution", "quality_optimization"]
  }
}
EOF

    echo -e "${GREEN}✅ Orchestration agent mock data generated${NC}"
}

# Function to generate workflow validation mock data
generate_workflow_validation_data() {
    echo -e "${BLUE}🔄 Generating workflow validation mock data...${NC}"
    
    cat > "$MOCK_DATA_DIR/workflow_validation.json" << 'EOF'
{
  "validation_type": "comprehensive",
  "include_specialized": true,
  "test_depth": "full_integration",
  "mock_execution": true,
  "validation_parameters": {
    "test_scenarios": ["normal_operation", "high_load", "error_conditions", "edge_cases"],
    "performance_metrics": ["response_time", "throughput", "error_rate", "resource_usage"],
    "validation_criteria": ["functionality", "reliability", "performance", "security"],
    "test_duration": "extended"
  },
  "workflow_specific_tests": {
    "comprehensive_agent_validation": {
      "test_cases": ["single_agent", "multi_agent", "full_system", "stress_test"],
      "expected_outcomes": ["validation_plan", "health_checks", "system_status", "recommendations"]
    },
    "crew_coordination": {
      "test_cases": ["simple_coordination", "complex_mission", "emergency_response", "conflict_resolution"],
      "expected_outcomes": ["crew_status", "coordination_level", "mission_status", "efficiency_metrics"]
    },
    "bilateral_learning": {
      "test_cases": ["knowledge_synthesis", "cross_agent_learning", "adaptive_improvement", "performance_optimization"],
      "expected_outcomes": ["sync_status", "learning_progress", "knowledge_gained", "improvement_metrics"]
    },
    "multimodal_agency": {
      "test_cases": ["data_analysis", "pattern_recognition", "insight_generation", "threat_assessment"],
      "expected_outcomes": ["analysis_result", "data_processed", "insights_generated", "confidence_levels"]
    }
  }
}
EOF

    echo -e "${GREEN}✅ Workflow validation mock data generated${NC}"
}

# Function to generate integration scenario mock data
generate_integration_scenarios() {
    echo -e "${BLUE}🔗 Generating integration scenario mock data...${NC}"
    
    cat > "$MOCK_DATA_DIR/integration_scenarios.json" << 'EOF'
{
  "multi_agent_mission": {
    "scenario": "multi_agent_mission",
    "agents": ["captain_picard", "lieutenant_data", "chief_engineer_scott"],
    "mission_type": "critical_engineering",
    "priority": "critical",
    "timeframe": "immediate",
    "mission_parameters": {
      "objective": "repair_critical_system_failure",
      "constraints": ["time_pressure", "resource_limitations", "safety_requirements"],
      "success_criteria": ["system_restoration", "crew_safety", "mission_continuation"]
    },
    "coordination_requirements": {
      "real_time_communication": true,
      "shared_decision_making": true,
      "resource_coordination": true,
      "progress_tracking": true
    }
  },
  "knowledge_synthesis": {
    "scenario": "knowledge_synthesis",
    "agents": ["enhanced_knowledge", "bilateral_learning"],
    "synthesis_type": "cross_domain",
    "complexity": "high",
    "synthesis_parameters": {
      "domains": ["science", "technology", "culture", "history"],
      "synthesis_method": "intelligent_integration",
      "output_format": "comprehensive_knowledge_base",
      "validation_required": true
    },
    "expected_outcomes": {
      "new_insights": "emergent_knowledge",
      "pattern_recognition": "cross_domain_patterns",
      "knowledge_relationships": "interconnected_understanding",
      "applicability": "practical_applications"
    }
  },
  "emergency_response": {
    "scenario": "emergency_response",
    "agents": ["lieutenant_worf", "chief_engineer_scott", "dr_crusher"],
    "emergency_type": "multiple_system_failures",
    "priority": "critical",
    "response_parameters": {
      "immediate_actions": ["damage_assessment", "safety_measures", "emergency_protocols"],
      "coordination_requirements": ["unified_command", "resource_allocation", "communication_management"],
      "success_criteria": ["crew_safety", "system_stabilization", "mission_survival"]
    },
    "time_critical_factors": ["life_support", "structural_integrity", "power_systems", "communications"]
  }
}
EOF

    echo -e "${GREEN}✅ Integration scenario mock data generated${NC}"
}

# Function to generate test configuration
generate_test_configuration() {
    echo -e "${BLUE}⚙️ Generating test configuration...${NC}"
    
    cat > "$MOCK_DATA_DIR/test_config.json" << 'EOF'
{
  "test_environment": {
    "local_url": "http://localhost:8000",
    "n8n_url": "https://n8n.pbradygeorgen.com",
    "timeout_settings": {
      "api_requests": 15,
      "workflow_execution": 30,
      "integration_tests": 20
    },
    "retry_settings": {
      "max_retries": 3,
      "retry_delay": 2,
      "backoff_multiplier": 1.5
    }
  },
  "test_data": {
    "mock_data_files": [
      "crew_agents.json",
      "specialized_agents.json",
      "orchestration_agents.json",
      "workflow_validation.json",
      "integration_scenarios.json"
    ],
    "data_refresh_interval": "24_hours",
    "validation_required": true
  },
  "reporting": {
    "output_format": "json",
    "include_timestamps": true,
    "include_performance_metrics": true,
    "include_recommendations": true,
    "report_retention": "30_days"
  },
  "notifications": {
    "email_alerts": false,
    "slack_notifications": false,
    "console_output": true,
    "log_file_output": true
  }
}
EOF

    echo -e "${GREEN}✅ Test configuration generated${NC}"
}

# Function to create mock data index
create_mock_data_index() {
    echo -e "${BLUE}📋 Creating mock data index...${NC}"
    
    cat > "$MOCK_DATA_DIR/README.md" << 'EOF'
# AlexAI Mock Data for Comprehensive Testing

This directory contains realistic mock data for testing all AlexAI agents and n8n workflows.

## File Structure

- `crew_agents.json` - Mock data for Star Trek crew agents
- `specialized_agents.json` - Mock data for specialized AI agents
- `orchestration_agents.json` - Mock data for coordination agents
- `workflow_validation.json` - Mock data for n8n workflow testing
- `integration_scenarios.json` - Mock data for complex integration tests
- `test_config.json` - Test configuration and settings

## Usage

These mock data files are automatically used by the comprehensive test suite:

```bash
# Run the comprehensive test suite
./scripts/test/run-comprehensive-agent-test.sh

# Or run the Python test directly
python3 tests/integration/comprehensive_agent_workflow_test.py
```

## Data Categories

### Crew Agents
- Captain Picard (Strategic Decision Making)
- Lieutenant Data (Technical Analysis)
- Counselor Troi (Psychological Assessment)
- Chief Engineer Scott (Engineering Solutions)
- Commander Spock (Logical Analysis)
- Lieutenant Worf (Security Protocols)

### Specialized Agents
- Ship's Computer (Database Operations)
- Multimodal Agency (Visual Data Analysis)
- Bilateral Learning (Cross-Agent Knowledge)
- Enhanced Knowledge (Knowledge Base Management)

### Orchestration Agents
- Crew Coordination (Mission Management)
- Ship Agency (Systems Automation)
- LLM Orchestration (Multi-LLM Coordination)

## Test Scenarios

The mock data includes realistic scenarios such as:
- Diplomatic missions
- Engineering emergencies
- Scientific discoveries
- Security threats
- Multi-agent coordination
- Knowledge synthesis
- Emergency response

## Customization

You can modify these mock data files to test specific scenarios or add new test cases. The test suite will automatically detect and use updated data.

## Validation

All mock data is validated for:
- Realistic Star Trek universe consistency
- Proper data structure and format
- Appropriate complexity levels
- Meaningful test scenarios
EOF

    echo -e "${GREEN}✅ Mock data index created${NC}"
}

# Main execution
main() {
    echo -e "${CYAN}🎭 Starting mock data generation...${NC}"
    echo ""
    
    # Generate all mock data categories
    generate_crew_mock_data
    generate_specialized_mock_data
    generate_orchestration_mock_data
    generate_workflow_validation_data
    generate_integration_scenarios
    generate_test_configuration
    create_mock_data_index
    
    echo ""
    echo -e "${GREEN}🎉 Mock data generation completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📁 Generated files in: $MOCK_DATA_DIR${NC}"
    echo ""
    echo -e "${CYAN}📋 Generated mock data for:${NC}"
    echo -e "  • ${GREEN}6 Crew Agents${NC} (Captain Picard, Data, Troi, Scott, Spock, Worf)"
    echo -e "  • ${GREEN}4 Specialized Agents${NC} (Computer, Multimodal, Learning, Knowledge)"
    echo -e "  • ${GREEN}3 Orchestration Agents${NC} (Coordination, Ship, LLM)"
    echo -e "  • ${GREEN}4 Integration Scenarios${NC} (Mission, Synthesis, Emergency)"
    echo -e "  • ${GREEN}Workflow Validation${NC} (Comprehensive testing parameters)"
    echo ""
    echo -e "${BLUE}🚀 Ready to run comprehensive agent tests!${NC}"
    echo -e "${BLUE}   Use: ./scripts/test/run-comprehensive-agent-test.sh${NC}"
    echo ""
    echo -e "${GREEN}🖖 Live long and prosper!${NC}"
}

# Execute main function
main "$@"
