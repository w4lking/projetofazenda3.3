import { MaskitoOptions } from "@maskito/core";

export const userNameMask: MaskitoOptions = {
    mask: /^[a-zA-Z\s]{0,40}$/,
};

export const cpfMask: MaskitoOptions = {
    mask: [
        /\d/, /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, '-', 
        /\d/, /\d/
    ],
};


export const telefoneMask: MaskitoOptions = {
    mask: [
        '(', /\d/, /\d/, ')', ' ', 
        /\d/, /\d/, /\d/, /\d/, /\d/, '-', 
        /\d/, /\d/, /\d/, /\d/, 
    ],
};

export const cepMask: MaskitoOptions = {
    mask: [
        /\d/, /\d/, /\d/, /\d/, /\d/, '-', 
        /\d/, /\d/, /\d/
    ],
};

export const cnpjMask: MaskitoOptions = {
    mask: [
        /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, '/', 
        /\d/, /\d/, /\d/, /\d/, '-', 
        /\d/, /\d/
    ],
};

export const salarioMask: MaskitoOptions = {
    mask: [
        'R', '$', ' ', 
        /\d/, /\d/, /\d/, /\d/, '.', 
        /\d/, /\d/, /\d/, ',', 
        /\d/, /\d/
    ],
};
