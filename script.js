const form = document.getElementById('messageForm');
const output = document.getElementById('output');
const generatedMessage = document.getElementById('generatedMessage');
const key1 = 'sk-proj';
const key2 = '-QBJCBaa63iko8WeDdyyno6o8E1_Ya7eUbCf-L';
const key3 = 'sie4qSvJ1fkPYJNMs_QbuT_YZCRaxRomw5dKNT3BlbkFJgay8HcprhZ4Ugm-I9wN3d2wiGtnWQEmepFKBrGmWc8p0QvBfIvCHCrACOurGAbrc3cLt2IoiEA';
const OPENAI_API_KEY = key1 + key2 + key3;

const whatsappButton = document.getElementById('whatsappButton');
const YOUR_WHATSAPP_NUMBER = '+27820983258'; // Replace with your WhatsApp number

// Hard-coded message
const HARDCODED_MESSAGE = 'Oi, filho!';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const person = document.getElementById('person').value;
  const feeling = document.getElementById('feeling').value;

// Validate the "person" selection
  if (!person) {
    alert('Por favor, selecione uma pessoa.'); // Show an error message
    return; // Stop further execution
  }

 // Show loading state
  generatedMessage.textContent = 'Gerando mensagem...';
  output.classList.remove('hidden');
  whatsappButton.style.display = 'none'; // Hide the button until the message is generated
  newMessageButton.style.display = 'none'; // Hide the "Gerar nova" button initially

  try {
    const message = await generateMessage(person, feeling);
    generatedMessage.textContent = message;

    // Show the WhatsApp button
    whatsappButton.style.display = 'inline-block';
    newMessageButton.style.display = 'inline-block';

    // Set up the WhatsApp link with the hard-coded message
    const whatsappLink = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodeURIComponent(HARDCODED_MESSAGE)}`;
    whatsappButton.onclick = () => {
      window.open(whatsappLink, '_blank'); // Open WhatsApp in a new tab
    };
  } catch (error) {
    // Enhanced error handling
    let errorMessage = 'Erro ao gerar a mensagem. Tente novamente.';

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      errorMessage = 'Erro de conexão. Verifique sua conexão com a internet e tente novamente.';
    } else if (error.response && error.response.status === 401) {
      errorMessage = 'Erro de autenticação. Comunique o desenvolvedor.';
    } else if (error.response && error.response.status === 429) {
      errorMessage = 'Limite de requisições excedido. Tente novamente mais tarde.';
    } else if (error.response && error.response.status >= 500) {
      errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }

    generatedMessage.textContent = errorMessage;
    console.error('Detalhes do erro:', error);
  }
});


// Add functionality for the "Gerar nova" button
newMessageButton.addEventListener('click', () => {
  // Clear the generated message
  generatedMessage.textContent = '';

  // Hide the output section
  output.classList.add('hidden');

  // Reset the form
  form.reset();
});


async function generateMessage(person, feeling) {
  // Get the current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

   const formattedTime = currentDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Context and prompt
  const context = `
    Contexto: Sou um homem de quase 40 anos, vivo na Cidade do Cabo, África do Sul, e sou brasileiro de Porto Alegre, RS. Tenho forte desejo de manter laços emocionais com meus pais idosos.
- Mãe (Clair, nasceu 28-dezembro-1946): Gosta de café, de animais (cachorro e elefante sao os favoritos), de paisagens verdes, e arte (fez pinturas, se interessa pela historia da arte). Faz uma torta de bolacha deliciosa. é brincalhona, sometimes makes fun (endearingly) of my greying hair. toma remedios (as vezes pode ser descuidada com saude e remedios).
- Pai (Antonio, nasceu 27-agosto-1943): Gosta de chimarrão (ele nao prepara, mas gosta de tomar), segue notícias, assava um currasco especial. é gremista (embora atualmente nao assista tanto futebol) e mantém diabetes sob controle. Inteligente e bem articulado. 
- Uso "tu" para abordagem direta (ao inves de voce) e "a gente" para "nós", para o sujeito das frases. Priorizar PT-BR coloquial do RS. 
Se dirigir à pessoa com a relação familiar (Clair: mãe, mãezinha , madrezita, etc [+/- querida/amada]; Antonio: pai, pai querido, meu pai, etc). Usar "mãe" e "pai" quando falar sobre eles.
- O meu fuso horario e' UTC+2.
- Eu sinto falta deles. Eles precisam de conforto emocional.

Instruções de estilo: 
[Use tom informal, amoroso. Adapt the tone based on the feeling provided by the user: lighthearted and humorous for minor worries, empathetic and supportive for serious concerns.
Contextually relevant expressions: [

"beijo no coração", "beijo grande", "Oi", saudade,
Encouragement and pride:

"Orgulho"
"Parabéns"
"Estamos felizes por ti"
"Fico tranquilo"

Expressions of care:

"Se cuida"
"Fica bem"
"Melhoras"

Colloquial regional terms (RS colloquial, PT-BR):

"Tri" (=bastante, muito)
"faceiro" (=feliz, contente)
"baita"

Topics of shared interest:

"Cachorros"
"Natureza"
"Fotos"
"Viagem"
]
Hoje é ${formattedDate}, e agora são ${formattedTime}. Considere se a data e hora são relevantes para o contexto (datas comemorativas, saudacoes, etc). O meu fuso horario e' UTC+2.
Importante: maximo 120 tokens
  `;

  const prompt = `Prompt: ${person} escreveu que está se sentindo "${feeling}" e gostaria de ouvir de mim. Crie uma mensagem personalizada em PT-BR que reflita cuidado com o sentimento expressado.  Incentive o destinatário a entrar em contato se sentir vontade. Use um humor apropriado ao sentimento deles. 
Não invente personagens ou fatos. Esta mensagem será enviada através de um app. Apresente apenas a mensagem, use emojis.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: prompt },
      ],
      max_tokens: 125,
      temperature: 0.75,
      top_p: 0.9,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim(); // Correctly extract the message
}