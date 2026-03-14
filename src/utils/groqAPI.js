// groqAPI.js — Local mock analysis for sales data

const INDUSTRY_MAP = {
  retail: 'Retail',
  ecommerce: 'E-Commerce',
  food: 'Food & Beverage',
  tech: 'Technology / SaaS',
  mfg: 'Manufacturing',
};

const PERIOD_MAP = {
  last_week: 'last week',
  last_month: 'last month',
  last_quarter: 'last quarter',
  last_year: 'last year',
};

export async function analyzeSalesData({ csvSample, totalRows, headers, industry, period, companyName }) {
  // Mock analysis without API call
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

  // Mock calculations based on data size
  const mockRevenue = (totalRows * 150).toLocaleString();
  const mockGrowth = Math.floor(Math.random() * 20) + 5;
  const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const topProduct = products[Math.floor(Math.random() * products.length)];

  // Create mock response in the expected format
  const mockResponse = `STATS_JSON:{"metric1_label":"Total Revenue","metric1_value":"$${mockRevenue}","metric2_label":"Top Product","metric2_value":"${topProduct}","metric3_label":"Growth Opportunity","metric3_value":"${mockGrowth}%","metric4_label":"Risk Alert","metric4_value":"Monitor seasonal trends"}

**EXECUTIVE SUMMARY**
${companyName ? `${companyName} shows ` : 'The business shows '}strong performance with ${totalRows.toLocaleString()} transactions analyzed. Revenue trends indicate healthy growth in the ${INDUSTRY_MAP[industry] || industry} sector. Key opportunities exist for optimization and expansion.

**KEY FINDINGS**
- Total dataset contains ${totalRows.toLocaleString()} records across ${headers.length} data points
- Average transaction value suggests ${INDUSTRY_MAP[industry] || industry} market positioning
- Data period of ${PERIOD_MAP[period] || period} shows consistent activity patterns
- ${topProduct} emerges as the top performing product category

**TOP 5 RECOMMENDATIONS**
1. Focus marketing efforts on ${topProduct} - Expected 15-20% revenue increase through targeted campaigns
2. Implement customer segmentation based on purchase patterns - Potential 10% improvement in conversion rates
3. Optimize pricing strategy for high-margin products - Could boost profitability by 8-12%
4. Expand digital presence and online sales channels - Projected 25% increase in market reach
5. Develop loyalty programs for repeat customers - Anticipated 18% improvement in customer retention

**RISK FACTORS**
- Market competition: Monitor competitor pricing and maintain competitive advantage through quality service
- Seasonal fluctuations: Prepare inventory and staffing for peak periods identified in the data
- Economic conditions: Diversify product offerings to mitigate market volatility risks

**QUICK WINS**
- Launch targeted email campaign to existing customers - Immediate 5-10% sales boost this week
- Optimize product placement based on top performers - Quick improvement in conversion rates
- Implement automated follow-up system - Enhance customer satisfaction and repeat business`;

  return parseAIResponse(mockResponse);
}

function parseAIResponse(text) {
  // Extract STATS_JSON
  let stats = null;
  const statsMatch = text.match(/STATS_JSON:(\{[^\n]+\})/);
  if (statsMatch) {
    try {
      const statsObj = JSON.parse(statsMatch[1]);
      // Convert stats object to array format
      stats = [
        { label: statsObj.metric1_label, value: statsObj.metric1_value },
        { label: statsObj.metric2_label, value: statsObj.metric2_value },
        { label: statsObj.metric3_label, value: statsObj.metric3_value },
        { label: statsObj.metric4_label, value: statsObj.metric4_value }
      ].filter(s => s.label && s.value);
    } catch {}
  }

  // Remove stats line from main text
  const cleanText = text.replace(/STATS_JSON:\{[^\n]+\}\n?/, '').trim();

  // Extract recommendations
  const recos = [];
  const recoMatch = cleanText.match(/\*\*TOP 5 RECOMMENDATIONS\*\*[\s\S]*?(?=\n\*\*[A-Z]|$)/i);
  if (recoMatch) {
    const lines = recoMatch[0].split('\n').filter((l) => l.match(/^\d+\./));
    lines.forEach((l) => recos.push(l.replace(/^\d+\.\s*\*?\*?/, '').replace(/\*\*/g, '').trim()));
  }

  // Extract sections
  const sections = {};
  const sectionNames = ['EXECUTIVE SUMMARY', 'KEY FINDINGS', 'RISK FACTORS', 'QUICK WINS'];
  sectionNames.forEach((name) => {
    const regex = new RegExp(`\\*\\*${name}\\*\\*([\\s\\S]*?)(?=\\n\\*\\*[A-Z]|$)`, 'i');
    const match = cleanText.match(regex);
    if (match) {
      sections[name] = match[1].trim();
    }
  });

  return { stats, recos, sections, rawText: cleanText };
}
