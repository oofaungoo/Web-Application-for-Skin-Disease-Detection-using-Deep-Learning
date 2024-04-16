import torch    #pip install pytorch แล้วต่อด้วย pip install torch
from torchvision import transforms #pip install torchvision
from PIL import Image
from model.ModelV3 import Pylon 

#สำหรับทำ heatmap
#pip install grad-cam
#pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
import numpy as np
import cv2
from PIL import Image

#'uploads/TEST.jpg'
def predict_heatmap(img_path):

    # Instantiate the model
    model = Pylon(n_classes=19) 

    # Load the model weights
    model.load_state_dict(torch.load('model/modelV3_weights.pth', map_location=torch.device('cpu')))
    model.eval()  # Set the model to evaluation mode

    # Preprocess the input image
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])

    # Load the image
    image = Image.open(img_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0)  # Add batch dimension

    # Perform inference
    with torch.no_grad():
        output = model(image_tensor)
        predictions = output.argmax(dim=1).item()       #ใช้สำหรับทำ heatmap
        prediction = torch.argmax(output, 1)    
        result = prediction.item()+1 #ใช้สำหรับการ classify แล้วส่งกลับไปหน้า frontend
        print(f'Predicted class: {result}')

    # Initialize GradCAM
    target_layer = model.encoder4[-1]
    model.eval().cuda()
    cam = GradCAM(model=model, target_layers=[target_layer])

    from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
    targets = [ClassifierOutputTarget(predictions)]
    grayscale_cam = cam(input_tensor=image_tensor, targets=targets)

    # In this example grayscale_cam has only one image in the batch
    grayscale_cam = grayscale_cam[0, :]

    # Use the utility function to overlay the heatmap on the image
    rgb_img = np.float32(image) / 255
    heatmap_resized = cv2.resize(grayscale_cam, (rgb_img.shape[1], rgb_img.shape[0]))
    heatmap = show_cam_on_image(rgb_img, heatmap_resized, use_rgb=True)

    # Save the heatmap image as heatmap.jpg in src/python/uploads folder
    heatmap_image = Image.fromarray((heatmap * 255).astype(np.uint8))  # Convert to uint8 before saving
    heatmap_image.save('uploads/heatmap.jpg')

    return result