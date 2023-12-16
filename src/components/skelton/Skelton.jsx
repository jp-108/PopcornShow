import React from "react";
import "./style.scss";
function Skelton({ minWidth, height, skeltonCount = 1, margin = 0}) {
  const skelton = [];

  for (let i = 0; i < skeltonCount; i++) {
    skelton.push(
      <div key={i} className='skeleton-container' style={{ minWidth: minWidth, height: height, margin:margin }}>
        <div className='skeleton-shape'>
          <div className='shine'></div>
        </div>
      </div>
    );
  }
  return <>{skelton}</>;
}

export default Skelton;
