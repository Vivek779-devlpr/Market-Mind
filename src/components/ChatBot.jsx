// ChatBot.jsx — Floating AI Assistant for analysis insights
import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const INITIAL_MESSAGE = {
  id: 'welcome',
  type: 'bot',
  content: "👋 Hi! I'm your friendly Sales Analysis Assistant. I can help you understand your sales data in simple terms and give you easy tips to grow your business.\n\nTo get started, upload a CSV file with your sales data and click 'Analyze'. Then I can answer questions like:\n• How can I make more money?\n• Which products are selling best?\n• How do I grow my business?\n• What should I watch out for?\n\nWhat would you like to know about the analysis process?",
  timestamp: new Date(),
};

function ChatMessage({ message }) {
  return (
    <div className={`chat-message ${message.type}`}>
      <div className="message-content">
        {message.content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="message-time">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}

function ChatModal({ isOpen, onClose, analysisData, config }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage, conversationHistory = []) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const lowerMessage = userMessage.toLowerCase();
    const hasAnalysisData = analysisData && analysisData.stats && Array.isArray(analysisData.stats) && analysisData.stats.length > 0;

    // Extract metrics with better error handling
    let revenue = '$0';
    let topProduct = 'N/A';
    let growth = '0%';
    let risk = 'Low';

    if (hasAnalysisData) {
      try {
        revenue = analysisData.stats.find(s => s.label?.toLowerCase().includes('revenue'))?.value || '$0';
        topProduct = analysisData.stats.find(s => s.label?.toLowerCase().includes('product'))?.value || 'N/A';
        growth = analysisData.stats.find(s => s.label?.toLowerCase().includes('growth'))?.value || '0%';
        risk = analysisData.stats.find(s => s.label?.toLowerCase().includes('risk'))?.value || 'Low';
      } catch (e) {
        console.error('Error extracting metrics:', e);
      }
    }

    let response = '';

    // If no analysis data
    if (!hasAnalysisData) {
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = `Hi! 👋 I'm your sales helper. You haven't run an analysis yet. Please upload a CSV file, configure settings, and click "Analyze" to get started!`;
      } else {
        response = `To get specific insights, I need you to upload a sales CSV file and click "Analyze" first. Once you do that, I can answer any question about your business!`;
      }
      return response;
    }

    // Money/Revenue questions
    if (lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('money')) {
      if (lowerMessage.includes('increase') || lowerMessage.includes('grow')) {
        response = `Great! To make more from your ${revenue} in sales:\n\n• **Tell existing customers about related products** - They already like you!\n• **Give loyal customers special deals** - Reward repeat buyers\n• **Bundle products together** - Save them money by buying multiple items\n• **Create loyalty programs** - Make customers want to come back\n\nThese simple ideas can increase your sales by 15-25% in 3-6 months! Which sounds doable for you?`;
      } else if (lowerMessage.includes('why') || lowerMessage.includes('low')) {
        response = `Your ${revenue} sales can be affected by:\n\n**You can control:**\n• Are customers happy? Do they come back?\n• Are enough people knowing about you?\n• Are your prices fair?\n• Is your product quality good?\n\n**You can't control:**\n• Market trends in your ${config?.industry || 'industry'}\n• What competitors are doing\n• Economic conditions\n\nLet's focus on what you CAN improve. Want to explore any of these areas?`;
      } else {
        response = `Your total sales are ${revenue} from ${config?.totalRows || 'your'} customer purchases. Every time someone buys from you, it adds to this number.\n\nWant to know:\n• How to make this number bigger?\n• Why it might be lower?\n• Which products make the most money?`;
      }
    }

    // Growth questions
    else if (lowerMessage.includes('growth') || lowerMessage.includes('opportunity') || lowerMessage.includes('expand')) {
      if (lowerMessage.includes('how')) {
        response = `Your ${growth} growth potential means you can get bigger! Here's a simple plan:\n\n**Months 1-3:** Focus on what works - improve your marketing, turn visitors into buyers\n**Months 3-6:** Find new customers, add new products, build your brand\n**Months 6+:** Go to new areas, partner with other businesses, use technology\n\nStart small, then scale up. Which timeframe interests you most?`;
      } else {
        response = `You have ${growth} potential! This comes from:\n• New customers who don't know you yet\n• New products customers want to buy\n• Making your business run better\n• Reaching different groups of people\n\nWhat's your first growth step going to be?`;
      }
    }

    // Product questions
    else if (lowerMessage.includes('product') || lowerMessage.includes('best') || lowerMessage.includes('top') || lowerMessage.includes('sell')) {
      if (lowerMessage.includes('why')) {
        response = `"${topProduct}" is popular because:\n\n• **It solves a real problem** - Customers actually need it\n• **It's different** - Something special competitors don't have\n• **People know about it** - Your marketing worked\n• **Customers trust it** - Good quality, reliable\n\nLeverage this! Make similar products, use it to attract new customers. What makes it so good in YOUR opinion?`;
      } else {
        response = `Your star product is "${topProduct}" - more customers choose this than anything else!\n\nUse this advantage by:\n• **Stock enough** - Don't run out\n• **Show it first** - Use it to attract customers\n• **Make more like it** - Understand what makes it special\n• **Learn from it** - Apply success factors to other products\n\nHow can you capitalize on this success?`;
      }
    }

    // Risk/Problem questions
    else if (lowerMessage.includes('risk') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('challenge')) {
      if (lowerMessage.includes('solve') || lowerMessage.includes('fix')) {
        response = `Your ${risk} risk means:\n\n**Protect yourself:**\n• Get customers from different sources\n• Keep emergency money saved\n• Build good supplier relationships\n\n**Monitor closely:**\n• Watch sales trends\n• Check competitor moves\n• Listen to customer feedback\n\n**Plan for surprises:**\n• Have backup sales methods\n• Be flexible with pricing\n• Know your cost-cutting options\n\nWhich protection step is most important for you?`;
      } else {
        response = `Your ${risk} risk level means ${risk.toLowerCase() === 'low' ? 'you\'re pretty safe' : risk.toLowerCase() === 'medium' ? 'pay attention but stay calm' : 'take action now'}!\n\nWatch out for:\n• Competition taking customers\n• Customers not coming back\n• Cash flow problems\n• Market changes\n• Supply issues\n\nWhat's your biggest concern right now?`;
      }
    }

    // Strategy/Plan questions
    else if (lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('next step')) {
      response = `Here's your roadmap:\n\n**Week 1-4:** Understand your customers, improve your best products, track numbers\n**Month 2-3:** Find new customers, make loyalty programs, build your brand\n**Month 4-6:** Use automation tools, add products, try new places\n**Month 6+:** Keep improving, measure results, team up with others\n\nClimb one step at a time. What's your first step?`;
    }

    // Customer questions
    else if (lowerMessage.includes('customer') || lowerMessage.includes('client') || lowerMessage.includes('people') || lowerMessage.includes('buyer')) {
      if (lowerMessage.includes('keep') || lowerMessage.includes('loyalty') || lowerMessage.includes('retain')) {
        response = `Keeping customers is cheaper than finding new ones (5-7x cheaper!)!\n\n**Make them feel special:**\n• Listen to what they say\n• Thank them after they buy\n• Give points/discounts for repeat purchases\n\n**Build relationships:**\n• Create VIP programs for best customers\n• Share helpful information\n• Be there when they need you\n\n**Create loyalty:**\n• Remember past purchases\n• Make buying easy\n• Show them they matter\n\nWhich customer-keeping idea works best for you?`;
      } else {
        response = `You have ${config?.totalRows || 'strong customer'}} customer activity - that's your foundation!\n\nUnderstand them by:\n• **Knowing who they are** - Group by type and spending\n• **Making it personal** - Send offers they actually want\n• **Easy buying** - Remove obstacles\n• **Guide them** - Help them choose\n\nWhat do your BEST customers have in common?`;
      }
    }

    // Default intelligent responses based on question type
    else {
      const isAboutMoney = lowerMessage.includes('profit') || lowerMessage.includes('earn') || lowerMessage.includes('cost') || lowerMessage.includes('price');
      const isAboutFuture = lowerMessage.includes('future') || lowerMessage.includes('next') || lowerMessage.includes('achieve');
      const isAboutData = lowerMessage.includes('data') || lowerMessage.includes('number') || lowerMessage.includes('chart') || lowerMessage.includes('graph');

      if (isAboutMoney) {
        response = `💰 Money questions! Your revenue is ${revenue}.\n\n**To think about:**\n• Revenue trends - going up or down?\n• Profit after costs\n• Per-customer spending\n• Where to save money\n\nWhich financial aspect would help you most?`;
      } else if (isAboutFuture) {
        response = `🚀 Planning for growth with ${growth} potential!\n\nYour opportunities:\n• Get new customers\n• Add new products\n• Improve operations\n• Reach new areas\n\nWhat's most exciting to you?`;
      } else if (isAboutData) {
        response = `📊 Data power! You have ${config?.totalRows || 'valuable'}} data points.\n\nI can help with:\n• Key metrics to track\n• Trending data\n• Patterns in behavior\n• What numbers mean\n\nWhat data confuses you?`;
      } else {
        const responses = [
          `Your ${revenue} revenue, ${growth} growth, and "${topProduct}" top product show you've built something real! 🎯\n\nWhat's your main focus?\n• More sales?\n• Customer loyalty?\n• Cost control?\n• New products?`,

          `Looking good! ${config?.totalRows || 'Strong'}} customers, ${revenue} revenue, ${growth} growth potential. 📈\n\nWhat needs improvement?\n• Sales growth?\n• Efficiency?\n• Customer happiness?\n• Risk management?`,

          `Your business has foundations we can build on! ${revenue} sales, ${topProduct} leading product. 💡\n\nWhat's your next win?\n• Increase revenue?\n• Grow faster?\n• Keep customers?\n• Reduce risks?`,

          `You're asking great questions! 🔍 ${revenue} revenue, ${growth} potential, "${topProduct}" star product.\n\nWhere to focus?\n• Sales tactics?\n• Customer strategy?\n• Market opportunities?\n• Business planning?`,

          `Smart thinking! ${config?.totalRows || 'Solid'}} data, ${revenue} revenue, {{growth}} potential. 🎪\n\nWhat matters most?\n• Revenue growth?\n• Customer value?\n• Market position?\n• Risk management?`
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const botResponse = await generateResponse(input, currentHistory);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('ChatBot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I hit an error. Try asking something else!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chatbot-modal-header">
          <span className="chatbot-modal-icon">🤖</span>
          <span className="chatbot-modal-title">Sales Assistant</span>
          <button className="chatbot-close" onClick={onClose}>✕</button>
        </div>

        <div className="chatbot-modal-messages">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="chat-message bot typing">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-modal-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your analysis..."
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="send-button"
          >
            {isTyping ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatBot({ analysisData, config }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="chatbot-fab" onClick={() => setIsOpen(true)}>
        <div className="chatbot-fab-icon">💬</div>
        <div className="chatbot-fab-tooltip">Ask AI Assistant</div>
      </div>

      <ChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        analysisData={analysisData}
        config={config}
      />
    </>
  );
}