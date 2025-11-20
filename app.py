from flask import Flask, request, jsonify, render_template
import cv2
import base64
import numpy as np

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/process", methods=["POST"])
def process():
    file = request.files["file"]
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Detect face
    faces = detect_face(img)

    # Draw rectangles
    for (x1, y1, x2, y2) in faces:
        cv2.rectangle(img, (x1, y1), (x2, y2), (255,0,0), 2)

    # Generate caption
    pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    caption = generate_caption(pil_img)

    # convert back to base64 to send to frontend
    _, buffer = cv2.imencode(".jpg", img)
    encoded = base64.b64encode(buffer).decode("utf-8")

    return jsonify({"caption": caption, "output": encoded})

if __name__ == "__main__":
    app.run()
