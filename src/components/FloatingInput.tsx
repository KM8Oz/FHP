import React, { InputHTMLAttributes, useState } from "react";
import styled from "styled-components";
import { COLORS, FONTS } from "../utils";

export function TextInput({ type = 'text', label, iserror, ...rest }: InputHTMLAttributes<any> & { iserror:boolean, label: string }) {
    const [value, setValue] = useState('');

    function handleChange(e: { target: { value: React.SetStateAction<string>; }; }) {
        setValue(e.target.value);
    }
    return (
        <InputContainer {...rest}>
            <input maxLength={30} className={value && 'filledinput'} name={label} type={type} value={value} onChange={handleChange} />
            <label style={{
                color: iserror ? COLORS.error : COLORS.black
            }} className={value && 'filled'} htmlFor={label}>
                {label}
            </label>
        </InputContainer>
    );
}

const InputContainer = styled.div`
      font-family: ${FONTS.MAIN};
    /* Input style */
      position: relative;
      display: flex;
      flex-direction: column;
    
    :focus-within label {
      transform: translate(0, 12px) scale(0.8);
      color: #171717;
    }
    .filled {
      transform: translate(0, 12px) scale(0.8);
      background-color: white;
    }
     .filledinput {
      background-color: white;
    }
    
     label {
      position: absolute;
      pointer-events: none;
      transform: translate(0, 23px) scale(1);
      transform-origin: top left;
      transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      font-size: 13px;
      line-height: 1;
      left: 16px;
    }
    
     input {
      height: 24px;
      border-radius:9px;
      border: none;
      background-color: transparent;
      padding: 24px 16px 4px 16px;
      font-size: 13px;
      line-height: 1;
      outline: none;
      box-shadow: none;
      transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    
     input:focus {
      box-shadow: 0 0 0 2px #404040;
    }
`;