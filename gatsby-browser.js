import React from 'react';
import AlgoSigner from './src/components/AlgoSigner/AlgoSigner.component';

export const wrapRootElement = ({ element }) => (
  <AlgoSigner>{element}</AlgoSigner>
);
