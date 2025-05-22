import React from 'react';

   const MockImage = ({ src, alt, width, height, className }) => (
     <img src={src} alt={alt} width={width} height={height} className={className} />
   );

   export default MockImage;