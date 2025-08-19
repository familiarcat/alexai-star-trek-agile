#!/usr/bin/env node

/**
 * Crew Production Recommendation Script
 * Analyzes browser UI test results and provides crew recommendations
 * for production deployment viability
 */

const fs = require('fs').promises;
const path = require('path');

class CrewProductionRecommendation {
  constructor() {
    this.testReportsDir = 'test-screenshots';
    this.recommendations = [];
  }

  async analyzeTestResults() {
    console.log('🧠 Crew Analysis: Analyzing browser UI test results...\n');

    try {
      // Read test reports
      const visualAuditReport = await this.readTestReport('visual-consistency-audit/visual-consistency-audit-report.json');
      const userIntentReport = await this.readTestReport('user-intent-responsive-testing/user-intent-responsive-report-1755593151393.json');
      const shipComputerReport = await this.readTestReport('ship-computer-ui-testing/ship-computer-test-report-1755593357332.json');

      // Analyze each crew member's perspective
      await this.getCaptainPicardAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getCommanderSpockAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getCommanderDataAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getCounselorTroiAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getChiefEngineerScottAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getLieutenantWorfAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getQuarkAnalysis(visualAuditReport, userIntentReport, shipComputerReport);
      await this.getObservationLoungeAnalysis(visualAuditReport, userIntentReport, shipComputerReport);

      // Generate final recommendation
      await this.generateFinalRecommendation();

    } catch (error) {
      console.error('❌ Error analyzing test results:', error.message);
    }
  }

  async readTestReport(reportPath) {
    try {
      const fullPath = path.join(this.testReportsDir, reportPath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`⚠️ Could not read report ${reportPath}: ${error.message}`);
      return null;
    }
  }

  async getCaptainPicardAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('👨‍✈️ Captain Picard Analysis:');
    
    const visualIssues = visualReport?.totalIssues || 0;
    const userIntentSuccess = userIntentReport?.summary?.passed || 0;
    const userIntentTotal = userIntentReport?.summary?.total || 0;
    const shipComputerSuccess = shipComputerReport?.summary?.passed || 0;
    const shipComputerTotal = shipComputerReport?.summary?.total || 0;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (visualIssues <= 50) {
      reasoning.push('✅ Visual consistency is acceptable');
    } else {
      reasoning.push('❌ Too many visual consistency issues');
    }

    if (userIntentSuccess / userIntentTotal >= 0.7) {
      reasoning.push('✅ User intent testing shows good functionality');
    } else {
      reasoning.push('❌ User intent testing reveals significant issues');
    }

