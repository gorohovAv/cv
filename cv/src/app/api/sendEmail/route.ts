//import type {NextApiRequest, NextApiResponse} from 'next';

export async function POST(request: Request){
    return Response.json({message: "Письмо отправлено"});
}
