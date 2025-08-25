const mongoose = require('mongoose');
const AITool = require('../models/AITool');
require('dotenv').config({ path: './config.env' });

const aiToolsData = [
  {
    name: 'GPT-4',
    slug: 'gpt-4',
    description: 'Advanced language model with improved reasoning and creativity',
    version: '4.0',
    provider: 'OpenAI',
    category: 'language-model',
    capabilities: ['text-generation', 'question-answering', 'summarization', 'translation'],
    pricing: {
      input: 0.03,
      output: 0.06,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 94.2,
        responseTime: 1.8,
        reliability: 98.5,
        userSatisfaction: 4.8
      }
    },
    stats: {
      totalQueries: 1250000,
      totalMistakes: 47,
      mistakeRate: 2.1,
      averageResponseTime: 1.8,
      totalCost: 37500,
      activeUsers: 150000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Code Generation', description: 'Advanced code writing and debugging', isAvailable: true },
      { name: 'Creative Writing', description: 'Story, poetry, and creative content generation', isAvailable: true },
      { name: 'Analysis', description: 'Deep analysis of complex topics', isAvailable: true }
    ],
    limitations: [
      'Knowledge cutoff in April 2023',
      'May generate incorrect information',
      'Limited to text-based interactions'
    ],
    website: 'https://openai.com/gpt-4',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions'
  },
  {
    name: 'Claude-3',
    slug: 'claude-3',
    description: 'Anthropic\'s most capable AI model with enhanced reasoning',
    version: '3.0',
    provider: 'Anthropic',
    category: 'language-model',
    capabilities: ['text-generation', 'question-answering', 'summarization'],
    pricing: {
      input: 0.015,
      output: 0.075,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 92.8,
        responseTime: 2.1,
        reliability: 97.2,
        userSatisfaction: 4.6
      }
    },
    stats: {
      totalQueries: 890000,
      totalMistakes: 32,
      mistakeRate: 2.8,
      averageResponseTime: 2.1,
      totalCost: 26700,
      activeUsers: 95000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Constitutional AI', description: 'Built with safety and helpfulness in mind', isAvailable: true },
      { name: 'Long Context', description: 'Handles very long documents and conversations', isAvailable: true },
      { name: 'Reasoning', description: 'Strong logical reasoning capabilities', isAvailable: true }
    ],
    limitations: [
      'Knowledge cutoff in August 2023',
      'May refuse certain requests for safety',
      'Limited multimodal capabilities'
    ],
    website: 'https://claude.ai',
    apiEndpoint: 'https://api.anthropic.com/v1/messages'
  },
  {
    name: 'Gemini Pro',
    slug: 'gemini-pro',
    description: 'Google\'s most advanced AI model with multimodal capabilities',
    version: '1.0',
    provider: 'Google',
    category: 'multimodal',
    capabilities: ['text-generation', 'image-generation', 'question-answering'],
    pricing: {
      input: 0.0025,
      output: 0.01,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 89.5,
        responseTime: 2.5,
        reliability: 95.8,
        userSatisfaction: 4.3
      }
    },
    stats: {
      totalQueries: 650000,
      totalMistakes: 18,
      mistakeRate: 4.2,
      averageResponseTime: 2.5,
      totalCost: 16250,
      activeUsers: 75000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Multimodal', description: 'Understands text, images, and other media', isAvailable: true },
      { name: 'Google Integration', description: 'Seamless integration with Google services', isAvailable: true },
      { name: 'Real-time Information', description: 'Access to current information via search', isAvailable: true }
    ],
    limitations: [
      'May have knowledge gaps',
      'Image generation quality varies',
      'Limited to Google ecosystem'
    ],
    website: 'https://gemini.google.com',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
  },
  {
    name: 'Llama-2',
    slug: 'llama-2',
    description: 'Open source language model with strong performance',
    version: '2.0',
    provider: 'Meta',
    category: 'language-model',
    capabilities: ['text-generation', 'question-answering', 'summarization'],
    pricing: {
      input: 0.001,
      output: 0.002,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 87.3,
        responseTime: 3.2,
        reliability: 93.1,
        userSatisfaction: 4.1
      }
    },
    stats: {
      totalQueries: 320000,
      totalMistakes: 5,
      mistakeRate: 1.6,
      averageResponseTime: 3.2,
      totalCost: 960,
      activeUsers: 45000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Open Source', description: 'Fully open source and customizable', isAvailable: true },
      { name: 'Cost Effective', description: 'Very low cost per token', isAvailable: true },
      { name: 'Local Deployment', description: 'Can be run on local infrastructure', isAvailable: true }
    ],
    limitations: [
      'Lower accuracy compared to commercial models',
      'Slower response times',
      'Requires technical expertise to deploy'
    ],
    website: 'https://ai.meta.com/llama/',
    apiEndpoint: 'https://api.meta.ai/v1/chat/completions'
  },
  {
    name: 'DALL-E 3',
    slug: 'dall-e-3',
    description: 'Advanced image generation model with high quality output',
    version: '3.0',
    provider: 'OpenAI',
    category: 'image-generation',
    capabilities: ['image-generation'],
    pricing: {
      input: 0.04,
      output: 0.04,
      currency: 'USD',
      unit: 'per-image'
    },
    performance: {
      current: {
        accuracy: 91.5,
        responseTime: 8.5,
        reliability: 96.8,
        userSatisfaction: 4.7
      }
    },
    stats: {
      totalQueries: 450000,
      totalMistakes: 12,
      mistakeRate: 2.7,
      averageResponseTime: 8.5,
      totalCost: 18000,
      activeUsers: 68000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'High Resolution', description: 'Generates images up to 1024x1024 pixels', isAvailable: true },
      { name: 'Style Control', description: 'Advanced style and composition control', isAvailable: true },
      { name: 'Safety Filters', description: 'Built-in content safety measures', isAvailable: true }
    ],
    limitations: [
      'Slower than text generation',
      'May struggle with complex compositions',
      'Limited to image generation only'
    ],
    website: 'https://openai.com/dall-e-2',
    apiEndpoint: 'https://api.openai.com/v1/images/generations'
  },
  {
    name: 'LangChain',
    slug: 'langchain',
    description: 'Framework for developing applications powered by language models',
    version: '0.1.0',
    provider: 'LangChain',
    category: 'language-model',
    capabilities: ['text-generation', 'code-generation', 'question-answering'],
    pricing: {
      input: 0.001,
      output: 0.002,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 88.5,
        responseTime: 2.8,
        reliability: 94.2,
        userSatisfaction: 4.2
      }
    },
    stats: {
      totalQueries: 280000,
      totalMistakes: 8,
      mistakeRate: 2.9,
      averageResponseTime: 2.8,
      totalCost: 840,
      activeUsers: 32000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Chain Building', description: 'Create complex workflows with language models', isAvailable: true },
      { name: 'Memory Management', description: 'Maintain context across conversations', isAvailable: true },
      { name: 'Tool Integration', description: 'Connect to external APIs and databases', isAvailable: true }
    ],
    limitations: [
      'Requires programming knowledge',
      'May have performance overhead',
      'Limited to supported model providers'
    ],
    website: 'https://langchain.com',
    apiEndpoint: 'https://api.langchain.com'
  },
  {
    name: 'LlamaIndex',
    slug: 'llama-index',
    description: 'Data framework for LLM applications with advanced retrieval capabilities',
    version: '0.9.0',
    provider: 'LlamaIndex',
    category: 'language-model',
    capabilities: ['text-generation', 'question-answering', 'summarization'],
    pricing: {
      input: 0.0015,
      output: 0.003,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 86.7,
        responseTime: 3.1,
        reliability: 92.8,
        userSatisfaction: 4.0
      }
    },
    stats: {
      totalQueries: 195000,
      totalMistakes: 12,
      mistakeRate: 6.2,
      averageResponseTime: 3.1,
      totalCost: 585,
      activeUsers: 18500
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Data Indexing', description: 'Efficient data retrieval and indexing', isAvailable: true },
      { name: 'Query Engine', description: 'Advanced query processing and optimization', isAvailable: true },
      { name: 'Document Processing', description: 'Handle various document formats', isAvailable: true }
    ],
    limitations: [
      'Complex setup for beginners',
      'Limited to specific data types',
      'May require additional infrastructure'
    ],
    website: 'https://llamaindex.ai',
    apiEndpoint: 'https://api.llamaindex.ai'
  },
  {
    name: 'Grok',
    slug: 'grok',
    description: 'xAI\'s conversational AI model with real-time knowledge access',
    version: '1.0',
    provider: 'xAI',
    category: 'language-model',
    capabilities: ['text-generation', 'question-answering', 'summarization'],
    pricing: {
      input: 0.02,
      output: 0.04,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 91.3,
        responseTime: 1.9,
        reliability: 96.1,
        userSatisfaction: 4.5
      }
    },
    stats: {
      totalQueries: 420000,
      totalMistakes: 15,
      mistakeRate: 3.6,
      averageResponseTime: 1.9,
      totalCost: 12600,
      activeUsers: 52000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Real-time Knowledge', description: 'Access to current information via X platform', isAvailable: true },
      { name: 'Conversational AI', description: 'Natural and engaging conversations', isAvailable: true },
      { name: 'Multimodal Support', description: 'Text and image understanding capabilities', isAvailable: true }
    ],
    limitations: [
      'Limited to X platform users',
      'May have content restrictions',
      'Knowledge cutoff unknown'
    ],
    website: 'https://x.ai/grok',
    apiEndpoint: 'https://api.x.ai/grok'
  },
  {
    name: 'Sarvam AI',
    slug: 'sarvam-ai',
    description: 'Indian AI company focused on Indic language models and applications',
    version: '1.0',
    provider: 'Sarvam AI',
    category: 'language-model',
    capabilities: ['text-generation', 'translation', 'question-answering'],
    pricing: {
      input: 0.008,
      output: 0.016,
      currency: 'USD',
      unit: 'per-1k-tokens'
    },
    performance: {
      current: {
        accuracy: 89.2,
        responseTime: 2.3,
        reliability: 95.3,
        userSatisfaction: 4.3
      }
    },
    stats: {
      totalQueries: 180000,
      totalMistakes: 9,
      mistakeRate: 5.0,
      averageResponseTime: 2.3,
      totalCost: 2160,
      activeUsers: 22000
    },
    status: 'active',
    isPublic: true,
    features: [
      { name: 'Indic Languages', description: 'Specialized support for Indian languages', isAvailable: true },
      { name: 'Local Context', description: 'Understanding of Indian culture and context', isAvailable: true },
      { name: 'Multilingual', description: 'Support for multiple Indian languages', isAvailable: true }
    ],
    limitations: [
      'Limited to Indic languages',
      'May have regional biases',
      'Smaller training dataset compared to global models'
    ],
    website: 'https://sarvam.ai',
    apiEndpoint: 'https://api.sarvam.ai'
  }
];

async function seedAITools() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing AI tools
    await AITool.deleteMany({});
    console.log('🗑️  Cleared existing AI tools');

    // Insert new AI tools
    const tools = await AITool.insertMany(aiToolsData);
    console.log(`✅ Inserted ${tools.length} AI tools`);

    // Display inserted tools
    tools.forEach(tool => {
      console.log(`📊 ${tool.name}: ${tool.stats.totalQueries} queries, ${tool.stats.mistakeRate.toFixed(1)}% mistake rate`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAITools();
