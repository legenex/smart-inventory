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
      prompt = `Fetch the AA (Alcoholics Anonymous) Daily Reflection for ${today}. Return the complete daily reflection including the quote, meditation, and reflection text. Format it nicely with HTML.`;
    } else if (readingType === 'na') {
      prompt = `Fetch the NA (Narcotics Anonymous) "Just for Today" daily meditation for ${today}. Return the complete meditation text formatted with HTML.`;
    } else if (readingType === 'hazelden') {
      prompt = `Fetch the Hazelden daily meditation for ${today}. Return the complete meditation including any quotes and reflection. Format with HTML.`;
    } else if (readingType === 'slaa') {
      prompt = `Fetch the SLAA (Sex and Love Addicts Anonymous) "State of Grace" daily reading for ${today}. Return the complete reading formatted with HTML.`;
    }
    
    const reading = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      add_context_from_internet: true
    });
    
    return Response.json({ 
      content: reading,
      date: today,
      type: readingType 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});