from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
import numpy as np
import cv2
from PIL import Image

# Initialize GradCAM
target_layer = model.encoder4[-1]
model.eval().cuda()
cam = GradCAM(model=model, target_layers=[target_layer])

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
heatmap_image.save('src/python/uploads/heatmap.jpg')
