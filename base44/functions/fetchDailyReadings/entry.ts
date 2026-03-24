import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { readingType, date } = await req.json();
    
    // Use AI to fetch and format daily readings
    const today = date || new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
    });
    
    let prompt = '';
    
    if (readingType === 'aa') {
      prompt = `Fetch the AA (Alcoholics Anonymous) Daily Reflection for ${today}. Return ONLY the reading content in plain text without any HTML tags, links, URLs, or website mentions. Remove all references to aa.org or other websites. Just the meditation text itself.`;
    } else if (readingType === 'na') {
      prompt = `Fetch the NA (Narcotics Anonymous) "Just for Today" daily meditation for ${today}. Return ONLY the meditation content in plain text without any HTML tags, links, URLs, or website mentions. Remove all references to na.org or other websites. Just the meditation text and affirmation.`;
    } else if (readingType === 'hazelden') {
      prompt = `Fetch the complete Hazelden "Twenty Four Hours a Day" reading for ${today}. Return in JSON format with three sections: thought (the Thought for the Day), meditation (the Meditation for the Day), and prayer (the Prayer for the Day). Return ONLY plain text content without HTML tags, links, URLs, or website mentions.`;
    } else if (readingType === 'slaa') {
      prompt = `Fetch the SLAA (Sex and Love Addicts Anonymous) "State of Grace" daily reading for ${today}. Return ONLY the reading content in plain text without any HTML tags, links, URLs, or website mentions. Remove all references to slaa.org or other websites. Just the reading text itself.`;
    }
    
    const config = readingType === 'hazelden' 
      ? {
          prompt: prompt,
          add_context_from_internet: true,
          response_json_schema: {
            type: 'object',
            properties: {
              thought: { type: 'string' },
              meditation: { type: 'string' },
              prayer: { type: 'string' }
            }
          }
        }
      : {
          prompt: prompt,
          add_context_from_internet: true
        };
    
    const reading = await base44.integrations.Core.InvokeLLM(config);
    
    return Response.json({ 
      content: reading,
      date: today,
      type: readingType 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});