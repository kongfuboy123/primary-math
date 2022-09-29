import React, {useState,useRef } from 'react';

const MathTest = () => {
  const initState = {
    // 初始化习题数组
    arr:[],
    //是否显示批改
    isShow : 'hidden',
    //是否显示答案
    isAnswer:false,
  }
  const [test,setTest]=useState(initState)
  const myRef = useRef()

 
   //生成随机整数(min,max)为生成整数范围
  const randomNumber = (min, max) =>{
    const range = max - min + 1;
    const rand = Math.random() ;
    const num = Math.floor(rand * range + min);
    return num;
  }
   // 随机生成整数， 1 为个位数，2为两位数
   const getRandomNumber = (n=1) => {
    return randomNumber(10**(n-1),10**n-1);
  } 

//加法
  const addition = (num1, num2) => {

  const sum = num1 + num2
    
  return {
    Q: `${num1} + ${num2} =`,
    A: sum}
  }
  //减法
  const subtraction = (num1, num2) => {
  if(num1 >= num2){
    const diff = num1 - num2
    return { 
        Q: `${num1} - ${num2} =`,
        A: diff
    }
  }else{
    const diff = num2 - num1
    return{
        Q: `${num2} - ${num1} =`,
        A: diff
    }
  }
  }

  const multiplication = (num1, num2) => {

    const res = num1 * num2
      
    return {
      Q: `${num1} × ${num2} = `  ,
      A: res}
  }

  const division = (num1, num2) => {

    const res = num1 / num2

    return {
      Q: `${num1} ÷ ${num2} = `  ,
      A: res}


  }
  /* 题库生成器，n为生成题目数量，func为题目类型,n1,n2 为数字位数，两位数就是2，个位数就1
  例如两位数加法，func就是addtion ，n1、n2 都选2 */ 
  const generator = (n,func,n1,n2) =>{
    let arr = [];
    for (let i = 0; i < n; i++){
      const num1 = getRandomNumber(n1);
      const num2 = getRandomNumber(n2);
      const res = func(num1,num2);
      arr.push(Object.assign({},{index:i},res))
    }
    return arr
  }
//
  const generator2 = (n,func,n1,n2) =>{
    let arr = [];
    let count = 0;
    for (let i = 0; i < 100; i++){
      const num1 = getRandomNumber(n1);
      const num2 = getRandomNumber(n2)+1;// 除数最小值为2
      if (num1%num2 === 0){
        const res = func(num1,num2);
        
        arr.push(Object.assign({},{index:count},res));
        count++;
        if (count >= n){
          return arr
        }
      }
    }

  }
  const handleChange = (e)=>{
    //this.state.arr[e.target.name].A 为题目数组内答案，e.target.value为input内填写的答案
  
    if(test.arr[e.target.name].A == e.target.value){
      e.target.nextElementSibling.innerText ='✓';
    }else{
      e.target.nextElementSibling.innerText ='X';
    }  
  }
  //根据e.target.name，来选择对应的click
  const handleClick = (e) => {
      
    switch (e.target.name){
      case 'add10':
        
        resetAll();
        setTest({arr: generator(10,addition,1,1)});
        break;
      case 'add100':
        resetAll();
        setTest({arr: generator(10,addition,2,2)});
        break;
      case 'sub10':
        resetAll();
        setTest({arr: generator(10,subtraction,1,1)});
        break;
      case 'sub100':
        resetAll();
        setTest({arr: generator(10,subtraction,2,2)});
        break;
      case 'multiply ':
        resetAll();
        setTest({arr: generator(10,multiplication,1,1)});
        break;
      case 'division ':
        resetAll();
        setTest({arr: generator2(10,division,2,1)});
        break;
      case 'answer':
        const flag = !test.isAnswer
        setTest({isAnswer: flag});
        break;
      case 'check':
        if(test.isShow==='hidden'){
          setTest({
            isShow : 'visible'
        })
        // e.target.innerText = '隐藏批改'
      }else{
          setTest({
            isShow : 'hidden'
        })
        // e.target.innerText = '批改作业'
      }
        break;
      default:break;
        
    }
  }
  const resetAll = () => { 
    //reset form
    document.getElementById("data-box").reset();
    //reset state
    setTest(initState);
  }
   //加个防抖
   const debounce = (fn,delay)=>{
    let timer = null;
    return (...args)=>{
      if(timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(()=>fn(...args),delay);   
    }
  }

  return(
    <div className='container'>
        <h2 className='title'> Arithmetic Calculation Exercise for Henry </h2>
        <nav >
          <button name="add10" onClick={(e)=>handleClick(e)}>Addition within 10</button>
          <button name="sub10" onClick={(e)=>handleClick(e)}>Subtraction within 10</button>
          <button name="add100" onClick={(e)=>handleClick(e)}>Addition within 100</button>
          <button name="sub100" onClick={(e)=>handleClick(e)}>Subtraction within 100</button>
          <button name="multiply " onClick={(e)=>handleClick(e)}>Multiplication</button>
          <button name="division " onClick={(e)=>handleClick(e)}>Division</button>
        </nav>

        <form id='data-box' onChange={debounce(handleChange,500)}>
          Question
          <ul style={{listStyle:'none'}} ref={myRef} >
            {test.arr.map(data =>
            <li key={data.index} >
              <span style={{fontWeight:200}}>({data.index+1})</span> 
              <span>{data.Q}</span>&nbsp;
              <input type="text" name={data.index} />
              <span name={data.index} style={{color:'red',visibility:`${test.isShow}` }}></span>
            </li>
            )}
          </ul>
        </form>
        <div>
          <button name='check' onClick={handleClick}>{test.isShow==='hidden'?'Grading':'Hidden'}</button>
        </div>
        <div style={{visibility:`${test.isShow}` }}>
          <button name='answer' onClick={e=>handleClick(e)}>Answer</button>
          {test.isAnswer && test.arr.map(data =><span key={data.index}><span style={{fontWeight:200}}>({data.index+1})</span> {data.A} </span>)}
        </div>
        
      </div>
    );
  
}

export default MathTest;


