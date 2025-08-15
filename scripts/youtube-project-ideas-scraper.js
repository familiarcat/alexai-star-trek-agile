#!/usr/bin/env node

// 🚀 YouTube Project Ideas Scraper
// This script scrapes YouTube channels to extract revenue-generating project ideas
// and converts them into templates for our revolutionary project generator

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class YouTubeProjectIdeasScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.projectIdeas = [];
    this.channelData = {};
  }

  async initialize() {
    console.log('🚀 Initializing YouTube Project Ideas Scraper...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid detection
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('✅ Browser initialized successfully');
  }

  async scrapeChannel(channelUrl) {
    try {
      console.log(`📺 Scraping channel: ${channelUrl}`);
      
      await this.page.goto(channelUrl, { waitUntil: 'networkidle2' });
      
      // Extract channel information
      const channelInfo = await this.extractChannelInfo();
      this.channelData = channelInfo;
      
      console.log(`📊 Channel: ${channelInfo.name}`);
      console.log(`👥 Subscribers: ${channelInfo.subscribers}`);
      console.log(`📹 Videos: ${channelInfo.videoCount}`);
      
      // Scroll to load more videos
      await this.scrollToLoadVideos();
      
      // Extract video data
      const videos = await this.extractVideos();
      console.log(`🎬 Found ${videos.length} videos`);
      
      // Analyze videos for project ideas
      const projectIdeas = await this.analyzeVideosForProjectIdeas(videos);
      
      // Generate project templates
      const projectTemplates = await this.generateProjectTemplates(projectIdeas);
      
      return {
        channel: channelInfo,
        videos: videos,
        projectIdeas: projectIdeas,
        projectTemplates: projectTemplates
      };
      
    } catch (error) {
      console.error('❌ Error scraping channel:', error);
      throw error;
    }
  }

  async extractChannelInfo() {
    const channelInfo = await this.page.evaluate(() => {
      const nameElement = document.querySelector('#channel-name #text');
      const subscribersElement = document.querySelector('#subscriber-count');
      const videoCountElement = document.querySelector('#video-count');
      const descriptionElement = document.querySelector('#description');
      
      return {
        name: nameElement ? nameElement.textContent.trim() : 'Unknown Channel',
        subscribers: subscribersElement ? subscribersElement.textContent.trim() : 'Unknown',
        videoCount: videoCountElement ? videoCountElement.textContent.trim() : 'Unknown',
        description: descriptionElement ? descriptionElement.textContent.trim() : '',
        url: window.location.href
      };
    });
    
    return channelInfo;
  }

  async scrollToLoadVideos() {
    console.log('📜 Scrolling to load more videos...');
    
    for (let i = 0; i < 5; i++) {
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await this.page.waitForTimeout(2000);
    }
  }

  async extractVideos() {
    const videos = await this.page.evaluate(() => {
      const videoElements = document.querySelectorAll('#video-title');
      const videoData = [];
      
      videoElements.forEach((element, index) => {
        if (index < 50) { // Limit to first 50 videos
          const title = element.textContent.trim();
          const url = element.href;
          const viewsElement = element.closest('ytd-grid-video-renderer')?.querySelector('#metadata-line');
          const views = viewsElement ? viewsElement.textContent.trim() : 'Unknown views';
          
          videoData.push({
            title: title,
            url: url,
            views: views,
            index: index + 1
          });
        }
      });
      
      return videoData;
    });
    
    return videos;
  }

  async analyzeVideosForProjectIdeas(videos) {
    console.log('🧠 Analyzing videos for project ideas...');
    
    const projectIdeas = [];
    
    for (const video of videos) {
      const idea = await this.extractProjectIdeaFromVideo(video);
      if (idea) {
        projectIdeas.push(idea);
      }
    }
    
    // Group similar ideas
    const groupedIdeas = this.groupSimilarIdeas(projectIdeas);
    
    return groupedIdeas;
  }

  async extractProjectIdeaFromVideo(video) {
    // Analyze video title for business opportunities
    const title = video.title.toLowerCase();
    const words = title.split(' ');
    
    // Keywords that indicate business opportunities
    const businessKeywords = [
      'business', 'startup', 'entrepreneur', 'money', 'revenue', 'profit',
      'saas', 'app', 'platform', 'tool', 'service', 'agency', 'consulting',
      'automation', 'ai', 'software', 'digital', 'online', 'remote',
      'passive income', 'side hustle', 'freelance', 'dropshipping', 'ecommerce',
      'marketing', 'social media', 'content', 'course', 'coaching', 'mentoring'
    ];
    
    const hasBusinessKeywords = businessKeywords.some(keyword => 
      title.includes(keyword)
    );
    
    if (hasBusinessKeywords) {
      // Extract potential project idea
      const idea = {
        title: video.title,
        url: video.url,
        views: video.views,
        category: this.categorizeIdea(title),
        revenuePotential: this.estimateRevenuePotential(title),
        targetMarket: this.identifyTargetMarket(title),
        complexity: this.assessComplexity(title),
        description: this.generateDescription(title),
        features: this.extractFeatures(title)
      };
      
      return idea;
    }
    
    return null;
  }

  categorizeIdea(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('saas') || titleLower.includes('software') || titleLower.includes('app')) {
      return 'Software & SaaS';
    } else if (titleLower.includes('marketing') || titleLower.includes('social media')) {
      return 'Marketing & Social Media';
    } else if (titleLower.includes('ai') || titleLower.includes('automation')) {
      return 'AI & Automation';
    } else if (titleLower.includes('ecommerce') || titleLower.includes('dropshipping')) {
      return 'E-commerce';
    } else if (titleLower.includes('course') || titleLower.includes('education')) {
      return 'Education & Courses';
    } else if (titleLower.includes('consulting') || titleLower.includes('agency')) {
      return 'Consulting & Services';
    } else {
      return 'Business & Entrepreneurship';
    }
  }

  estimateRevenuePotential(title) {
    const titleLower = title.toLowerCase();
    
    // High potential keywords
    if (titleLower.includes('saas') || titleLower.includes('platform') || titleLower.includes('ai')) {
      return 5000;
    } else if (titleLower.includes('automation') || titleLower.includes('tool')) {
      return 4000;
    } else if (titleLower.includes('marketing') || titleLower.includes('social media')) {
      return 3500;
    } else if (titleLower.includes('course') || titleLower.includes('education')) {
      return 3000;
    } else if (titleLower.includes('consulting') || titleLower.includes('agency')) {
      return 2500;
    } else {
      return 2000;
    }
  }

  identifyTargetMarket(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('startup') || titleLower.includes('entrepreneur')) {
      return 'Startups, Entrepreneurs';
    } else if (titleLower.includes('small business') || titleLower.includes('business')) {
      return 'Small Businesses, Business Owners';
    } else if (titleLower.includes('marketing') || titleLower.includes('social media')) {
      return 'Marketers, Social Media Managers';
    } else if (titleLower.includes('freelance') || titleLower.includes('remote')) {
      return 'Freelancers, Remote Workers';
    } else if (titleLower.includes('student') || titleLower.includes('education')) {
      return 'Students, Educators';
    } else {
      return 'General Business Audience';
    }
  }

  assessComplexity(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('ai') || titleLower.includes('platform') || titleLower.includes('saas')) {
      return 'Complex';
    } else if (titleLower.includes('automation') || titleLower.includes('tool')) {
      return 'Medium';
    } else {
      return 'Simple';
    }
  }

  generateDescription(title) {
    // Generate a description based on the video title
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('saas')) {
      return `SaaS platform based on the concept: ${title}`;
    } else if (titleLower.includes('automation')) {
      return `Automation tool for: ${title}`;
    } else if (titleLower.includes('marketing')) {
      return `Marketing solution for: ${title}`;
    } else if (titleLower.includes('ai')) {
      return `AI-powered solution for: ${title}`;
    } else {
      return `Business solution for: ${title}`;
    }
  }

  extractFeatures(title) {
    const features = [];
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('automation')) features.push('Automation');
    if (titleLower.includes('ai')) features.push('AI Integration');
    if (titleLower.includes('analytics')) features.push('Analytics');
    if (titleLower.includes('marketing')) features.push('Marketing Tools');
    if (titleLower.includes('social')) features.push('Social Media Integration');
    if (titleLower.includes('dashboard')) features.push('Dashboard');
    if (titleLower.includes('reporting')) features.push('Reporting');
    if (titleLower.includes('api')) features.push('API Integration');
    
    // Default features
    if (features.length === 0) {
      features.push('User Management', 'Analytics', 'Customization');
    }
    
    return features;
  }

  groupSimilarIdeas(ideas) {
    const grouped = {};
    
    ideas.forEach(idea => {
      const category = idea.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(idea);
    });
    
    return grouped;
  }

  async generateProjectTemplates(projectIdeas) {
    console.log('🔧 Generating project templates...');
    
    const templates = [];
    
    for (const [category, ideas] of Object.entries(projectIdeas)) {
      // Take the top 3 ideas from each category
      const topIdeas = ideas.slice(0, 3);
      
      for (const idea of topIdeas) {
        const template = {
          id: this.generateTemplateId(idea.title),
          name: this.generateTemplateName(idea.title),
          description: idea.description,
          revenuePotential: idea.revenuePotential,
          targetMarket: idea.targetMarket,
          complexity: idea.complexity,
          estimatedTime: this.estimateTime(idea.complexity),
          category: category,
          features: idea.features,
          n8nWorkflowTemplate: this.generateWorkflowTemplate(idea),
          nextJsComponent: this.generateComponentName(idea.title),
          apiRoute: this.generateApiRoute(idea.title),
          sourceVideo: idea.url,
          sourceChannel: this.channelData.name
        };
        
        templates.push(template);
      }
    }
    
    return templates;
  }

  generateTemplateId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  }

  generateTemplateName(title) {
    // Clean up the title and make it more professional
    return title
      .replace(/how to/i, '')
      .replace(/make money/i, 'Revenue Generator')
      .replace(/passive income/i, 'Automated Income')
      .trim();
  }

  estimateTime(complexity) {
    switch (complexity) {
      case 'Simple': return '15 minutes';
      case 'Medium': return '25 minutes';
      case 'Complex': return '35 minutes';
      default: return '20 minutes';
    }
  }

  generateWorkflowTemplate(idea) {
    const baseName = this.generateTemplateId(idea.title);
    return `${baseName}-webhook`;
  }

  generateComponentName(title) {
    const words = title.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    );
    return words.join('').replace(/[^a-zA-Z0-9]/g, '') + 'Component';
  }

  generateApiRoute(title) {
    const baseName = this.generateTemplateId(title);
    return `/api/n8n-${baseName}`;
  }

  async saveResults(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `youtube-project-ideas-${timestamp}.json`;
    
    const outputDir = 'youtube-analysis-results';
    await fs.mkdir(outputDir, { recursive: true });
    
    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, JSON.stringify(results, null, 2));
    
    console.log(`💾 Results saved to: ${filepath}`);
    return filepath;
  }

  async generateProjectTemplatesFile(templates) {
    const templatesFile = 'generated-youtube-templates.json';
    await fs.writeFile(templatesFile, JSON.stringify(templates, null, 2));
    
    console.log(`📋 Project templates saved to: ${templatesFile}`);
    return templatesFile;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

// Main execution function
async function main() {
  const scraper = new YouTubeProjectIdeasScraper();
  
  try {
    await scraper.initialize();
    
    // Scrape Greg Isenberg's channel
    const channelUrl = 'https://www.youtube.com/@GregIsenberg';
    const results = await scraper.scrapeChannel(channelUrl);
    
    // Save results
    const resultsFile = await scraper.saveResults(results);
    const templatesFile = await scraper.generateProjectTemplatesFile(results.projectTemplates);
    
    // Display summary
    console.log('\n🎉 YouTube Project Ideas Scraper Results:');
    console.log('==========================================');
    console.log(`📺 Channel: ${results.channel.name}`);
    console.log(`👥 Subscribers: ${results.channel.subscribers}`);
    console.log(`📹 Videos Analyzed: ${results.videos.length}`);
    console.log(`💡 Project Ideas Found: ${Object.values(results.projectIdeas).flat().length}`);
    console.log(`🔧 Project Templates Generated: ${results.projectTemplates.length}`);
    
    console.log('\n🚀 Top Project Templates:');
    results.projectTemplates.slice(0, 5).forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} - $${template.revenuePotential.toLocaleString()}`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Target Market: ${template.targetMarket}`);
      console.log(`   Complexity: ${template.complexity}`);
      console.log('');
    });
    
    console.log(`\n📁 Results saved to: ${resultsFile}`);
    console.log(`📋 Templates saved to: ${templatesFile}`);
    
  } catch (error) {
    console.error('❌ Error in main execution:', error);
  } finally {
    await scraper.close();
  }
}

// Run the scraper
if (require.main === module) {
  main();
}

module.exports = YouTubeProjectIdeasScraper;
