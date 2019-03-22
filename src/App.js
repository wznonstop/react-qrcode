import React, { Component } from 'react';
import QRCode from 'qrcode';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // sourceTexts: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六',  // 要放到中间部分的所有文字
      sourceTexts: '一二三四',  // 要放到中间部分的所有文字
      targetUrl: 'https://www.baidu.com',  // 二维码指向的地址
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
      ctx.globalAlpha = 0.97;
      ctx.fillStyle = '#fff';
      ctx.fillRect(94, 100, 115, 115); // 中间部分方块的绘制
      ctx.font = '16px Microsoft Yahei';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#474747';

      const texts = sourceTexts.slice(0, 36);   // 中间部分最多能放36个字，其他部分截掉
      const maxLines = 6;         //当前设置下最多6行
      const drawWidth = 100;      // 限定文字部分的宽度
      const drawStartX = 153;     // 文字X轴的位置
      const drawStartY = 125;     // 文字Y轴的位置
      const lineHeight = 16;      // 文字高度

      let lastTextIndex = 0;
      const arr = [];

      for(let i = 0; i < texts.length; i++){
        //获取当前的截取的字符串的宽度
        let lineWidth = ctx.measureText(texts.substr(lastTextIndex, i - lastTextIndex)).width;

        if(lineWidth > drawWidth){
          arr.push(texts.substr(lastTextIndex, i - lastTextIndex - 1));
          lastTextIndex = i - 1;
        }

        //将最后多余的一部分添加到数组
        if(i === texts.length - 1){
          lineWidth = ctx.measureText(texts.substr(lastTextIndex)).width;
          if(lineWidth < drawWidth){
            arr.push(texts.substr(lastTextIndex));
          } else {
            // 如果最后一部分的数据超长，那么就分成两部分
            const leftTexts = texts.substr(lastTextIndex);
            for (let x = 0; x < leftTexts.length; x++){
              lineWidth = ctx.measureText(leftTexts.slice(0, x + 1)).width;
              if(lineWidth > drawWidth){
                arr.push(leftTexts.slice(0, x - 1))
                arr.push(leftTexts.slice(x - 1))
                break;
              }
            }
          }
        }
      }
      const lineCount = arr.length;
      // 为保持文字垂直方向居中，添加的额外高度
      const extraHeight = (maxLines/2 - 0.5 * lineCount) * lineHeight;
      for(let i =0; i < arr.length; i++){
        ctx.fillText(arr[i], drawStartX, drawStartY + i * lineHeight + extraHeight);
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
