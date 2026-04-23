import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    idea = data.get("idea", "")

    if not idea:
        return jsonify({"error": "Please enter a business idea"}), 400

    prompt = f"""You are an expert business consultant. 
A user has submitted this business idea: "{idea}"

Give a detailed breakdown using these exact headings:

## Business Overview
## Problem It Solves
## Target Market
## Revenue Model
## Steps To Launch
## Estimated Startup Cost
## Biggest Challenges
## Why It Could Succeed

Be specific and practical."""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openrouter/free",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        result = response.json()
        print("API RESPONSE:", result)
        text = result["choices"][0]["message"]["content"]
        return jsonify({"result": text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)