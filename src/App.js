import React, { Component } from 'react';
import QRCode from 'qrcode';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceTexts: '一二三四五六七八九十一二三四五六',  // 要放到中间部分的所有文字
      targetUrl: 'http://www.baidu.com',  // 二维码指向的地址
    }

    this.canvasRef = React.createRef();
    this.imgRef = React.createRef();
  }

  componentDidMount() {
    const { sourceTexts, targetUrl } = this.state;
    this.renderQrCode(sourceTexts, targetUrl);
  }

  renderQrCode = (sourceTexts, targetUrl) => {
    const imgRef = this.imgRef.current;
    QRCode.toCanvas(this.canvasRef.current, targetUrl, {
      width: '300',
      errorCorrectionLevel: 'H'
    },function (error, c) {
      if (error) console.error(error);
      const ctx = c.getContext("2d");
      ctx.fillStyle = '#fff';
      ctx.fillRect(120, 120, 65, 68); // 中间部分方块的绘制
      ctx.font="14px Microsoft Yahei";
      ctx.textAlign = 'left';
      ctx.fillStyle = '#474747';

      const texts = sourceTexts.slice(0, 16);   // 中间部分最多能放16个字，其他部分截掉
      const drawWidth = 60;     // 限定文字部分的宽度
      const drawStartX = 125;   // 文字X轴的位置
      const drawStartY = 135;   // 文字Y轴的位置
      const lineHeight = 16;   // 文字高度

      let lastTextIndex = 0;
      const arr = [];

      for(let i = 0; i < texts.length; i++){
        //获取当前的截取的字符串的宽度
        const lineWidth = ctx.measureText(texts.substr(lastTextIndex, i - lastTextIndex)).width;

        if(lineWidth > drawWidth){
          arr.push(texts.substr(lastTextIndex, i - lastTextIndex - 1));
          lastTextIndex = i - 1;
        }

        //将最后多余的一部分添加到数组
        if(i === texts.length - 1){
          arr.push(texts.substr(lastTextIndex, i - lastTextIndex + 1));
        }
      }

      for(let i =0; i<arr.length; i++){
        ctx.fillText(arr[i], drawStartX, drawStartY + i * lineHeight);
      }

      // 将canvas转为base64图片
      imgRef.src = c.toDataURL("image/png");
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <canvas ref={this.canvasRef} style={{display: 'none'}}/>
          <img src="" ref={this.imgRef} alt="二维码" style={{width: '90%'}}/>
        </header>
      </div>
    );
  }
}

export default App;
