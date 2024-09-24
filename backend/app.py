from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    data = {
        "model": "gpt-3.5-turbo",  # Look for available models
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data
        )

        response.raise_for_status()
        bot_message = response.json()['choices'][0]['message']['content']
        return jsonify({"message": bot_message})
    except requests.exceptions.HTTPError as errh:
        print("Http Error:", errh)
        return "Erro no servidor", 500
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:", errc)
        return "Erro no servidor", 500
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        return "Erro no servidor", 500
    except requests.exceptions.RequestException as err:
        print("Ocorreu um erro:", err)
        return "Erro no servidor", 500

if __name__ == '__main__':
    app.run(debug=True)