from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/get-go-message")
def get_go_message():
    response = requests.get("http://localhost:8080/message")  # Fetch message from Go server
    return {"message": response.text}
