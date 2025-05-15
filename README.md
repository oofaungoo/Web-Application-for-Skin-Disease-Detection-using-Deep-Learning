# SkinLemon 🍋
**SkinLemon** is a term project for the Machine Learning course. It is a web application that utilizes a deep learning model named Pylon, which has been optimized to be smaller than the original version for educational purposes.

## 📄 Reference
- Pylon documentation: https://www.cell.com/iscience/pdf/S2589-0042(22)00203-6.pdf

## 📦 Features
- Upload your face image to detect skin-related problems using machine learning.

## 🚀 Technologies Used
🎨 Front-end: JavaScript, HTML, CSS, React.js

🛠️ Back-end / Model Serving: Python with Flask

📊 Model Training: Python

## 🧠 Model Weights
The model weight file can be accessed via the following link (Chulalongkorn University account required):
https://drive.google.com/file/d/10xQVuRPj2zGtMTn84TuP1wi6_-OiwU7f/view?usp=drive_link

## ⚙️ How to Run the Project
1. Clone the Repository
  
   ```git clone https://github.com/oofaungoo/Web-Application-for-Skin-Disease-Detection-using-Deep-Learning```
   
2. Install Dependencies (This part will take you so long)

  Front-end 
  
  ```npm install```

  Machine Learning Model

  ```
  pip install Flask
  cd src/python
  pip install pytorch
  pip install torch
  pip install grad-cam
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
  ```

3. Run the Project

  Frontend

  ```npm start```

  Machine Learning Model (Flask server)

  ```
  cd src/python/model
  python model.py
  ```

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/f74b9267-2734-45f0-aa63-11772e473d5e)

![image](https://github.com/user-attachments/assets/de1773a0-d686-45ff-8f43-960e5e134e71)

![image](https://github.com/user-attachments/assets/067a1f4b-1bb0-499f-a5d7-1ca04f05d325)

![image](https://github.com/user-attachments/assets/90933708-6ecb-46b1-b344-237f1e9c26ba)

![image](https://github.com/user-attachments/assets/70e24eeb-0498-47ae-b80c-5ffe2b9c1e6b)

![image](https://github.com/user-attachments/assets/1a76d7a4-3a34-49ea-944c-e6ea14855064)
