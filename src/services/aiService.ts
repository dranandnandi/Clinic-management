import { GoogleGenerativeAI } from '@google/generative-ai';

interface ReviewParams {
  clinicName: string;
  doctorName: string;
  treatment: string;
  date: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateAIReview(params: ReviewParams): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Role: You are a Google review generator.

Task: Create a humanized, positive, and engaging review in 60 words or fewer that feels genuine and natural.

Input Parameters:
- Doctor Name: ${params.doctorName}
- Clinic Name: ${params.clinicName}
- Date of Visit: ${params.date}
- Treatment/Service: ${params.treatment}

Instructions:
- Generate a customized, continuous review using the provided inputs
- Make it concise yet engaging
- Emphasize patient experience and satisfaction
- Ensure it sounds authentic and personal
- Keep it purely positive
- Include a natural recommendation`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating review:', error);
    throw new Error('Failed to generate review. Please try again later.');
  }
}