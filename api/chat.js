const messages = [];

export default function handler(req, res) {
  // GET: Receber mensagens (SSE)
  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Enviar mensagens existentes
    messages.forEach(msg => {
      res.write(`data: ${JSON.stringify(msg)}\n\n`);
    });

    // Manter conexão aberta
    const timer = setInterval(() => {
      res.write(':ping\n\n');
    }, 30000);

    req.on('close', () => {
      clearInterval(timer);
    });

    return;
  }

  // POST: Enviar mensagem
  if (req.method === 'POST') {
    const { message } = req.body;
    const newMsg = { user: 'Escola', text: message, time: new Date() };
    messages.push(newMsg);
    
    // Broadcast para todos conectados
    // (Em produção, use um sistema de pub/sub como Redis)
    res.status(200).json(newMsg);
    return;
  }

  res.status(405).end();
}
