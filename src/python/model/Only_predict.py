import torch    #pip install pytorch แล้วต่อด้วย pip install torch
from torchvision import transforms #pip install torchvision
from PIL import Image
from ModelV3 import Pylon  # Assuming your model class is defined in ModelV3.py in the same directory

#pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
import numpy as np
import cv2
from PIL import Image

# Instantiate the model
model = Pylon(n_classes=20)  # Assuming 20 classes for the final classification layer

# Load the model weights
model.load_state_dict(torch.load('modelV3_weights.pth', map_location=torch.device('cpu')))
model.eval()  # Set the model to evaluation mode

# Preprocess the input image
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
])

# Load the image
img_path = '../uploads/TEST.jpg'
image = Image.open(img_path).convert('RGB')
image_tensor = transform(image).unsqueeze(0)  # Add batch dimension

# Perform inference
with torch.no_grad():
    output = model(image_tensor)
    predictions = output.argmax(dim=1).item()
    prediction = torch.argmax(output, 1)    #ใช้สำหรับทำ heatmap
    result = prediction.item() #ใช้สำหรับการ classify แล้วส่งกลับไปหน้า frontend
    print(f'Predicted class: {result}')