import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

export default function Slide({ title, descriptions, link }) {
  return (
    <div className={styles.slideContent}>
      <h2 className={styles.title}>{title}</h2>
      
      <div className={styles.descriptionsContainer}>
        {descriptions.map((desc, index) => (
          <div 
            key={index} 
            className={styles.messageBubble} 
            style={{ backgroundColor: desc.color }}
          >
            {desc.text}
          </div>
        ))}
      </div>

      {link && (
        <Link 
          to={link.to} 
          className={styles.ctaLink}
          style={{ backgroundColor: link.color }}
        >
          {link.text}
        </Link>
      )}
    </div>
  );
}