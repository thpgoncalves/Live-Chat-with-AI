const chatForm = document.getElementById('chat-form');
const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message === '') return;

  // Adiciona a mensagem do usuário ao chat
  addMessageToChat('user', message);
  messageInput.value = '';

  // Envia a mensagem ao servidor
  try {
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Adiciona a resposta do bot ao chat
    addMessageToChat('bot', data.message);
  } catch (error) {
    console.error('Erro:', error);
    addMessageToChat('bot', 'Desculpe, ocorreu um erro.');
  }
});

function addMessageToChat(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);

  // Ícone
  const iconElement = document.createElement('img');
  iconElement.classList.add('icon');

  if (sender === 'user') {
    iconElement.src = 'images/user.svg';
    iconElement.alt = 'Usuário';
  } else if (sender === 'bot') {
    iconElement.src = 'images/bot.svg';
    iconElement.alt = 'Bot';
  }

  // Conteúdo da Mensagem
  const contentElement = document.createElement('div');
  contentElement.classList.add('message-content');
  contentElement.textContent = message;

  // Monta a mensagem
  if (sender === 'user') {
    messageElement.appendChild(contentElement);
    messageElement.appendChild(iconElement);
  } else {
    messageElement.appendChild(iconElement);
    messageElement.appendChild(contentElement);
  }

  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
