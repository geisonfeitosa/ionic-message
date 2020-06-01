import { Component } from '@angular/core';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  serverUrl = 'http://localhost:8080/socket';
  title = 'Iot';
  stompClient;

  temp;
  humid;
  ligado;
  dadosJson = {};
  lineChartTemp = [];
  lineChartHumid = [];
  lineChartLabels = [];
  lineChartOptions:any = {
    responsive: true
  };

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      this.lineChartTemp = [];
      this.lineChartHumid = [];
      that.stompClient.subscribe("/chat", (message) => {
        if(message.body) {
//          $(".chat").append("<div class='message'>" + message.body + "</div>");
          this.dadosJson = JSON.parse(message.body);
          if(this.dadosJson.number != undefined) {
            if(JSON.parse(message.body).number == 1) {
              that.ligado = true;
            } else {
              that.ligado = false;
            }
          }
          if(this.dadosJson.temp != undefined && this.dadosJson.humid != undefined) {
            that.temp = this.dadosJson.temp;
            that.humid = this.dadosJson.humid;
/*            this.lineChartTemp.push(that.temp);
            this.lineChartHumid.push(that.humid);
*/
          }
          this.dadosJson = {};
/*          if(this.lineChartTemp.length > 10) {
            this.lineChartTemp.shift();
          }
          if(this.lineChartHumid.length > 10) {
            this.lineChartHumid.shift();
          }
*/
        }
/*        console.log(this.lineChartTemp);
        console.log(this.lineChartHumid);
*/
      });
    });
  }

  sendMessage(message) {
    this.stompClient.send("/app/send/message", {}, message);
    $('#input').val('');
  }

  sendLed(message) {
    this.stompClient.send("/app/send/led", {}, message);
    $('#input').val('');
  }

}
