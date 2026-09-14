import dynamic from 'next/dynamic';
export { config } from './config';
export { default as translations } from './translations';
export const component = dynamic(() => import('./Activity'));
