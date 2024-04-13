import React from "react";
import "./Home.css";
import { Link } from "react-router-dom"
import sparkle from '../../images_anim/icon_sparkl.png'

const Home = () => {
    return (
        <div className='holder'>
            <header className='home'>
                <div className='home-content flex'>
                
                <Link to="/upload" className='home-button fs-20 fw-5'>
                    <img src={sparkle} alt='Q-icon' style={{ marginRight: '10px', backgroundSize: 'contain', width: '32px', display: 'inline-block', verticalAlign: 'middle' }} />
                    เริ่มวิเคราะห์ผิวของคุณ
                </Link>
                
                </div>
            </header>
        </div>
    );
}

export default Home;
