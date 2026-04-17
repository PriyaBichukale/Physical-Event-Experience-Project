import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEventContext } from '../context/EventContext';

export const useAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { schedule, zones, eventInfo } = useEventContext();

  const SYSTEM_PROMPT = `
    You are an intelligent Assistant for a large-scale Event Management Platform.
    You are currently assisting attendees at the event: "${eventInfo.name}".
    Event Description/Info: "${eventInfo.description}"

    You must be highly interactive, helpful, and aware of the current context.

    Current Event Data:
    - Schedule: ${JSON.stringify(schedule)}
    - Live Traffic Zones: ${JSON.stringify(zones)}

    Provide concise, natural, and helpful answers. If the user asks where an event is, use the schedule data. If they ask what this event is, use the Event Description. If they ask about crowd size or wait times, use the Live Traffic Zones density. 
    If you don't know the answer, politely say you don't have that specific information but try to offer an alternative based on the schedule or routing data.
  `;

  const askAssistant = async (userPrompt) => {
    setLoading(true);
    setError(null);

    const generateLocalResponse = (prompt) => {
      const lowerInput = prompt.toLowerCase();
      
      // Greetings
      if (/^(hi|hello|hey|greetings|good morning)/.test(lowerInput)) {
        return `Hello! Welcome to ${eventInfo.name}. Would you like to know the schedule, check crowd levels, or get directions to a specific event?`;
      }

      // Asking what the event is about
      if (/(about this event|what is this event|event info|what is this|tell me about)/.test(lowerInput)) {
          return `Welcome to **${eventInfo.name}**!\n\n${eventInfo.description}\n\nI can help you navigate the floor plan or check the schedule. What would you like to do?`;
      }

      // Asking for the schedule or what is happening
      if (/(schedule|what.?s here|what is here|what.?s happening|what is happening|events today|list events)/.test(lowerInput)) {
          if (!schedule || schedule.length === 0) return "There are no events scheduled at the moment.";
          const eventList = schedule.slice(0, 3).map(e => `**${e.title}** at ${e.time} (${e.location})`).join('\n- ');
          return `Here is a quick look at what is happening today:\n- ${eventList}\n\nLet me know if you need directions to any of these!`;
      }

      // Specific event matching
      const targetEvent = schedule.find(item => lowerInput.includes(item.title.toLowerCase()) || lowerInput.includes(item.location.toLowerCase()));
      
      if (targetEvent) {
          // If they ask for time, give just time. Otherwise give direction/info.
          if (/(when is|what time|time for|start time)/.test(lowerInput)) {
              return `"${targetEvent.title}" is scheduled for **${targetEvent.time}**.`;
          }
          // Default response for any mention of an event (like "I want to go to [Event]")
          return `Awesome! **${targetEvent.title}** is located at **${targetEvent.location}** and starts at **${targetEvent.time}**.\n\n📍 **Tip:** Open the *Floor Plan* tab to view the live interactive map and see exactly where ${targetEvent.location} is pinned!`;
      }

      // Asking for directions without specifying an event directly
      if (/(direction|how to go|navigate|where do i go|yes show me|take me there|want to go)/.test(lowerInput)) {
          const next = schedule[0];
          if (next) {
              return `Were you looking for our next event? **"${next.title}"** is at **${next.location}**. Otherwise, please tell me the name of the event you want to go to!`;
          }
      }

      // Zone / Crowd logic
      if (/(crowd|wait|busy|full|empty|packed|people)/.test(lowerInput)) {
          const highDensityZones = zones.filter(z => z.density > 70);
          if (highDensityZones.length > 0) {
              const names = highDensityZones.map(z => z.name).join(', ');
              return `Currently, the busiest areas are: **${names}**. I recommend heading to the Main Networking Lounge instead if you want to avoid crowds!`;
          } else {
              return `Everything looks great! Traffic is flowing smoothly and there are no major wait times anywhere in the venue right now.`;
          }
      }

      // Better fallback that prompts them distinctly
      return "I might be misunderstanding. You can ask me things like:\n- 'Show me the schedule'\n- 'I want to go to the Keynote'\n- 'How are the crowds?'";
    };

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Direct offline mode
      const reply = generateLocalResponse(userPrompt);
      setLoading(false);
      return reply;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userPrompt}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setLoading(false);
      return response.text();
    } catch (err) {
      console.warn("Gemini API Error caught, falling back to local engine:", err.message);
      const reply = generateLocalResponse(userPrompt);
      setLoading(false);
      setError(null);
      return reply;
    }
  };

  return { askAssistant, loading, error };
};