    if (shipComputerSuccess / shipComputerTotal >= 0.6) {
      reasoning.push('✅ Ship Computer integration is operational');
    } else {
      reasoning.push('❌ Ship Computer integration needs improvement');
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 2) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Captain Picard',
      recommendation,
      reasoning,
      priority: 'strategic'
    });
  }

  async getCommanderSpockAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('🖖 Commander Spock Analysis:');
    
    const visualCritical = visualReport?.issuesBySeverity?.critical || 0;
    const visualModerate = visualReport?.issuesBySeverity?.moderate || 0;
    const shipComputerStatus = shipComputerReport?.shipComputerStatus || 'unknown';

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (visualCritical === 0) {
      reasoning.push('✅ No critical visual issues detected');
    } else {
      reasoning.push(`❌ ${visualCritical} critical visual issues found`);
    }

    if (visualModerate <= 20) {
      reasoning.push('✅ Moderate visual issues are manageable');
    } else {
      reasoning.push(`❌ Too many moderate visual issues (${visualModerate})`);
    }

    if (shipComputerStatus === 'OPERATIONAL') {
      reasoning.push('✅ Ship Computer is fully operational');
    } else {
      reasoning.push('❌ Ship Computer status is concerning');
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 2) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Commander Spock',
      recommendation,
      reasoning,
      priority: 'logical'
    });
  }

  async getCommanderDataAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('🤖 Commander Data Analysis:');
    
    const totalTests = (userIntentReport?.summary?.total || 0) + (shipComputerReport?.summary?.total || 0);
    const passedTests = (userIntentReport?.summary?.passed || 0) + (shipComputerReport?.summary?.passed || 0);
    const successRate = totalTests > 0 ? passedTests / totalTests : 0;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (successRate >= 0.6) {
      reasoning.push(`✅ Overall test success rate is acceptable (${(successRate * 100).toFixed(1)}%)`);
    } else {
      reasoning.push(`❌ Overall test success rate is too low (${(successRate * 100).toFixed(1)}%)`);
    }

    if (totalTests >= 20) {
      reasoning.push('✅ Sufficient test coverage achieved');
    } else {
      reasoning.push('❌ Insufficient test coverage');
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 1) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Commander Data',
      recommendation,
      reasoning,
      priority: 'analytical'
    });
  }

  async getCounselorTroiAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('👩‍⚕️ Counselor Troi Analysis:');
    
    const userIntentFailed = userIntentReport?.summary?.failed || 0;
    const userIntentTotal = userIntentReport?.summary?.total || 0;
    const userExperienceScore = userIntentTotal > 0 ? (userIntentTotal - userIntentFailed) / userIntentTotal : 0;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (userExperienceScore >= 0.5) {
      reasoning.push(`✅ User experience score is acceptable (${(userExperienceScore * 100).toFixed(1)}%)`);
    } else {
      reasoning.push(`❌ User experience score is concerning (${(userExperienceScore * 100).toFixed(1)}%)`);
    }

    if (userIntentFailed <= 10) {
      reasoning.push('✅ User intent failures are manageable');
    } else {
      reasoning.push(`❌ Too many user intent failures (${userIntentFailed})`);
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 1) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Counselor Troi',
      recommendation,
      reasoning,
      priority: 'user_experience'
    });
  }

  async getChiefEngineerScottAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('🔧 Chief Engineer Scott Analysis:');
    
    const shipComputerStatus = shipComputerReport?.shipComputerStatus || 'unknown';
    const performanceMetrics = shipComputerReport?.performanceMetrics || {};
    const loadTime = performanceMetrics.loadTime || 0;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (shipComputerStatus === 'OPERATIONAL') {
      reasoning.push('✅ Ship Computer systems are operational');
    } else {
      reasoning.push('❌ Ship Computer systems need attention');
    }

    if (loadTime <= 3000) {
      reasoning.push('✅ Performance metrics are acceptable');
    } else {
      reasoning.push(`❌ Performance is too slow (${loadTime}ms)`);
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 1) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Chief Engineer Scott',
      recommendation,
      reasoning,
      priority: 'technical'
    });
  }

  async getLieutenantWorfAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('🛡️ Lieutenant Worf Analysis:');
    
    const visualIssues = visualReport?.totalIssues || 0;
    const criticalIssues = visualReport?.issuesBySeverity?.critical || 0;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (criticalIssues === 0) {
      reasoning.push('✅ No critical security vulnerabilities detected');
    } else {
      reasoning.push(`❌ ${criticalIssues} critical issues pose security risks`);
    }

    if (visualIssues <= 100) {
      reasoning.push('✅ Visual issues are within acceptable parameters');
    } else {
      reasoning.push(`❌ Too many visual issues (${visualIssues}) for secure deployment`);
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 1) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Lieutenant Worf',
      recommendation,
      reasoning,
      priority: 'security'
    });
  }

  async getQuarkAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('💰 Quark Analysis:');
    
    const totalIssues = visualReport?.totalIssues || 0;
    const userIntentSuccess = userIntentReport?.summary?.passed || 0;
    const userIntentTotal = userIntentReport?.summary?.total || 0;
    const successRate = userIntentTotal > 0 ? userIntentSuccess / userIntentTotal : 0;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (totalIssues <= 150) {
      reasoning.push('✅ Issue count is within profitable parameters');
    } else {
      reasoning.push(`❌ Too many issues (${totalIssues}) for profitable operation`);
    }

    if (successRate >= 0.4) {
      reasoning.push(`✅ Success rate (${(successRate * 100).toFixed(1)}%) supports business viability`);
    } else {
      reasoning.push(`❌ Success rate (${(successRate * 100).toFixed(1)}%) is too low for profitability`);
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 1) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Quark',
      recommendation,
      reasoning,
      priority: 'business'
    });
  }

  async getObservationLoungeAnalysis(visualReport, userIntentReport, shipComputerReport) {
    console.log('🛋️ Observation Lounge Analysis:');
    
    const recommendations = this.recommendations;
    const deployRecommendations = recommendations.filter(r => r.recommendation.includes('RECOMMENDED')).length;
    const totalCrew = recommendations.length;

    let recommendation = '🚫 DEPLOYMENT NOT RECOMMENDED';
    let reasoning = [];

    if (deployRecommendations >= totalCrew * 0.6) {
      reasoning.push(`✅ Crew consensus supports deployment (${deployRecommendations}/${totalCrew})`);
    } else {
      reasoning.push(`❌ Insufficient crew consensus (${deployRecommendations}/${totalCrew})`);
    }

    if (reasoning.filter(r => r.startsWith('✅')).length >= 1) {
      recommendation = '✅ DEPLOYMENT RECOMMENDED';
    }

    console.log(`   Recommendation: ${recommendation}`);
    console.log(`   Reasoning: ${reasoning.join(', ')}\n`);

    this.recommendations.push({
      crew: 'Observation Lounge',
      recommendation,
      reasoning,
      priority: 'consensus'
    });
  }

  async generateFinalRecommendation() {
    console.log('🎯 FINAL CREW RECOMMENDATION:\n');

    const deployCount = this.recommendations.filter(r => r.recommendation.includes('RECOMMENDED')).length;
    const totalCrew = this.recommendations.length;
    const consensusPercentage = (deployCount / totalCrew) * 100;

    console.log(`📊 Crew Consensus: ${deployCount}/${totalCrew} (${consensusPercentage.toFixed(1)}%)`);

    let finalRecommendation = '🚫 PRODUCTION DEPLOYMENT NOT RECOMMENDED';
    let finalReasoning = [];

    if (consensusPercentage >= 60) {
      finalRecommendation = '✅ PRODUCTION DEPLOYMENT RECOMMENDED';
      finalReasoning.push('✅ Strong crew consensus for deployment');
    } else {
      finalReasoning.push('❌ Insufficient crew consensus for deployment');
    }

    if (consensusPercentage >= 80) {
      finalReasoning.push('✅ High confidence in system readiness');
    } else if (consensusPercentage >= 60) {
      finalReasoning.push('⚠️ Moderate confidence - proceed with caution');
    } else {
      finalReasoning.push('❌ Low confidence - additional work required');
    }

    console.log(`\n🎯 FINAL DECISION: ${finalRecommendation}`);
    console.log(`📝 Reasoning: ${finalReasoning.join(', ')}`);

    if (finalRecommendation.includes('RECOMMENDED')) {
      console.log('\n🚀 DEPLOYMENT ACTION PLAN:');
      console.log('1. ✅ Proceed with production deployment');
      console.log('2. 📊 Monitor system performance closely');
      console.log('3. 🔧 Address any issues identified by crew');
      console.log('4. 📈 Track user feedback and metrics');
    } else {
      console.log('\n🔧 PRE-DEPLOYMENT ACTION PLAN:');
      console.log('1. 🔍 Address issues identified by crew');
      console.log('2. 🧪 Run additional tests as needed');
      console.log('3. 🔧 Fix critical and moderate issues');
      console.log('4. 📊 Re-run browser UI tests');
      console.log('5. 🎯 Re-evaluate with crew consensus');
    }

    // Save recommendation report
    const report = {
      timestamp: new Date().toISOString(),
      finalRecommendation,
      consensusPercentage,
      finalReasoning,
      crewRecommendations: this.recommendations,
      summary: {
        totalCrew: totalCrew,
        deployRecommendations: deployCount,
        notRecommended: totalCrew - deployCount
      }
    };

    await fs.writeFile(
      'docs/crew-production-recommendation.json',
      JSON.stringify(report, null, 2)
    );

    console.log('\n📄 Detailed report saved to: docs/crew-production-recommendation.json');
  }

  async run() {
    console.log('🚀 Crew Production Recommendation Analysis\n');
    console.log('==========================================\n');
    
    await this.analyzeTestResults();
    
    console.log('🎉 Analysis complete!');
  }
}

// Run the analysis
const analyzer = new CrewProductionRecommendation();
analyzer.run().catch(console.error);

