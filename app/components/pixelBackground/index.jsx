import React from 'react'
import styles from './style.module.css'

export default function index() {
    const getBlocks = () => {
        const { innerWidth, innerHeight } = window;
        const blockSize = window.innerWidth * 0.05;
        const amountOfBlocks = Math.ceil(innerWidth / blockSize);
        return [...Array(amountOfBlocks)].map((_, index) => {
            return (
                <div className={styles.block} key={index} style={{ width: blockSize, height: blockSize }}></div>
            )
        })
    }
    return (
        <div className={styles.pixelBackground}>
            {
                [...Array(20)].map((_, index) => {
                    return (
                        <div className={styles.column} key={index}>
                            {
                                getBlocks()
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}