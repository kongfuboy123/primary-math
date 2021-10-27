import React, { Component } from 'react';

class MathTest extends Component {
  initState = {
    // 初始化习题数组
    arr:[],
    //是否显示批改
    isShow : 'hidden',
    //是否显示答案
    isAnswer:false,
    
  };
  state = this.initState;
  //生成随机整数(min,max)为生成整数范围
  randomNumber = (min, max) =>{
    const range = max - min + 1;
    const rand = Math.random() ;
    const num = Math.floor(rand * range + min);
    return num;
  }
  // 随机生成整数， 1 为个位数，2为两位数
  getRandomNumber = (n=1) => {
        return this.randomNumber(10**(n-1),10**n-1);
  } 
  
  
  //加法
  addition = (num1, num2) => {
    
    const sum = num1 + num2
      
    return {
      Q: `${num1} + ${num2} =`,
      A: sum}
  }
    //减法
  subtraction = (num1, num2) => {
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
  
  multiplication = (num1, num2) => {
    
    const res = num1 * num2
      
    return {
      Q: `${num1} × ${num2} = `  ,
      A: res}
  }

  division = (num1, num2) => {
    
    const res = num1 / num2
    
    return {
      Q: `${num1} ÷ ${num2} = `  ,
      A: res}
    
    
  }
  /* 题库生成器，n为生成题目数量，func为题目类型,n1,n2 为数字位数，两位数就是2，个位数就1
  例如两位数加法，func就是addtion ，n1、n2 都选2 */ 
  generator = (n,func,n1,n2) =>{
    let arr = [];
    for (let i = 0; i < n; i++){
      const num1 = this.getRandomNumber(n1);
      const num2 = this.getRandomNumber(n2);
      const res = func(num1,num2);
      arr.push(Object.assign({},{index:i},res))
    }
    return arr
  }
  //
  generator2 = (n,func,n1,n2) =>{
    let arr = [];
    let count = 0;
    for (let i = 0; i < 100; i++){
      const num1 = this.getRandomNumber(n1);
      const num2 = this.getRandomNumber(n2)+1;// 除数最小值为2
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






// 处理input框内填写答案
  handleChange = (e)=>{
    //this.state.arr[e.target.name].A 为题目数组内答案，e.target.value为input内填写的答案
   
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

  resetAll = () => { 
    //reset form
    document.getElementById("data-box").reset();
    //reset state
    this.setState(this.initState);
  }
  //根据e.target.name，来选择对应的click
  handleClick = (e) => {
    
    switch (e.target.name){
      case 'add10':
        
        this.resetAll();
        this.setState({arr: this.generator(10,this.addition,1,1)});
        break;
      case 'add100':
        this.resetAll();
        this.setState({arr: this.generator(10,this.addition,2,2)});
        break;
      case 'sub10':
        this.resetAll();
        this.setState({arr: this.generator(10,this.subtraction,1,1)});
        break;
      case 'sub100':
        this.resetAll();
        this.setState({arr: this.generator(10,this.subtraction,2,2)});
        break;
      case 'multiply ':
        this.resetAll();
        this.setState({arr: this.generator(10,this.multiplication,1,1)});
        break;
      case 'division ':
        this.resetAll();
        this.setState({arr: this.generator2(10,this.division,2,1)});
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
        // e.target.innerText = '隐藏批改'
      }else{
          this.setState({
            isShow : 'hidden'
        })
        // e.target.innerText = '批改作业'
      }
        break;
      default:break;
        
    }
  }
  render() {
    return (
      <div className='container'>
        <h2 className='title'> 小学数学刷题 </h2>
        <nav >
          <button name="add10" onClick={(e)=>this.handleClick(e)}>10以内加法10道</button>
          <button name="sub10" onClick={(e)=>this.handleClick(e)}>10以内减法10道</button>
          <button name="add100" onClick={(e)=>this.handleClick(e)}>100以内加法10道</button>
          <button name="sub100" onClick={(e)=>this.handleClick(e)}>100以内减法10道</button>
          <button name="multiply " onClick={(e)=>this.handleClick(e)}>乘法10道</button>
          <button name="division " onClick={(e)=>this.handleClick(e)}>除法10道</button>
        </nav>

        <form id='data-box' onChange={this.throttle(this.handleChange,500)}>
          Question
          <ul style={{listStyle:'none'}} ref={this.myRef} >
            {this.state.arr.map(data =>
            <li key={data.index} >
              <span style={{fontWeight:200}}>({data.index+1})</span> 
              <span>{data.Q}</span>&nbsp;
              <input type="text" name={data.index} />
              <span name={data.index} style={{color:'red',visibility:`${this.state.isShow}` }}></span>
            </li>
            )}
          </ul>
        </form>
        <div>
          <button name='check' onClick={this.handleClick}>{this.state.isShow==='hidden'?'批改作业':'隐藏批改'}</button>
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


