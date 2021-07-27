import React, { Component, useContext, useRef, useState } from "react";
import { UserContext } from '../../store/users';
import { useSelector, useDispatch } from "react-redux";
// import { AgGridColumn, AgGridReact } from "ag-grid-react";
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Container, Row, Col } from "react-grid-system";
import styled from "styled-components";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { isoParse } from "d3";
import { setCurTodayState } from "../../module/todaystatelist";
import { firestore } from '../../fBase';

const Wrapper = styled.div`
  margin: 0.75vh 0.5vw;
  background: #ffffff;
  border: 0.4vmin solid #f0f1f0;
  border-radius: 0.8vmin;
`;

const ToggleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3px;
  text {
    color: #1185af;
    font-weight: bold;
    font-size: 0.8rem;
    margin-left: 0.5vw;
    margin-top: 0.15vh;
    margin-bottom: 0.15vh;
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  cursor: pointer;
  position: relative;
  z-index: 3;
`;

const TodayStateList = styled.ul`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  height: 20vh;
  width: 13.8vw;
  flex-direction: column;
  padding: 10px;
  margin-top: 2px;
  overflow: scroll;
  overflow-x: hidden;

  // border-top: 0.4vmin solid #f0f1f0;
  border-top: 0.1vmin solid #333333;
  border-bottom: 0.1vmin solid #333333;
  border-left: 0.1vmin solid #333333;
  border-right: 0.1vmin solid #333333;

  background: #ffffff;
  color: #333333;
  position: absolute;
  z-index: 5;
`;

const Button = styled.button`
  background-color: white;
  color: black;
  font-size: 0.9rem;
  padding: 0.05vh 3vw;
  border-radius: 5px;
  border: white;
  cursor: pointer;

`;

const Li = styled.li`
  padding: 0.8vh;
  width: 100%;
  display: flex;
  &:first-of-type {
    padding-top: 0;
  }
  &:last-of-type {
    padding-bottom: 0;
  }
  &:not(:last-of-type) {
    border-bottom: 1px solid #a5a5a5;
  }
  cursor: pointer;
  W &:hover {
    font-weight: bold;
  }
  p: {
    display: flex;
    margin-top: 0.3vh;
    color: #000000;
    font-size: 0.4rem;
  }
`;

const TodayState = () => {
  const context = useContext(UserContext);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { list: todaystatelist } = useSelector((state) => state.todaystatelist);
  const { curTodayState } = useSelector((state) => state.todaystatelist);
  const todaystatelistRef = useRef();

  function changeTodayState(item) {
    dispatch(
      setCurTodayState({
        idx: 0,
        title: item,
      }),
    );
    const onEditMessageSubmit = async () => {
      await firestore.doc(`users/${ context.id }`).update({
        state: item
      });
    };
    onEditMessageSubmit();
    console.log('aa')
  }
  
  return (
    <Wrapper>
      <ToggleHeader>
        <text> TODAY IS.. { context.state }</text>
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
        </ToggleButton>
      </ToggleHeader>

      <TodayStateList ref={todaystatelistRef} isOpen={isOpen}>
        {todaystatelist.map((item, index) => (
          <Li key={index} data-title={item}>
            <a onClick={() => changeTodayState(item)} rel="noreferrer" target="_blank">
              <Button>
                <p>{item}</p>
              </Button>
            </a>
          </Li>
        ))}
      </TodayStateList>
    </Wrapper>
  );
};

export default TodayState;