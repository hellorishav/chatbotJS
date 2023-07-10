const http = require('http');

const faqData = [
    { question: 'What are the system requirements for installing Windows 10?', answer: 'The minimum system requirements for Windows 10 are...' },
    { question: 'How do I update my graphics drivers?', answer: 'To update your graphics drivers, you can...' },
    { question: 'What is cloud computing?', answer: 'Cloud computing refers to the on-demand availability...' },
    { question: 'How can I secure my Wi-Fi network?', answer: 'To secure your Wi-Fi network, you should...' },
    { question: 'What is the difference between RAM and ROM?', answer: 'RAM (Random Access Memory) is...' },
  ];  

function calculateSimilarityScore(question1, question2) {
  const words1 = question1.toLowerCase().split(' ');
  const words2 = question2.toLowerCase().split(' ');

  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];

  const similarityScore = intersection.length / union.length;
  return similarityScore;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { message } = JSON.parse(body);

      let bestMatch = { similarity: 0, faq: null };

      for (const faq of faqData) {
        const similarity = calculateSimilarityScore(message, faq.question);
        if (similarity > bestMatch.similarity) {
          bestMatch = { similarity, faq };
        }
      }

      const response = bestMatch.faq ? bestMatch.faq.answer : 'Sorry, I did not understand your question.';
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ response }));
    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
