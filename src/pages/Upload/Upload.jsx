import React, { useState } from 'react';
import "./Upload.css";
import { Link } from "react-router-dom"
import axios from 'axios';
import question from '../../images_anim/upload_question.png'
import sparkle from '../../images_anim/icon_sparkl.png'
import upload from '../../images_anim/icon_upload.png'

const Upload = () => {
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setPreviewURL(URL.createObjectURL(selectedImage)); // Create a URL for preview
  };

  // ส่งไปให้ Python
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('picture', image);
  
    // Send the image to the Python backend
    axios.post('http://localhost:8000/upload/', formData)
      .then(response => {
        console.log('Image uploaded:', response.data.image_url);
        // Handle success, such as displaying the uploaded image
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  return (
    <div className='container'> {/* Wrap everything in a container */}
      <div className='holder'>

        
          <Link to="/">
            <div className='fs-18 fw-4' style={{ marginTop: '20px'}}>
              &lt; ย้อนกลับ
            </div>
          </Link>
        
  

        {/* ปุ่มอัปโหลดภาพ */}
        <label htmlFor="file-upload" className='upload-button fs-20 fw-5' style={{ marginTop: '20px', marginBottom: '18px'}} onClick={handleImageUpload}>
          <img src={upload} alt='Q-icon' style={{ marginRight: '10px', width: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
          อัปโหลดภาพใบหน้า
        </label>
  
        {/* ที่แสดงภาพที่เราอัพโหลดลงไป */}
        {previewURL ? (
          <div className='upload-show' style={{
            backgroundImage: `url(${previewURL})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '347px',
            height: '462px',
            marginTop: '10px'
          }}></div>
        ) : (
          <div className='upload-show' style={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '347px',
            height: '462px',
            marginTop: '10px'
          }}></div>
        )}
  
        <div className='fs-18 fw-3 text-grey' style={{marginTop: '20px', marginLeft: '84px'}}>
          <img src={question} alt='Q-icon' style={{ marginRight: '5px', backgroundSize: 'contain', width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
          ตรวจสอบให้แน่ใจว่า
        </div>
        <div className='fs-18 fw-3 text-grey' style={{marginLeft: '64px'}}>
          ไม่มีสิ่งกีดขวางใบหน้าของคุณ
        </div>
  
        {/* ปุ่มวิเคราะห์ผิว ถ้ายังไม่มีภาพ จะเป็นปุ่ม disable แบบกดไม่ได้ */}   
        {previewURL ? (
          <Link to="/wait" className='home-button fs-20 fw-5' style={{ marginTop: '10px', marginLeft: '56px' }}>
            เริ่มวิเคราะห์เลย
            <img src={sparkle} alt='Q-icon' style={{ marginLeft: '10px', backgroundSize: 'contain', width: '32px', display: 'inline-block', verticalAlign: 'middle' }} />
          </Link>
        ) : (
          <div className='upload-disable-button fs-20 fw-5 disabled-link' style={{ marginTop: '10px' }}>
            กรุณาอัปโหลดภาพก่อน
          </div>
        )}
        
        <input id="file-upload" type="file" onChange={handleImageChange} style={{ display: 'none' }} />
          
      </div>
    </div> 
  );
  
  
  
};

export default Upload;
