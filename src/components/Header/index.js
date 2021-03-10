import React from 'react';
import { css } from '@emotion/css';
const Header = () => {
    return(
        <>
            <div className={css `
                width: 100%;
                height: auto;
                padding: 0;
                background-color: #f5f5f5; 
            `}>
                <div className={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    margin: 0 auto 30px;
                `}>
                    <h3 className={css`padding: 0; margin: 0;`}>Budget App</h3>
                    <ul className={css`
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        list-style: none;
                    `}>
                        <li className={css`
                            margin: 0 10px;
                        `}>
                            <a className={css`
                                text-decoration: none;
                                font-weight: 500;
                                color: #2a2a2a;
                            `} href="javascript:void(0);">Home</a>
                        </li>
                        <li>
                            <a className={css`
                                text-decoration: none;
                                font-weight: 500;
                                color: #2a2a2a;
                            `} href="javascript:void(0);">About Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Header;