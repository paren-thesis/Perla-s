import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <div className="about-content">
        <div className="about-text">
          <p>
            Welcome to <strong>Perla's</strong>, where passion meets flavor! We are a family-owned restaurant
            dedicated to serving delicious, high-quality meals made from the freshest ingredients. Our journey
            began in 2010 with a simple mission: to create a dining experience that feels like home.
          </p>
          <p>
            At Perla's, we believe that food is more than just sustenance—it's an art form. Our chefs are
            passionate about crafting dishes that delight the senses and bring people together. Whether you're
            here for a quick bite or a leisurely meal, we strive to make every visit memorable.
          </p>
          <p>
            Join us and discover why Perla's has become a beloved destination for food lovers everywhere. We
            look forward to serving you!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
