import React, { Component } from 'react';

class MathTest extends Component {
  state = {
    // 初始化习题数组
    arr:[],
    //是否显示答案
    isAnswer:false,
    //是否显示批改
    isShow : 'hidden',
    
    
  }
 
  //生成随机整数(min,max)为生成整数范围
  randomNumber = (min, max) =>{
    const range = max - min + 1;
    const rand = Math.random() ;
    const num = Math.floor(rand * range + min);
    return num;
  }

  //加法，n为生成题目数量
  addition = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++){
      const num1 = this.randomNumber(10,99);
      const num2 = this.randomNumber(10,99);
      const sum = num1 + num2
      arr.push ({
          index: i,
          Q: `${num1} + ${num2} =`,
          A: sum
      })
    }
    return arr
  }
  //减法
  subtraction = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++){
      const num1 = this.randomNumber(10,99);
      const num2 = this.randomNumber(10,99);
      if(num1 >= num2){
        const diff = num1 - num2
        arr.push ({
            index: i,
            Q: `${num1} - ${num2} =`,
            A: diff
        })
      }else{
        const diff = num2 - num1
        arr.push ({
            index: i,
            Q: `${num2} - ${num1} =`,
            A: diff
        })
      }
     
    }
    return arr
  }

// 处理input框内填写答案
  handleChange = (e)=>{
    //this.state.arr[e.target.name].A 为题目数组内答案，e.target.value为input内填写的答案
    console.log(e.target.value)
    if(this.state.arr[e.target.name].A == e.target.value){
      e.target.nextElementSibling.innerText ='✓';
    }else{
      e.target.nextElementSibling.innerText ='X';
    }  
  }
  //加个防抖
  throttle = (fn,delay)=>{
    let timer = null;
    return (...args)=>{
      if(timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(()=>fn.apply(this,args),delay);   
    }
  }
  //根据e.target.name，来选择对应的click
  handleClick = (e) => {
    console.log(e.target.name);
    switch (e.target.name){
      case 'add':
        const addArr = this.addition(20);
        this.setState({arr: addArr});
        break;
      case 'sub':
        const subArr = this.subtraction(20);
        this.setState({arr: subArr});
        break;
      case 'answer':
        const flag = !this.state.isAnswer
        this.setState({isAnswer: flag});
        break;
      case 'check':
        if(this.state.isShow==='hidden'){
          this.setState({
            isShow : 'visible'
        })
        e.target.innerText = '隐藏批改'
      }else{
          this.setState({
            isShow : 'hidden'
        })
        e.target.innerText = '批改作业'
      }
        break;
      default:break;
        
    }
  }
  render() {
    return (
      <div>
        <button name="add" onClick={(e)=>this.handleClick(e)}>加法20道</button>
        <button name="sub" onClick={(e)=>this.handleClick(e)}>减法20道</button>
        {/* <div onChange={this.handleChange}> */}
        <div onChange={this.throttle(this.handleChange,500)}>
          Question
          <ul style={{listStyle:'none'}} ref={this.myRef} >
            {this.state.arr.map(data =>
            <li key={data.index} >
              <span style={{fontWeight:200}}>({data.index+1})</span> 
              <span>{data.Q}</span>
              <input type="text" name={data.index} />
              <span name={data.index} style={{color:'red',visibility:`${this.state.isShow}` }}></span>
            </li>
            )}
          </ul>
        </div>
        <div>
          <button name='check' onClick={this.handleClick}>批改作业</button>
        </div>
        <div style={{visibility:`${this.state.isShow}` }}>
          <button name='answer' onClick={e=>this.handleClick(e)}>Answer</button>
          {this.state.isAnswer && this.state.arr.map(data =><span key={data.index}><span style={{fontWeight:200}}>({data.index+1})</span> {data.A} </span>)}
        </div>
        
      </div>
    );
  }
}

export default MathTest;