from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)

client = OpenAI()

# Store conversation history
conversation_history = []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "Please enter a message."})

    # Add user's message to conversation history
    conversation_history.append({
        "role": "user",
        "content": user_message
    })

    # Send the complete conversation to the AI
    response = client.responses.create(
        model="gpt-6-luna",
        input=conversation_history
    )

    bot_response = response.output_text

    # Add AI response to conversation history
    conversation_history.append({
        "role": "assistant",
        "content": bot_response
    })

    return jsonify({"response": bot_response})



@app.route("/clear-chat", methods=["POST"])
def clear_chat():

    conversation_history.clear()

    return jsonify({"message": "Chat cleared successfully."})


if __name__ == "__main__":
    app.run(debug=True)