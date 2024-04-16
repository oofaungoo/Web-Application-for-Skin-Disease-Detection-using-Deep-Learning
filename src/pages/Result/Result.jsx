import React, { useState, useEffect} from "react";
import axios from "axios";
import "./Result.css";
import { Link } from "react-router-dom";
import lemon from '../../images_anim/icon_lemon.png'
import sparkle from '../../images_anim/icon_sparkl.png'
import TEST from '../../python/uploads/TEST.jpg'
import lemonLoad from '../../images_anim/upload_bg.png'
import HEATMAP from '../../python/uploads/heatmap.jpg'

const Result = () => {
  // Diseases data array
    const diseasesData = [
    { name: "สิว (Acne)", careInstructions: "ทำความสะอาดผิวของคุณเป็นประจำ และใช้ผลิตภัณฑ์ที่มีกรดซาลิไซลิก (Salicylic Acid) หรือเบนโซอิลเปอร์ออกไซด์ (Benzoyl Peroxide)" },
    { name: "ผื่นแอคตินิค เคราโตซิล (Actinic Carcinoma)", careInstructions: "หลีกเลี่ยงการโดนแสงแดดโดยตรง หมั่นทาครีมกันแดดเพื่อปกป้องผิวของคุณจากรังสียูวี และปฏิบัติตามการรักษาที่แพทย์ของคุณกำหนด ซึ่งอาจต้องใช้ยาในกลุ่มยาเคมีบำบัดสูตร 5FU (Fluorouracil) หรือเจลไดโคลฟีแนค (Diclofenac) หรือครีมอิมิควิโมด (Imiquimod) ขึ้นกับความรุนแรง" },
    { name: "โรคผื่นภูมิแพ้ผิวหนัง (Atopic Dermatitis)", careInstructions: "ใช้มอยเจอร์ไรเซอร์เป็นประจำ และหลีกเลี่ยงสิ่งกระตุ้น เช่น ผ้าหรือสบู่บางชนิด" },
    { name: "ภาวะเซลล์เนื้อเยื่ออักเสบ (Cellulitis) ", careInstructions: "ทานยาปฏิชีวนะตามที่แพทย์สั่ง และรักษาบริเวณที่ได้รับผลกระทบให้สะอาด" },
    { name: "โรคผื่นภูมิแพ้ผิวหนังชนิดเอคซิม่า (Eczema)", careInstructions: "ดูแลผิวให้ชุ่มชื้น และหลีกเลี่ยงสิ่งกระตุ้น เช่น ผ้าบางชนิดหรือสบู่ที่มีความเป็นกรดสูง" },
    { name: "ผื่นผิวหนังจากการแพ้ยา หรือผื่นแพ้ยา (Drug Eruptions)", careInstructions: "หยุดยาที่คาดว่าอาจเป็นตัวที่ก่อให้เกิดการแพ้ และรีบปรึกษาแพทย์เพื่อรับการรักษา" },
    { name: "โรคเริมจากไวรัส HPV (Herpes HPV)", careInstructions: "รับประทานยาต้านไวรัสตามที่แพทย์สั่ง" },
    { name: "โรคทางผิวหนัง ที่เกิดจากแสงแดด (Light Diseases)", careInstructions: "หลีกเลี่ยงการโดนแสงแดดโดยตรง และหมั่นทาครีมกันแดดเพื่อปกป้องผิวของคุณจากรังสียูวี" },
    { name: "โรคลูปัส (Lupus) หรือภูมิแพ้ตัวเอง (SLE) ", careInstructions: "ปฏิบัติตามการรักษาที่แพทย์ของคุณกำหนด ซึ่งอาจรวมถึงคอร์ติโคสเตียรอยด์หรือยากดภูมิคุ้มกัน" },
    { name: "มะเร็งผิวหนังเมลาโนมา (Melanoma)", careInstructions: "รับการตรวจผิวหนังเป็นประจำ และหมั่นทาครีมกันแดดเพื่อปกป้องผิวของคุณจากรังสียูวี" },
    { name: "อาการผื่นแพ้ต้นพอยซันไอวี่ (Poison Ivy)", careInstructions: "ล้างบริเวณที่ได้รับผลกระทบให้สะอาดแล้วทาโลชั่นคาลาไมน์หรือครีมคอร์ติโคสเตียรอยด์" },
    { name: "โรคสะเก็ดเงิน (Psoriasis)", careInstructions: "ดูแลผิวให้ชุ่มชื้น และปฏิบัติตามการรักษาที่แพทย์กำหนด ซึ่งอาจมีการใช้ยากลุ่มสเตียรอยด์ (Steroid) หรือยารักษาเฉพาะของโรค" },
    { name: "เนื้องอกธรรมดา หรือเนื้องอกที่ไม่ร้ายแรง (Benign Tumors) ", careInstructions: "ปรึกษาแพทย์ทันที และติดตามการเปลี่ยนแปลง" },
    { name: "โรคทางระบบ (Systemic Disease) ", careInstructions: "ปฏิบัติตามการรักษาที่แพทย์สั่งสำหรับโรคต้นเหตุที่ตรวจพบ" },
    { name: "โรคกลาก หรือโรคติดเชื้อราบนผิวหนัง (Ringworm)", careInstructions: "ทาครีมต้านเชื้อรา (Antifungal cream) ตามที่แพทย์สั่ง" },
    { name: "โรคลมพิษ หรือผื่นลมพิษ (Urticarial Hives)", careInstructions: "สังเกตอาการ และหลีกเลี่ยงสิ่งที่อาจเป็นตัวกระตุ้น และใช้ยาแก้แพ้ตามที่แพทย์สั่ง" },
    { name: "โรคเนื้องอกในหลอดเลือด (Vascular Tumors)", careInstructions: "การรักษาอาจแตกต่างกันไปขึ้นอยู่กับชนิดและตำแหน่งของเนื้องอก" },
    { name: "โรคหลอดเลือดอักเสบ (Vasculitis) ", careInstructions: "ปฏิบัติตามการรักษาที่แพทย์สั่ง ซึ่งอาจต้องใช้ยากลุ่มยาแก้อักเสบ (Corticosteroids) หรือยากดภูมิคุ้มกัน" },
    { name: "ผิวหนังติดเชื้อไวรัส (Viral Infections)", careInstructions: "รับประทานยาต้านไวรัสตามที่แพทย์สั่ง" },
    { name: " ", careInstructions: " "}
  ];

  const [showData, setShowData] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(diseasesData[19]);
  const [model_result, setResult] = useState(null);
  const [finishHeat, setFinishHeat] = useState(false);

    // useEffect to call the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make an API call here to fetch the model result
                const response = await axios.get('http://localhost:5000/result/');
                // Assuming the API response has the model result in the data field
                setResult(response.data.result);
                // Update selectedDisease based on model_result
                setSelectedDisease(diseasesData[response.data.result - 1]);
                // Set showData to true to display the fetched data
                setShowData(true);
                setFinishHeat(true);
            } catch (error) {
                // Handle error if API call fails
                console.error('Error fetching model result:', error);
            }
        };
    
        fetchData(); // Call the async function to fetch data
    }, []); // Empty dependency array ensures that this effect runs only once after initial render
    

  return (
    <div className='container'>
            <div className='holder'>

                <div className='fs-26 fw-5' style={{marginTop: '64px', marginBottom: '18px', marginLeft: '18px'}}>
                    รายงานสภาพผิวของคุณ
                    <img src={sparkle} style={{ marginLeft: '10px', backgroundSize: 'contain', width: '32px', display: 'inline-block', verticalAlign: 'middle' }} />
                </div>

                {/* เอา output จาก Pyton มาโชว์หน้านี้ */}

                <div className='upload-show' style={{
                    backgroundImage: `url(${finishHeat ? HEATMAP : lemonLoad})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '347px',
                    height: '462px',
                    marginBottom: '30px'
                }}></div>

{selectedDisease && (
    <>
        <div className={"disease-info-container"}>
            <div className='fs-24 fw-5' style={{marginTop: '20px'}}>
                <img src={lemon} alt='Q-icon' style={{ marginRight: '5px', backgroundSize: 'contain', width: '46px', display: 'inline-block', verticalAlign: 'top' }} />
                ปัญหาผิวหน้าของคุณ
            </div>

            <div className={`fs-20 fw-4`} style={{ marginTop: '10px', marginBottom: '40px' }}>
                {selectedDisease.name}
            </div>
        </div>

        <div className={"disease-info-container"}>
            <div className="fs-24 fw-5" style={{ marginTop: '20px'}}>
                <img src={lemon} style={{ marginRight: '5px', backgroundSize: 'contain', width: '46px', display: 'inline-block', verticalAlign: 'top' }}/>
                วิธีแก้ไขปัญหา
            </div>

            <div className="fs-20 fw-4 disease-text" style={{ marginTop: '10px', marginBottom: '40px' }}>
                {selectedDisease.careInstructions}
            </div>
        </div>
    </>
)}


            <div style={{marginBottom: '30px'}}>
                <Link to="/Upload" className="result-again-button fs-20 fw-5" style={{marginRight:'24px'}}>
                    วิเคราะห์อีกครั้ง
                    <img src={sparkle} style={{ marginLeft: '10px', backgroundSize: 'contain', width: '32px', display: 'inline-block', verticalAlign: 'middle' }} />
                </Link>

                <Link to="/" className="result-end-button fs-20 fw-5">
                    ปิด
                </Link>
            </div>

        </div>
    </div>
        
  );
};

export default Result;
