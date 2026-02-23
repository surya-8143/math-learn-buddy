import React from 'react';

const ProductInfo = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Product Details</h1>

      {/* 🟢 CARD 1: DEVELOPED BY (Text Left, Photo Right) */}
      <div className="details-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          
          {/* LEFT: YOUR DETAILS */}
          <div style={{ textAlign: 'left', flex: 1 }}>
            <center><h3 style={{ marginTop: 0, color: '#2d3436' }}>Developed By</h3></center>
            <p style={{ margin: '5px 0' }}><strong>Name:</strong> N. Surya Tejeswar Reddy</p>
            <p style={{ margin: '5px 0' }}><strong>Roll No:</strong> CB.SC.U4CSE23127</p>
            <p style={{ margin: '5px 0' }}><strong>Course Code:</strong> 23CSE461</p>
            <p style={{ margin: '5px 0' }}><strong>Course:</strong> FullStack FrameWorks</p>
            <p style={{ margin: '5px 0' }}><strong>Dept:</strong> CSE</p>
            <p style={{ margin: '5px 0' }}><strong>College</strong> Amrita Vishwa Vidyapeetham</p>
          </div>

          {/* RIGHT: YOUR PHOTO (Clickable) */}
          <a 
            href="https://surya-8143.github.io/Portfolio/" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Click to view Portfolio"
          >
            <img 
              src="/surya.jpg" 
              alt="Surya" 
              style={{ 
                width: '130px', 
                height: '130px', 
                borderRadius: '50%',       /* Circular */
                objectFit: 'cover',        /* Prevents stretching */
                cursor: 'pointer',         /* Shows hand icon on hover */
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                marginLeft: '20px'         /* Space between text and image */
              }} 
            />
          </a>

        </div>
      </div>

      {/* 🟢 CARD 2: COURSE DETAILS */}
      <div className="details-card">
        <center><h3 style={{ marginTop: 0 }}>Course Details</h3></center>
        <p><strong>Professor:</strong> Dr. T. Senthil Kumar</p>
        <p>Amrita School of Computing</p>
        <p>Amrita Vishwa Vidyapeetham</p>
        <p>Coimbatore - 641112</p>
        <p>Email: <a href="mailto:t_senthilkumar@cb.amrita.edu">t_senthilkumar@cb.amrita.edu</a></p>

      </div>

    </div>
  );
};

export default ProductInfo;