// First, create a ProfileTooltip component
import React from 'react';
import styled from 'styled-components';

const ProfileTooltip = ({ photoURL, onClick, tooltipText = "Profile" }) => {
  return (
    <StyledWrapper>
      <div className="tooltip-container" onClick={onClick}>
        <span className="tooltip">{tooltipText}</span>
        <span className="text">
          <div className="borde-back">
            <div className="profile-icon ">
              <img 
                src={photoURL || "https://via.placeholder.com/40"} 
                alt="Profile" 
                className="profile-image rounded-full" 
              />
            </div>
          </div>
        </span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* This is an example, feel free to delete this code */
  .tooltip-container {
    position: relative;
    background-color: #f47fff;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 17px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    fill: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 25px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
  .tooltip-container .borde-back {
    width: 46px;
    height: 46px;
    background-color: #b7b9bf;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: none;
  }

  .tooltip-container .profile-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background-color: #5865f2;
    cursor: pointer;
  }
  

  .tooltip {
    position: absolute;
    top: -2;
    left: -45px; /* Altere a posição inicial para a esquerda, fora da tela */
    transform: translateX(
      -32%
    ); /* Usando translateX para controlar a transição da esquerda para a direita */
    width: 120px;
    height: 40px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.6s;
    border-radius: 50px;
    background-color: #f47fff;
    background-image: linear-gradient(
      -90deg,
      #f47fff 0%,
      #5865f2 75%,
      #5865f2 100%
    );
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 16px;
    color: #fff;
    font-size: 18px;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
  }

  .tooltip::before {
    position: absolute;
    content: "";
    height: 0.6em;
    width: 0.6em;
    right: -0.2em; /* Mude para a direita */
    top: 50%; /* Altere o topo para o meio da tooltip */
    transform: translateY(-50%) rotate(45deg); /* Use translateY para centralizar verticalmente */
    background: var(--background);
  }

  .tooltip-container:hover .tooltip {
    left: 100%; /* Altere para a posição desejada (a direita) */
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: -10;
    
  }
  .tooltip-container:hover {
    transform: translateX(-50px);
    transition: 0.5s linear;
    width: 45px;
    margin-right: 10px; 
    margin-left: 40px;
  }`;

export default ProfileTooltip;