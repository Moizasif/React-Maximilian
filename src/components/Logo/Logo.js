import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import styles from './Logo.module.css';


const logo = (props) => (
   <div class={styles.Logo}>
       <img src = {burgerLogo} />
   </div>

);

export default logo;