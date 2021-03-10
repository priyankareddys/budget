import React from 'react';
import { css } from '@emotion/css';

const Footer = () => {
    return(
        <div className={css`
            width: 100%;
            background-color: #555;
            padding: 20px 0;
            margin: 40px auto 0;
            display: flex;
            color: #fff;
            align-items: center;
            justify-content: center;
        `}>
             Footer
        </div>
    );
}

export default Footer;

