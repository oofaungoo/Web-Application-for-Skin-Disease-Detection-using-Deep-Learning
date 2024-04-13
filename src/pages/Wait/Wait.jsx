import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import LemonWalk from '../../images_anim/LemonWalk';
import { Link } from "react-router-dom"
import "./Wait.css";

const Wait = () => {
    const navigate = useNavigate();
    const [loadingText, setLoadingText] = useState('.');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoadingText(prevText => {
                switch (prevText) {
                    case '.':
                        return '..';
                    case '..':
                        return '...';
                    case '...':
                        return ' ';
                    case ' ':
                        return '.';
            default:
                return prevText;
                }
            });
        }, 1000); // Change loading text every second

        const timeoutId = setTimeout(() => {
            navigate('/result');
        }, 10000); // 10 seconds delay for navigation

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [navigate]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: LemonWalk,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
    };

    return (
        <div className='container'> {/* Wrap everything in a container */}
            <div className='holder'>

                <div className='fs-24 fw-3' style={{marginTop: '64px', marginLeft: '146px'}}>
                    รอก่อนนะ!
                </div>

                <div className='fs-24 fw-3' style={{marginLeft: '32px'}}>
                    น้องเลมอนกำลังช่วยตรวจสอบให้
                </div>

                <Lottie options={defaultOptions} height={400} width={400} />
                <div classname='fs-26 fw-8'></div>


                <div className='fs-24 fw-5' style={{marginLeft: '80px'}}>
                    กำลังวิเคราะห์สภาพผิว{loadingText}
                </div>

                <Link to="/Upload" className="wait-button fs-22 fw-5 text-yellow" style={{marginLeft: '130px', marginTop: '20px'}}>
                    ยกเลิก
                </Link>
            </div>
        </div>
    );
}

export default Wait;
