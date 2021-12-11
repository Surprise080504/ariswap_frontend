import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WidgetWrapper = styled.div`
  height: 70px;
  background: #ffffff;
  box-shadow: 0px 8px 30px rgba(53, 88, 199, 0.22);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  position: relative;

  img {
    width: 50px;
  }

  input {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .right {
    margin-left: 50px;
    height: 100%;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 5px;
  border-radius: 10px;
  background: #e8eef4;
  margin-top: 20px;
  position: relative;

  div {
    width: ${({ percentage }) => `${percentage}%`};
    transition: width 1s;
    height: 100%;
    background: #f17d7d;
  }
`;

export const Count = styled.p`
  font-size: 20px;
  margin-left: 50px;
`;
